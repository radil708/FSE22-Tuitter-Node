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
const MessageModel_1 = require("./MessageModel");
const MongoToClassConverter_1 = require("../MongoToClassConverter");
const UserDao_1 = require("../Users/UserDao");
class MessageDao {
    /**
     * This enforces Singleton Architecture
     */
    constructor() {
    }
    /**
     * This enforces Singleton Architecture
     */
    static getInstance() {
        return this.mSingleton;
    }
    /**
     * creates a message entry
     * @param senderUid
     * @param recipientUid
     * @param contentToSend
     * @param isPrivate
     */
    createMessage(senderUid, recipientUid, contentToSend, isPrivate) {
        return __awaiter(this, void 0, void 0, function* () {
            const mResp = yield MessageModel_1.default.create({ content: contentToSend,
                sender: senderUid, recipient: recipientUid, privacyStatus: false });
            const conv = new MongoToClassConverter_1.MongoToClassConverter();
            return yield conv.convertToMessage(mResp);
        });
    }
    getAllMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            const allMsgJSON = yield MessageModel_1.default.find();
            const converter = new MongoToClassConverter_1.MongoToClassConverter();
            let arrResp = [];
            for (const eachJSON of allMsgJSON) {
                arrResp.push(yield converter.convertToMessage(eachJSON));
            }
            return arrResp;
        });
    }
    getAllMessagesSentBy(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const uDao = UserDao_1.default.getInstance();
            const senderUser = yield uDao.findUserbyUserName(username);
            //If user does not exist return null
            if (senderUser == null || senderUser == undefined) {
                return null;
            }
            // if user exists get user id
            const userId = senderUser.getUserId();
            const converter = new MongoToClassConverter_1.MongoToClassConverter();
            const allMessagesSentByUser = yield MessageModel_1.default.find({ sender: userId });
            let arrResp = [];
            for (const eachJSON of allMessagesSentByUser) {
                arrResp.push(yield converter.convertToMessage(eachJSON));
            }
            return arrResp;
        });
    }
    getAllMessagesReceivedBy(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const uDao = UserDao_1.default.getInstance();
            const senderUser = yield uDao.findUserbyUserName(username);
            //If user does not exist return null
            if (senderUser == null || senderUser == undefined) {
                return null;
            }
            // if user exists get user id
            const userId = senderUser.getUserId();
            const converter = new MongoToClassConverter_1.MongoToClassConverter();
            const allMessagesSentByUser = yield MessageModel_1.default.find({ recipient: userId });
            let arrResp = [];
            for (const eachJSON of allMessagesSentByUser) {
                arrResp.push(yield converter.convertToMessage(eachJSON));
            }
            return arrResp;
        });
    }
    deleteById(mid) {
        return __awaiter(this, void 0, void 0, function* () {
            const modResp = yield MessageModel_1.default.deleteOne({ _id: mid });
            return modResp.deletedCount;
        });
    }
}
exports.default = MessageDao;
MessageDao.mSingleton = new MessageDao();
//# sourceMappingURL=MessageDao.js.map