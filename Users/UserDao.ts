import User from "./User";
import UserModel from "./UserModel";
import UserDaoInterface from "./UserDaoInterface";
import {MongoToClassConverter} from "../MongoToClassConverter";
import debugHelper from "../debugHelper";
import userModel from "./UserModel";
import {Error} from "mongoose";

/**
 * This dao will interact with the database via the UserModel
 */
export default class UserDao implements UserDaoInterface {
    // Singleton Architecture
    private static userDao: UserDao = new UserDao();
    private converter: MongoToClassConverter = new MongoToClassConverter();
    // used for debug statements
    private className: string = "UserDao"

    /**
     * A static method used to enforce a singleton architecture.
     * In order to use this dao, call UserDao.getInstance()
     */
    public static getInstance() {
        return this.userDao;
    }

    /**
     * The constructor is private to enforce the singleton architecture
     * of this class
     */
    private constructor() {
    }

    /**
     * helper function to determine if user already exists
     * @param userName {string} The username you want to check
     */
    async userNameAlreadyTaken(userName: string): Promise<boolean> {
        let userNameAlreadyExists;

        try {
            await this.findUserbyUserName(userName)
            userNameAlreadyExists = true
        }
        catch (TypeError) {
            userNameAlreadyExists = false
        }

        // set to true to turn on debug statements
        const printDebug = false
        if (printDebug) {
            console.log("Is username: " + userName + " already taken?\n" + userNameAlreadyExists)
            debugHelper.printEnd("userNameAlreadyTaken", 'UserDao')
        }

        return userNameAlreadyExists;
    }

    /**
     * Creates a User in the database
     * @param user {User} The user that will be created in the database
     */
    async createUser(user: User): Promise<User> {
        const userModelObj = await UserModel.create(user);

        //set to true to turn on debug statements
        const printDebugDao = false;
        if (printDebugDao) {
            console.log("Response from UserModel.create:\n ", userModelObj)
            debugHelper.printEnd("createUser", this.className)
        }

        return user;
    }

    /**
     * This will delete a user from the database based on the id passed in.
     * It will return the amount of users deleted. If successful,
     * it will return 0.
     * @param uid {string} the user id of the user you want to delete
     */
    async deleteUser(uid: string): Promise<number> {
        //set to true to turn on debug statements
        const printDebug = false;
        const modelsAfterDeletion = await UserModel.deleteOne({_id: uid});

        if (printDebug){
            console.log("Response from UserModel.deleteOne:\n", modelsAfterDeletion)
            console.log("Returning: ", modelsAfterDeletion.deletedCount.toString())
            debugHelper.printEnd("deleteUser",this.className)
        }

        return modelsAfterDeletion.deletedCount;
    }


    /**
     * Returns an array of Users representing all Users in the database
     */
    async findAllUsers(): Promise<User[]> {

        //set to true to turn on debug statements
        const printDebug = false;

        // Get all users as a Promise and convert to lean
        const allUserJsons = await UserModel.find().lean();

        if (printDebug) {
            console.log("Response from model.find():\n", allUserJsons)
            debugHelper.printSingleLineDivider()
        }

        const allUsersArr = [];

        for (const eachUserJSON of allUserJsons) {
            allUsersArr.push(await this.converter.convertToUser(eachUserJSON,false,false))
        }

        if (printDebug) {
            console.log("userArr generated:\n", allUserJsons)
            debugHelper.printEnd("findAllUsers",this.className)
        }

        return allUsersArr
    }

    /**
     * Returns a user from the database with an object id
     * matching the uid param passed in the param
     * @param uid {string} the user id of the user you want to find
     */
    async findUserById(uid: string): Promise<User> {
        let userIdExist
        let userFromDb

        userFromDb = await UserModel.findById(uid).lean();

        if (userFromDb == null) {
            userIdExist = false
        }
        else {
            userIdExist = true
        }

        //set to true to turn on debug statements
        const printDebug = false;
        if (printDebug) {
            console.log("Does user with id: " + uid + " exist?\n", userIdExist)
            console.log("Reponse from model.findById:\n", userFromDb)
            debugHelper.printEnd("findUserById", this.className)
        }

        // returns a user object
        return this.converter.convertToUser(userFromDb)
    }

    /**
     * Get user by username
     * @param userNameIn
     */
    async findUserbyUserName(userNameIn: string): Promise<User> {
        // TODO gotta use findOne need to implement no same username
        const userFromDb = await UserModel.findOne({username: userNameIn }).lean();

        //set to true to turn on debug statements
        const printDebug = false;
        if (printDebug) {
            console.log("Response from model.findOne:\n", userFromDb)
            debugHelper.printEnd("findUserbyUserName", this.className)
        }

        return this.converter.convertToUser(userFromDb,false,true)
    }
    //
    // async updateUser(uid: string, user: User): Promise<number> {
    //     //The $set operator replaces the value of a field with the specified value.
    //     // TODO ask, only updates certain fields or all?? what if only 1 attr change?
    //     const updatedUserArr =  await UserModel.updateOne(
    //         {_id: uid},
    //         {$set: user}
    //     );
    //     //console.log(updatedUserArr);
    //     // TODO ask why upserted count doesnt work
    //     return updatedUserArr.matchedCount;
    // }
}

/**
 * custom error class used to determine if user already exists in
 * createUser method of UserDao class
 */
export class ValidationError extends Error{
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}