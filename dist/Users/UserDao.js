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
const MongoToClassConverter_1 = require("../MongoToClassConverter");
/**
 * This dao will interact with the database via the UserModel
 */
class UserDao {
    /**
     * Singleton Architecture
     */
    constructor() {
        this.converter = new MongoToClassConverter_1.MongoToClassConverter();
    }
    /**
     * Singleton Architecture
     */
    static getInstance() {
        return this.userDao;
    }
    /**
     * Creates a User in the database
     * @param user {User} The user that will be created in the database
     */
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            // add to database
            const userModelObj = yield UserModel_1.default.create(user);
            return user;
        });
    }
    /**
     * This will delete a user from the database
     * @param uid {string} the user id of the user you want to delete
     */
    deleteUser(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const modelsAfterDeletion = yield UserModel_1.default.deleteOne({ _id: uid });
            return modelsAfterDeletion.deletedCount;
        });
    }
    /**
     * Returns an array of Users representing all Users in the database
     */
    findAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get all users as a Promise and convert to lean
            const allUserJsons = yield UserModel_1.default.find().lean();
            const allUsersArr = [];
            for (const eachUserJSON of allUserJsons) {
                allUsersArr.push(yield this.converter.convertToUser(eachUserJSON, false, false));
            }
            return allUsersArr;
        });
    }
    /**
     * Returns a user from the database with an object id
     * matching the uid param passed in the param
     * @param uid {string} the user id of the user you want to find
     */
    findUserById(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const userFromDb = yield UserModel_1.default.findById(uid).lean();
            console.log(userFromDb);
            // returns a user object
            return this.converter.convertToUser(userFromDb);
        });
    }
    /**
     * Get user by username
     * @param userNameIn
     */
    findUserbyUserName(userNameIn) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO gotta use findOne need to implement no same username
            const userFromDb = yield UserModel_1.default.findOne({ username: userNameIn }).lean();
            return this.converter.convertToUser(userFromDb, false, true);
        });
    }
}
exports.default = UserDao;
// Singleton Architecture
UserDao.userDao = new UserDao();
//# sourceMappingURL=UserDao.js.map