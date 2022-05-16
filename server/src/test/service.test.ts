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
        const result = await testServer.executeOperation({
            query: `query getChannel($channelId: Int!) {
              channel(id: $channelId) {
                name
              }
            }`,
            variables: { channelId: 1 },


        });
        expect(result).toHaveProperty("data");
        expect(result.data?.channel.name).toBe("channel one");
    });

    test("Test mutation channel", async () => {
        const result = await testServer.executeOperation({
            query: `mutation CreateChannel($name: String!, $userId: Int!) {
              createChannel(name: $name, userId: $userId) {
                id
                name
              }
            }`,
            variables: { name: "test", userId: 1 },


        });
        expect(result).toHaveProperty("data");
        expect(result.data?.createChannel.name).toBe("test");
    });
});
