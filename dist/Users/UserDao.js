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
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userModelObj = yield UserModel_1.default.create(user);
            // useerModelObj is a dictionary
            const newUser = new User_1.default(userModelObj._id.toString(), userModelObj['username'], userModelObj['firstName'], userModelObj['lastName'], userModelObj['password'], userModelObj['email']);
            return newUser;
        });
    }
    deleteUser(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const modelsAfterDeletion = yield UserModel_1.default.deleteOne({ _id: uid });
            return modelsAfterDeletion.deletedCount;
        });
    }
    // declare that the function is asynchronous
    findAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            // find wihtout a user passed in will return all documents form user table
            // gets an array of user models
            const allUserJsons = yield UserModel_1.default.find();
            // for each user model in array allUserJsons
            return allUserJsons.map(eachUserJSON => new User_1.default(eachUserJSON._id.toString(), eachUserJSON['username'], eachUserJSON['firstName'], eachUserJSON['lastName'], eachUserJSON['password'], eachUserJSON['email']));
        });
    }
    findUserById(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const userFromDb = yield UserModel_1.default.findById(uid);
            // TODO maybe obscure password here?
            //TODO I can replace password with an empty string
            return new User_1.default(userFromDb._id.toString(), userFromDb['username'], userFromDb['firstName'], userFromDb['lastName'], userFromDb['password'], userFromDb['email']);
        });
    }
    // get user by filterbyName
    findUserbyUserName(userNameIn) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO gotta use findOne need to implement no same username
            const userFromDb = yield UserModel_1.default.findOne({ username: userNameIn });
            return new User_1.default(userFromDb._id.toString() || '', userFromDb['username'] || '', userFromDb['firstName'] || '', userFromDb['lastName'] || '', userFromDb['password'] || '', userFromDb['email'] || '');
        });
    }
}
exports.default = UserDao;
//# sourceMappingURL=UserDao.js.map