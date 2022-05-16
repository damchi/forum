import  typeDefs  from "../schema";
import resolvers from "../resolver";
import {ApolloServer} from "apollo-server-express";

const testServer = new ApolloServer({
    typeDefs,
    resolvers
});

describe("Channel Schema", () => {
    test("Test all channels", async () => {
        const query = `
        {
            channels: channels {
                name
            }
        }
    `;

        const result = await testServer.executeOperation({
            query: query
        });
        expect(result).toHaveProperty("data");
        expect(result.errors).toBeFalsy();
    });

    test("Test get one channel", async () => {
        const query = `
               {
          channel($channelId: number) {
            id
            name
          }
        }
    `;

        const result = await testServer.executeOperation({
            query: `query getChannel($channelId: Int!){ channel(id: $channelId)}`,
            variables: { channelId: 1 },


        });
        console.log(result)
        expect(result).toHaveProperty("data");
        expect(result.data.name).toHaveProperty("channel one");
    });
});
