import Message from "./Message";
import MessageModel from "./MessageModel";
import {MongoToClassConverter} from "../MongoToClassConverter";

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

    async getAllMessages(): Promise<Message[]> {
        return await MessageModel.find()
    }
}