import { PubSub } from "graphql-subscriptions";
import {includes} from 'lodash';
import {channel} from "diagnostics_channel";

const file_message = require("./data/message.json");

const users = require("./data/user.json");
const channels = require("./data/channel.json");
const messages = file_message;
const pubsub = new PubSub();

// @ts-ignore
export default {

    Query: {
        channels: () => channels,
        users: () => users,
        messages: () => messages,
        user(parent:any, args:any, ctx:any, info:any) {
            if (!args.id) {
                throw new Error('id is required')
            }
            return users.find((user: { id: number; }) => user.id === +args.id)
        },
        channel(parent:any, args:any, ctx:any, info:any) {
            if (!args.id) {
                throw new Error('id is required')
            }
            return channels.find((channel: { id: number; }) => channel.id === +args.id)
        },
        message(parent:any, args:any, ctx:any, info:any) {
            if (!args.id) {
                throw new Error('id is required')
            }
            return messages.find((message: { id: number; }) => message.id === +args.id)
        },
        getUserChannels(parent:any, args:any, ctx:any, info:any) {
            if (!args.id) {
                throw new Error('id is required')
            }
            return channels.filter((channel: { userId: [number]; }) => includes(channel.userId,+args.id))
        },

    },
    User:{
        messages(parent:any, args:any, ctx:any, info:any) {
        return messages.filter((message: { userId: number; }) => message.userId === parent.id)
        },
        channels(parent:any, args:any, ctx:any, info:any) {
        return channels.filter((channel: { userId: [number]; }) => includes(channel.userId,parent.id))
        }
    },
    Message:{
        channel(parent:any, args:any, ctx:any, info:any) {
            return channels.find((channel: { id: number; }) => channel.id === parent.channelId)
        },
        user(parent:any, args:any, ctx:any, info:any) {
        return users.find((user: { id: number; }) => user.id === parent.userId)
        }
    },
    Channel:{
        users(parent:any, args:any, ctx:any, info:any) {
            return users.filter((user: { id: number; name:string; picture:string }) => includes(parent.userId,user.id) &&(user.name.trim() !="" && user.picture.trim() !=""))
        },
        messages(parent:any, args:any, ctx:any, info:any) {
           return messages.filter((message: { channelId: number, date:string }) => message.channelId === parent.id && message.date.trim() !="")
        }
    },
    Mutation: {
        createUser: (parent:any, args:any, context:any) => {
            if (!args.name) {
                throw new Error('Name is required')
            }
            let name = args.name
            const user = { id: users.length + 1, name };
            pubsub.publish('NEW_USER', { userCreated: user });
            users.push(user)
            return user
        },
        createChannel: (parent:any, args:any, context:any) => {
            if (!args.name) {
                throw new Error('name is required')
            }
            if (!args.userId) {
                throw new Error('userId is required')
            }
            let name = args.name
            let userId = []
            userId.push(args.userId)
            const channel = { id: channels.length + 1, name, userId };
            pubsub.publish('NEW_CHANNEL', { channelCreated: channel });
            channels.push(channel)
            return channel
        },
        sendMessage: (parent:any, args:any, context:any) => {
            if (!args.content) {
                throw new Error('content is required')
            }
            if (!args.channelId) {
                throw new Error('channelId is required')
            } if (!args.userId) {
                throw new Error('userId is required')
            }
            let userId = args.userId
            let channelId =args.channelId

            if (isUserInTheChannel(userId,channelId)){
                let content = args.content
                let date = Date.now()

                const message = { id: messages.length + 1, content, channelId,userId,date };
                pubsub.publish('NEW_MESSAGE', { messageSent: message });
                messages.push(message)
                return message
            }

        },

        joinChannel(parent:any, args:any, ctx:any, info:any) {
            if (!args.userId) {
                throw new Error('id is required')
            }
            if (!args.chanelId) {
                throw new Error('chanelId is required')
            }
            let channel = channels.find((channel: { id: number; }) => channel.id === +args.chanelId)
            channel.userId.push(args.userId)
            return channel
        }
    },
    Subscription:{
        userCreated:{
            subscribe:() =>pubsub.asyncIterator(["NEW_USER"])
        },
        channelCreated:{
            subscribe:() =>pubsub.asyncIterator(["NEW_CHANNEL"])
        },
        messageSent:{
            subscribe:() =>pubsub.asyncIterator(["NEW_MESSAGE"])
        }
    }
};
function isUserInTheChannel(userId:number,channelId:number)
{
    let channel = channels.find((channel: { id: number; }) => channel.id === channelId)
    if(includes(channel.userId,userId) ){
        return true
    }else {
        throw new Error('The user is not a member of the channel')
    }
}