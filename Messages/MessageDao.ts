import Message from "./Message";
import MessageModel from "./MessageModel";
import {MongoToClassConverter} from "../MongoToClassConverter";
import UserDao from "../Users/UserDao";

export default class MessageDao {
    private static mSingleton: MessageDao = new MessageDao()

    /**
     * This enforces Singleton Architecture
     */
    public static getInstance() {
        return this.mSingleton
    }

    /**
     * This enforces Singleton Architecture
     */
    private constructor() {
    }

    /**
     * creates a message entry
     * @param senderUid
     * @param recipientUid
     * @param contentToSend
     * @param isPrivate
     */
    async createMessage(senderUid: string,
                        recipientUid: string,
                        contentToSend: string, isPrivate: boolean): Promise<Message> {
        const mResp = await MessageModel.create({content: contentToSend,
            sender: senderUid,recipient: recipientUid ,privacyStatus: false})

        const conv = new MongoToClassConverter()
        return await conv.convertToMessage(mResp)
    }

    /**
     * Gets all messages from db
     */
    async getAllMessages(): Promise<Message[]> {
        const allMsgJSON =  await MessageModel.find()
        const converter = new MongoToClassConverter();

        let arrResp = []
        for (const eachJSON of allMsgJSON) {
            arrResp.push(await converter.convertToMessage(eachJSON))
        }

        return arrResp

    }

    /**
     * Gets all messages seny by user with matching username
     * @param username
     */
    async getAllMessagesSentBy(username: string): Promise<Message[]> {
        const uDao = UserDao.getInstance()
        const senderUser = await uDao.findUserbyUserName(username)

        //If user does not exist return null
        if (senderUser == null || senderUser == undefined) {
            return null;
        }

        // if user exists get user id
        const userId = senderUser.getUserId()
        const converter = new MongoToClassConverter();

        const allMessagesSentByUser = await MessageModel.find({sender: userId});

        let arrResp = []

        for (const eachJSON of allMessagesSentByUser) {
            arrResp.push(await converter.convertToMessage(eachJSON))
        }
        return arrResp

    }

    /**
     * Gets all messages received by user with matching username
     * @param username
     */
    async getAllMessagesReceivedBy(username: string): Promise<Message[]> {
        const uDao = UserDao.getInstance()
        const senderUser = await uDao.findUserbyUserName(username)

        //If user does not exist return null
        if (senderUser == null || senderUser == undefined) {
            return null;
        }

        // if user exists get user id
        const userId = senderUser.getUserId()
        const converter = new MongoToClassConverter();

        const allMessagesSentByUser = await MessageModel.find({recipient: userId});

        let arrResp = []

        for (const eachJSON of allMessagesSentByUser) {
            arrResp.push(await converter.convertToMessage(eachJSON))
        }
        return arrResp
    }

    async deleteById(mid: string): Promise<number> {
        const modResp = await MessageModel.deleteOne({_id: mid})
        return modResp.deletedCount


    }
}