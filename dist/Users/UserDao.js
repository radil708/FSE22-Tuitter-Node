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
const UserModel_1 = require("./UserModel");
class UserDao {
    constructor() {
        this.findAllUsers = () => __awaiter(this, void 0, void 0, function* () { return UserModel_1.default.find(); });
    }
    static getInstance() {
        if (UserDao.userDaoAttr == null) {
            UserDao.userDaoAttr = new UserDao();
        }
        return UserDao.userDaoAttr;
    }
}
exports.default = UserDao;
UserDao.userDaoAttr = null;
//# sourceMappingURL=UserDao.js.map