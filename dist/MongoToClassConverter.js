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
exports.MongoToClassConverter = void 0;
const User_1 = require("./Users/User");
const UserDao_1 = require("./Users/UserDao");
const TuitDao_1 = require("./Tuits/TuitDao");
const Tuit_1 = require("./Tuits/Tuit");
const Like_1 = require("./Likes/Like");
const Follow_1 = require("./Follows/Follow");
const Bookmark_1 = require("./Bookmarks/Bookmark");
const Message_1 = require("./Messages/Message");
const PollDao_1 = require("./Polls/PollDao");
const Poll_1 = require("./Polls/Poll");
const ResponderToPoll_1 = require("./Responder/ResponderToPoll");
/**
 * In the newer version of MongoDB you need to map the MongoQueries to the object itself, so I made
 * this helper class to take care of that for me. It converts mongoResponses to actual class objects
 */
class MongoToClassConverter {
    // TODO ask, why can't I set more than one wihtout TypeError: MongoToClassConverter_1.MongoToClassConverter is not a constructor
    //  attr??
    //Pass in instance of DAO in getinstance
    constructor() { }
    convertToUser(mongoRes, showPassword = false, showNames = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const jScriptObj = mongoRes;
            // throw error is object passed in is null or empty
            if (jScriptObj == null || jScriptObj == undefined) {
                throw new TypeError("user passed in is null or undefined, cannot convert to User objet");
            }
            let pwd = '';
            let firstName = '';
            let lastName = '';
            if (showPassword == true) {
                pwd = jScriptObj["password"];
            }
            if (showNames == true) {
                firstName = jScriptObj["firstName"];
                lastName = jScriptObj["lastName"];
            }
            return new User_1.default(jScriptObj["_id"], jScriptObj["username"], firstName, lastName, pwd, jScriptObj["email"]);
        });
    }
    convertToTuit(mongoRes) {
        return __awaiter(this, void 0, void 0, function* () {
            // throw error is object passed in is null or empty
            if (mongoRes == null || mongoRes == undefined) {
                throw new TypeError("user passed in is null or undefined, cannot convert to User objet");
            }
            const tUserDao = UserDao_1.default.getInstance();
            const tid = mongoRes["_id"].toString();
            const uid = mongoRes["postedBy"]._id.toString();
            const tuitedBy = yield tUserDao.findUserById(uid);
            const retTuit = new Tuit_1.default(tid, mongoRes["tuit"], mongoRes["postedOn"], tuitedBy);
            return retTuit;
        });
    }
    convertToLike(mongoRes) {
        return __awaiter(this, void 0, void 0, function* () {
            const likeId = mongoRes["_id"].toString();
            const likedTuitid = mongoRes["likedTuit"]._id.toString();
            const likedById = mongoRes["likedBy"]._id.toString();
            const tuitedBy = yield UserDao_1.default.getInstance().findUserById(likedById);
            const likedTuit = yield TuitDao_1.default.getInstance().findTuitById(likedTuitid);
            const retLike = new Like_1.default(likeId, likedTuit, tuitedBy);
            return retLike;
        });
    }
    convertToFollow(mongoRes) {
        return __awaiter(this, void 0, void 0, function* () {
            const followId = mongoRes["_id"].toString();
            const userFollowedId = mongoRes.userFollowed._id.toString();
            const userFollowingId = mongoRes.userFollowing._id.toString();
            const uDao = UserDao_1.default.getInstance();
            const userFollowed = yield uDao.findUserById(userFollowedId);
            const userFollowing = yield uDao.findUserById(userFollowingId);
            return new Follow_1.default(followId, userFollowed, userFollowing);
        });
    }
    convertToBookmark(mongoRes) {
        return __awaiter(this, void 0, void 0, function* () {
            const bId = mongoRes["_id"].toString();
            const bookmarkedTuitId = mongoRes.bookmarkedTuit._id.toString();
            const bookedBy = mongoRes.bookmarkedBy._id.toString();
            const uDao = UserDao_1.default.getInstance();
            const tDao = TuitDao_1.default.getInstance();
            const userIn = yield uDao.findUserById(bookedBy);
            const tuitIn = yield tDao.findTuitById(bookmarkedTuitId);
            return new Bookmark_1.default(bId, tuitIn, userIn);
        });
    }
    convertToMessage(mongoRes) {
        return __awaiter(this, void 0, void 0, function* () {
            const mId = mongoRes._id.toString();
            const senderId = mongoRes.sender._id.toString();
            const recipientId = mongoRes.recipient._id.toString();
            const content = mongoRes.content;
            const uDao = UserDao_1.default.getInstance();
            const senderUser = yield uDao.findUserById(senderId);
            const recipientUser = yield uDao.findUserById(recipientId);
            const mResp = new Message_1.default(mId, content, senderUser, recipientUser, false);
            return mResp;
        });
    }
    convertToResponse(mongoRes) {
        return __awaiter(this, void 0, void 0, function* () {
            // throw error is object passed in is null or empty
            if (mongoRes == null) {
                throw new TypeError("user passed in is null or undefined, cannot convert to User objet");
            }
            const tUserDao = UserDao_1.default.getInstance();
            const pDao = PollDao_1.default.getInstance();
            const content = mongoRes.content;
            const pollid = mongoRes.pollId._id.toString(); // this is poll id
            const responderId = mongoRes["responderId"]._id.toString();
            const userResponded = yield tUserDao.findUserById(responderId);
            //TODO delete
            console.log("convert to response poll id ->", pollid);
            const pollCreater = yield pDao.findPollById(pollid);
            const retResponse = new ResponderToPoll_1.default(pollCreater, userResponded, mongoRes.answer);
            return retResponse;
        });
    }
    convertToPoll(mongoRes) {
        return __awaiter(this, void 0, void 0, function* () {
            const uDao = UserDao_1.default.getInstance();
            const pId = mongoRes._id.toString();
            // get the id of the user who posted the poll
            const userId = mongoRes.author._id.toString();
            // use the user ID to get a User object
            const posterUserObj = yield uDao.findUserById(userId);
            const pollQuestion = mongoRes.question.toString();
            const pollAnswerOptionsArrStr = mongoRes.options;
            const pollAnswerCountArrNum = mongoRes.optionCount;
            const converted = new Poll_1.default(pId, posterUserObj, pollQuestion, pollAnswerOptionsArrStr);
            if (pId != '') {
                converted.setOptionsCount(pollAnswerCountArrNum);
            }
            return converted;
        });
    }
}
exports.MongoToClassConverter = MongoToClassConverter;
//# sourceMappingURL=MongoToClassConverter.js.map