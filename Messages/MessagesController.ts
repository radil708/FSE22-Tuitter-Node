import {Express, Request, Response} from "express";
import MessageDao from "./MessageDao";


export default class MessagesController {
    app: Express

    constructor(appIn: Express) {
        this.app = appIn

        this.app.post('/sender/:sid/recipient/:rid/messages', this.sendMessage)
        this.app.get('/messages', this.getAllMessages)
        this.app.get('/sender/username/:uname/messages', this.getAllMessagesSentBy)
        this.app.get('/recipient/username/:uname/messages', this.getAllMessagesReceivedBy)
        this.app.delete('/messages/:mid', this.deleteById)

    }

    /**
     * Takes client request to send a message
     * @param req
     * @param res
     */
    async sendMessage(req: Request, res: Response) {
        const senderId = req.params.sid
        const recipientId = req.params.rid
        const messageContent = req.body.content

        const mDao = MessageDao.getInstance()
        const messageMade = await mDao.createMessage(senderId, recipientId,messageContent, false)
        res.send(messageMade)
    }

    /**
     * get all messages from messages collection
     * @param req
     * @param res
     */
    async getAllMessages(req: Request, res: Response) {
        const mDao = MessageDao.getInstance()
        res.send(await mDao.getAllMessages())
    }

    /**
     * Gets all messages sent by a specific user
     * @param req
     * @param res
     */
    async getAllMessagesSentBy(req: Request, res: Response) {
        const senderName = req.params.uname
        const mDao = MessageDao.getInstance()
        const msgs = await mDao.getAllMessagesSentBy(senderName)

        if (msgs == null) {
            res.json({"Error": "Username: " + senderName + " could not be found"})
            return
        }
        res.json(msgs)

    }

    /**
     * Gets all messages received by a specific user
     * @param req
     * @param res
     */
    async getAllMessagesReceivedBy(req: Request, res: Response)  {
        const recipientName = req.params.uname
        const mDao = MessageDao.getInstance()
        const msgs = await mDao.getAllMessagesReceivedBy(recipientName)

        if (msgs == null) {
            res.json({"Error": "Username: " + recipientName + " could not be found"})
            return
        }
        res.json(msgs)
    }

    /**
     * Deletes a message with a matching user id
     * @param req
     * @param res
     */
    async deleteById(req: Request, res: Response) {
        let numDeleted = 0
        const mDao = MessageDao.getInstance()
        try {
            numDeleted = await mDao.deleteById(req.params.mid)
        }
        catch (BSONTypeError) {
            res.json({"Error": "message id format incorrect"})
            return
        }

        res.json({"messagesDeleted": numDeleted})
    }

}