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
exports.ValidationError = void 0;
const UserModel_1 = require("./UserModel");
const MongoToClassConverter_1 = require("../MongoToClassConverter");
const debugHelper_1 = require("../debugHelper");
const mongoose_1 = require("mongoose");
/**
 * This dao will interact with the database via the UserModel
 */
class UserDao {
    /**
     * The constructor is private to enforce the singleton architecture
     * of this class
     */
    constructor() {
        this.converter = new MongoToClassConverter_1.MongoToClassConverter();
        // used for debug statements
        this.className = "UserDao";
    }
    /**
     * A static method used to enforce a singleton architecture.
     * In order to use this dao, call UserDao.getInstance()
     */
    static getInstance() {
        return this.userDao;
    }
    /**
     * helper function to determine if user already exists
     * @param userName {string} The username you want to check
     */
    userNameAlreadyTaken(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            let userNameAlreadyExists;
            try {
                yield this.findUserbyUserName(userName);
                userNameAlreadyExists = true;
            }
            catch (TypeError) {
                userNameAlreadyExists = false;
            }
            // set to true to turn on debug statements
            const printDebug = false;
            if (printDebug) {
                console.log("Is username: " + userName + " already taken?\n" + userNameAlreadyExists);
                debugHelper_1.default.printEnd("userNameAlreadyTaken", 'UserDao');
            }
            return userNameAlreadyExists;
        });
    }
    /**
     * Creates a User in the database
     * @param user {User} The user that will be created in the database
     */
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userModelObj = yield UserModel_1.default.create(user);
            //set to true to turn on debug statements
            const printDebugDao = false;
            if (printDebugDao) {
                console.log("Response from UserModel.create:\n ", userModelObj);
                debugHelper_1.default.printEnd("createUser", this.className);
            }
            return user;
        });
    }
    /**
     * This will delete a user from the database based on the id passed in.
     * It will return the amount of users deleted. If successful,
     * it will return 0.
     * @param uid {string} the user id of the user you want to delete
     */
    deleteUser(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            //set to true to turn on debug statements
            const printDebug = false;
            const modelsAfterDeletion = yield UserModel_1.default.deleteOne({ _id: uid });
            if (printDebug) {
                console.log("Response from UserModel.deleteOne:\n", modelsAfterDeletion);
                console.log("Returning: ", modelsAfterDeletion.deletedCount.toString());
                debugHelper_1.default.printEnd("deleteUser", this.className);
            }
            return modelsAfterDeletion.deletedCount;
        });
    }
    /**
     * Returns an array of Users representing all Users in the database
     */
    findAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            //set to true to turn on debug statements
            const printDebug = false;
            // Get all users as a Promise and convert to lean
            const allUserJsons = yield UserModel_1.default.find().lean();
            if (printDebug) {
                console.log("Response from model.find():\n", allUserJsons);
                debugHelper_1.default.printSingleLineDivider();
            }
            const allUsersArr = [];
            for (const eachUserJSON of allUserJsons) {
                allUsersArr.push(yield this.converter.convertToUser(eachUserJSON, false, false));
            }
            if (printDebug) {
                console.log("userArr generated:\n", allUserJsons);
                debugHelper_1.default.printEnd("findAllUsers", this.className);
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
            let userIdExist;
            let userFromDb;
            userFromDb = yield UserModel_1.default.findById(uid).lean();
            if (userFromDb == null) {
                userIdExist = false;
            }
            else {
                userIdExist = true;
            }
            //set to true to turn on debug statements
            const printDebug = false;
            if (printDebug) {
                console.log("Does user with id: " + uid + " exist?\n", userIdExist);
                console.log("Reponse from model.findById:\n", userFromDb);
                debugHelper_1.default.printEnd("findUserById", this.className);
            }
            // returns a user object
            return this.converter.convertToUser(userFromDb);
        });
    }
    doesUserIdExist(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let userIdExist;
            let userFromDb;
            userFromDb = yield UserModel_1.default.findById(userId).lean();
            if (userFromDb == null) {
                userIdExist = false;
            }
            else {
                userIdExist = true;
            }
            return userIdExist;
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
            //set to true to turn on debug statements
            const printDebug = false;
            if (printDebug) {
                console.log("Response from model.findOne:\n", userFromDb);
                debugHelper_1.default.printEnd("findUserbyUserName", this.className);
            }
            return this.converter.convertToUser(userFromDb, false, true);
        });
    }
    deleteUserByUserName(userNameIn) {
        return __awaiter(this, void 0, void 0, function* () {
            const userFromDb = yield UserModel_1.default.findOne({ username: userNameIn });
            if (userFromDb == null || userFromDb == undefined) {
                return 0;
            }
            const modelsAfterDeletion = yield UserModel_1.default.deleteOne({ _id: userFromDb._id.toString() });
            return modelsAfterDeletion.deletedCount;
        });
    }
}
exports.default = UserDao;
// Singleton Architecture
UserDao.userDao = new UserDao();
/**
 * custom error class used to determine if user already exists in
 * createUser method of UserDao class
 */
class ValidationError extends mongoose_1.Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=UserDao.js.map