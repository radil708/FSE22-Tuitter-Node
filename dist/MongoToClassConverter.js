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
const Tuit_1 = require("./Tuits/Tuit");
class MongoToClassConverter {
    constructor() {
        // TODO ask, why can't I set more than one attr??
        this.convUserDao = UserDao_1.default.getInstance();
    }
    setTuitDao(tuitDaoIn) {
        this.tuitDao = tuitDaoIn;
    }
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
            const tid = mongoRes["_id"].toString();
            const uid = mongoRes["postedBy"]._id.toString();
            const tuitedBy = yield this.convUserDao.findUserById(uid);
            const retTuit = new Tuit_1.default(tid, uid, mongoRes["tuit"], mongoRes["postedOn"], tuitedBy);
            return retTuit;
        });
    }
}
exports.MongoToClassConverter = MongoToClassConverter;
//# sourceMappingURL=MongoToClassConverter.js.map