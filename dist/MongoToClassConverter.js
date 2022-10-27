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
class MongoToClassConverter {
    // TODO ask, why can't I set more than one wihtout TypeError: MongoToClassConverter_1.MongoToClassConverter is not a constructor
    //  attr??
    constructor() { }
    convertToUser(mongoRes, showPassword = false, showNames = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const jScriptObj = mongoRes;
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
            const tUserDao = UserDao_1.default.getInstance();
            const tid = mongoRes["_id"].toString();
            const uid = mongoRes["postedBy"]._id.toString();
            const tuitedBy = yield tUserDao.findUserById(uid);
            const retTuit = new Tuit_1.default(tid, uid, mongoRes["tuit"], mongoRes["postedOn"], tuitedBy);
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
}
exports.MongoToClassConverter = MongoToClassConverter;
//# sourceMappingURL=MongoToClassConverter.js.map