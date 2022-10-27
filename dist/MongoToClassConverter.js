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
class MongoToClassConverter {
    constructor() {
        this.userDao = UserDao_1.default.getInstance();
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
}
exports.default = MongoToClassConverter;
//# sourceMappingURL=MongoToClassConverter.js.map