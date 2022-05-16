export default gql`
type User {
id: ID!
name: String!
messages: [Message]
channels: [Channel]
picture: String!
}
type Channel {
id: ID!
name: String!
users: [User]
messages: [Message]
private:Boolean!
admin: User!
}

type Message {
id: ID!
content: String!
channel: Channel!
user: User!
date: String!
}

type Query {
users: [User]
user(id: ID!): User
channels: [Channel]
channel(id: Int!):Channel
messages:[Message]
message(id:ID!):Message
getUserChannels(id:ID!): [Channel]
}

type Mutation{
createUser(name: String!): User
createChannel(name: String!, userId: Int!, private:Boolean!): Channel
sendMessage(content: String!, channelId: Int!, userId: Int!): Message
joinChannel(userId: Int!, chanelId:Int!):Channel
acceptJoinRequest(userId:Int!, chanelId:Int!):Channel
}
type Subscription{
userCreated: User
channelCreated: Channel
messageSent: Message
joinedChannel :Channel
}
`;
