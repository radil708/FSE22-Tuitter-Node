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
const User_1 = require("./Users/User");
const UserDao_1 = require("./Users/UserDao");
const Tuit_1 = require("./Tuits/Tuit");
class MongoToClassConverter {
    constructor() {
        MongoToClassConverter.userDao = new UserDao_1.default();
    }
    static getInstance() {
        if (MongoToClassConverter.converter == null) {
            MongoToClassConverter.converter = new MongoToClassConverter();
        }
        return MongoToClassConverter.converter;
    }
    convertToUser(mongoRes, showPassword = false) {
        const jScriptObj = mongoRes;
        let pwd;
        if (showPassword == true) {
            pwd = jScriptObj["password"];
        }
        else {
            pwd = '';
        }
        const uRet = new User_1.default(jScriptObj["_id"], jScriptObj["username"], jScriptObj["firstName"], jScriptObj["lastName"], pwd, jScriptObj["email"]);
        return uRet;
    }
    convertToTuit(mongoRes) {
        return __awaiter(this, void 0, void 0, function* () {
            const jScriptObj = mongoRes;
            //console.log(jScriptObj.postedBy._id.toString())
            const userId = jScriptObj.postedBy._id.toString();
            //userQuery returns a Promise<User>
            const userQuery = yield MongoToClassConverter.userDao.findUserById(userId);
            const tRet = new Tuit_1.default(jScriptObj["_id"], userId, jScriptObj["tuit"], jScriptObj["postedOn"]);
            tRet.setUser(userQuery);
            //console.log(userQuery)
            //console.log('geeting tuit user',tRet.getUser())
            return tRet;
        });
    }
}
exports.default = MongoToClassConverter;
MongoToClassConverter.converter = null;
//# sourceMappingURL=MongoToClassConverter.js.map