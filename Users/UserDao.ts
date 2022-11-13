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

        const userDbVal = await UserModel.find({username: userName});
        //fixed bug
                                                        // model.find returns an array, if length = 0 then no results
        if (userDbVal == null || userDbVal == undefined || userDbVal.length == 0) {
            userNameAlreadyExists = false
        }
        else {
            userNameAlreadyExists = true
        }

        const printDebug = false
        if (printDebug) {
            console.log("Is username: " + userName + " already taken? ->" + userNameAlreadyExists)
            console.log("Result of usermodel.find -> ", userDbVal)
            debugHelper.printEnd("userNameAlreadyTaken", 'UserDao')
        }

        return userNameAlreadyExists


    }

    /**
     * Creates a User in the database
     * @param clientNewUserReqJson {User} The user that will be created in the database
     */
    async createUser(clientNewUserReqJson): Promise<User> {

        // check if username already taken
        const isUserNameAlreadyTaken = await this.userNameAlreadyTaken(clientNewUserReqJson.username);

        let userObj
        let DbResp;

        // username is taken do not create user, let controller know with null
        if (isUserNameAlreadyTaken == true) {
            userObj = null
        }
        else {
            DbResp = await UserModel.create(clientNewUserReqJson);
            // I had obscured that password by setting showPassword to False but
            // starter code tests for A3 want to see password
            userObj = this.converter.convertToUser(DbResp,true)
        }


        //set to true to turn on debug statements
        const printDebugDao = false;

        if (printDebugDao) {
            console.log("is user name already taken? -> ", isUserNameAlreadyTaken)
            console.log("JSON param passed in = \n", clientNewUserReqJson)
            console.log("Response from UserModel.create:\n ", DbResp)
            console.log("created userobj =\n", userObj)
            debugHelper.printEnd("createUser", this.className)
        }

        return userObj;
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
            // I had obscured that password by setting showPassword to False but
            // starter code tests for A3 want to see password
            allUsersArr.push(await this.converter.convertToUser(eachUserJSON,true,true))
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
        let userObj
        const doesUserIdExist = await this.doesUserIdExist(uid)

        if (doesUserIdExist == true) {
            const userFromDb = await UserModel.findById(uid).lean();
            userObj = this.converter.convertToUser(userFromDb, true)
        }
        else {
            userObj = null
        }


        //set to true to turn on debug statements
        const printDebug = false;

        if (printDebug) {
            console.log("Does user with id: " + uid + " exist?\n", doesUserIdExist)
            console.log("Reponse from model.findById:\n", await UserModel.findById(uid).lean() )
            debugHelper.printEnd("findUserById", this.className)
        }

        // returns a user object
        // I had obscured that password by setting showPassword to False but
        // starter code tests for A3 want to see password
        return userObj
    }

    async doesUserIdExist(userId): Promise<boolean> {
        let userIdExist
        let userFromDb

        userFromDb = await UserModel.findById(userId).lean();

        if (userFromDb == null) {
            userIdExist = false
        }
        else {
            userIdExist = true
        }
        return userIdExist;
    }

    /**
     * Get user by username
     * @param userNameIn
     */
    async findUserbyUserName(userNameIn: string): Promise<User> {

        const userFromDb = await UserModel.findOne({username: userNameIn }).lean();

        let daoResp;

        if (userFromDb == null) {
            daoResp = null;
        }
        else {
            daoResp = this.converter.convertToUser(userFromDb,false,true)
        }

        //set to true to turn on debug statements
        const printDebug = false;
        if (printDebug) {
            console.log("Looking for username: " + userNameIn)
            console.log("Response from model.findOne:\n", userFromDb)
            debugHelper.printEnd("findUserbyUserName", this.className)
        }

        return daoResp
    }

    async deleteUserByUserName(userNameIn: string): Promise<number>  {
        const userFromDb = await UserModel.findOne({username: userNameIn });

        if (userFromDb == null || userFromDb == undefined ) {
            return 0;
        }

        const modelsAfterDeletion = await UserModel.deleteOne({_id: userFromDb._id.toString()});
        return modelsAfterDeletion.deletedCount;
    }

    async findUserByCredentials(username: string, password: string): Promise<User> {
        const dbResp = await UserModel.findOne({username: username, password: password});

        // no matching user found
        if (dbResp == null || dbResp == undefined) {
            return null
        }

        // I had obscured that password by setting showPassword to False but
        // starter code tests for A3 want to see password
        return this.converter.convertToUser(dbResp,true,true)

    }

    //
    // async updateUser(uid: string, user: User): Promise<number> {
    //     //The $set operator replaces the value of a field with the specified value.
    //     // TODO ask, only updates certain fields or all?? what if only 1 attr change?
    //     // TODO import mongoose datatypes for set
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