import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { split, HttpLink } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { useState } from "react";
import Channels from "./Channel/channel";
import CreateChannel from "./Channel/createChannel";

const wsLink = new WebSocketLink({
    uri: "ws://localhost:4000/graphql",
    options: {
        reconnect: true,
    },
});

const httpLink = new HttpLink({
    uri: "http://localhost:4000/graphql",
});

const link = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
        );
    },
    wsLink,
    httpLink
);

const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});

const App = () => {
    const [name] = useState<string>("");
    // const [name, setName] = useState<string>("");
    // const [entered, setEntered] = useState<boolean>(false);

    return (
        <ApolloProvider client={client}>
            <div className="App">
                <div>
                    <h1>Channels</h1>
                    <div>
                        <CreateChannel name={name} />
                        <Channels />
                    </div>
                </div>

            </div>
        </ApolloProvider>
    );
};

export default App;