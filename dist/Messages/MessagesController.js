"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const MessageDao_1 = require("./MessageDao");
class MessagesController {
    constructor(appIn) {
        this.app = appIn;
        this.app.post('/sender/:sid/recipient/:rid/messages', this.sendMessage);
        this.app.get('/messages', this.getAllMessages);
        this.app.get('/sender/username/:uname/messages', this.getAllMessagesSentBy);
        this.app.get('/recipient/username/:uname/messages', this.getAllMessagesReceivedBy);
        this.app.delete('/messages/:mid', this.deleteById);
    }
    /**
     * Takes client request to send a message
     * @param req
     * @param res
     */
    sendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const senderId = req.params.sid;
            const recipientId = req.params.rid;
            const messageContent = req.body.content;
            const mDao = MessageDao_1.default.getInstance();
            const messageMade = yield mDao.createMessage(senderId, recipientId, messageContent, false);
            res.send(messageMade);
        });
    }
    /**
     * get all messages from messages collection
     * @param req
     * @param res
     */
    getAllMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const mDao = MessageDao_1.default.getInstance();
            res.send(yield mDao.getAllMessages());
        });
    }
    /**
     * Gets all messages sent by a specific user
     * @param req
     * @param res
     */
    getAllMessagesSentBy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const senderName = req.params.uname;
            const mDao = MessageDao_1.default.getInstance();
            const msgs = yield mDao.getAllMessagesSentBy(senderName);
            if (msgs == null) {
                res.json({ "Error": "Username: " + senderName + " could not be found" });
                return;
            }
            res.json(msgs);
        });
    }
    /**
     * Gets all messages received by a specific user
     * @param req
     * @param res
     */
    getAllMessagesReceivedBy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const recipientName = req.params.uname;
            const mDao = MessageDao_1.default.getInstance();
            const msgs = yield mDao.getAllMessagesReceivedBy(recipientName);
            if (msgs == null) {
                res.json({ "Error": "Username: " + recipientName + " could not be found" });
                return;
            }
            res.json(msgs);
        });
    }
    /**
     * Deletes a message with a matching user id
     * @param req
     * @param res
     */
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let numDeleted = 0;
            const mDao = MessageDao_1.default.getInstance();
            try {
                numDeleted = yield mDao.deleteById(req.params.mid);
            }
            catch (BSONTypeError) {
                res.json({ "Error": "message id format incorrect" });
                return;
            }
            res.json({ "messagesDeleted": numDeleted });
        });
    }
}
exports.default = MessagesController;
//# sourceMappingURL=MessagesController.js.map