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
class UserDao {
    constructor() {
        this.converter = new MongoToClassConverter_1.default();
    }
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
            // get created userId
            const createdUserId = userModelObj._id.toString();
            // use findByUserId method to get a Promise<User>
            const newUserJSON = yield UserModel_1.default.findById(createdUserId).lean();
            // Return a User type object
            return this.converter.convertToUser(newUserJSON, true);
        });
    }
    deleteUser(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const modelsAfterDeletion = yield UserModel_1.default.deleteOne({ _id: uid });
            return modelsAfterDeletion.deletedCount;
        });
    }
    /**
     * Get all users from the database, password, first name and last names are omitted
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
    findUserById(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const userFromDb = yield UserModel_1.default.findById(uid).lean();
            // returns a user object
            return this.converter.convertToUser(userFromDb);
        });
    }
    // get user by filterbyName
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