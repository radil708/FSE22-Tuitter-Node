import {Express, Request, Response} from "express";
import MessageDao from "./MessageDao";


export default class MessagesController {
    app: Express

    constructor(appIn: Express) {
        this.app = appIn

        this.app.post('/sender/:sid/recipient/:rid/messages', this.sendMessage)
        this.app.get('/messages', this.getAllMessages)

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

}