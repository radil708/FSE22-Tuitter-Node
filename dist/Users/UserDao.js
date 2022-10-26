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
const User_1 = require("./User");
const UserModel_1 = require("./UserModel");
class UserDao {
    findAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            // find wihtout a user passed in will return all documents form user table
            // gets an array of user models
            const allUserJsons = yield UserModel_1.default.find();
            // for each user model in array allUserJsons
            return allUserJsons.map(eachUserJSON => new User_1.default(eachUserJSON._id.toString(), eachUserJSON['username'], eachUserJSON['firstName'], eachUserJSON['lastName'], eachUserJSON['password'], eachUserJSON['email']));
        });
    }
}
exports.default = UserDao;
//# sourceMappingURL=UserDao.js.map