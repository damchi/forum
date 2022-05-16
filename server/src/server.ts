import express from "express";
import {ApolloServer} from "apollo-server-express";
import {ApolloServerPluginDrainHttpServer} from "apollo-server-core";
import {WebSocketServer} from "ws";
import {useServer} from "graphql-ws/lib/use/ws";
import * as http from "http";
import { makeExecutableSchema } from "@graphql-tools/schema";
import cors from "cors";

import typeDefs  from "./schema";
import resolvers from "./resolver";

const schema = makeExecutableSchema({ typeDefs, resolvers });

async function startApolloServer() {
    const app = express();
    app.use(cors({ origin: "*", credentials: true }));
    const httpServer = http.createServer(app);

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: "/graphql",

    });

    const serverCleanup = useServer({
        schema

    }, wsServer);

    const server = new ApolloServer({
        schema,
        csrfPrevention: true,
        plugins: [
            ApolloServerPluginDrainHttpServer({httpServer}),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });
    await server.start();

    server.applyMiddleware({app});
    httpServer.listen({port: 4000}, () => {
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
        console.log(`🚀 Subscriptions ready at ws://localhost:4000${server.graphqlPath}`);

    });
}


startApolloServer().catch((err) => {
    console.log(err);
});
