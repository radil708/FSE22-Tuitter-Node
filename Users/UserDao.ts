import User from "./User";
import UserModel from "./UserModel";
import UserDaoInterface from "./UserDaoInterface";
import {MongoToClassConverter} from "../MongoToClassConverter";

/**
 * This dao will interact with the database via the UserModel
 */
export default class UserDao implements UserDaoInterface {
    // Singleton Architecture
    private static userDao: UserDao = new UserDao();
    private converter: MongoToClassConverter = new MongoToClassConverter();

    /**
     * Singleton Architecture
     */
    public static getInstance() {
        return this.userDao;
    }

    /**
     * Singleton Architecture
     */
    private constructor() {
    }

    /**
     * Creates a User in the database
     * @param user {User} The user that will be created in the database
     */
    async createUser(user: User): Promise<User> {
        // add to database
        const userModelObj = await UserModel.create(user);

        return user;

    }

    /**
     * This will delete a user from the database
     * @param uid {string} the user id of the user you want to delete
     */
    async deleteUser(uid: string): Promise<number> {
        const modelsAfterDeletion = await UserModel.deleteOne({_id: uid});
        return modelsAfterDeletion.deletedCount;
    }


    /**
     * Returns an array of Users representing all Users in the database
     */
    async findAllUsers(): Promise<User[]> {
        // Get all users as a Promise and convert to lean
        const allUserJsons = await UserModel.find().lean();

        const allUsersArr = [];

        for (const eachUserJSON of allUserJsons) {
            allUsersArr.push(await this.converter.convertToUser(eachUserJSON,false,false))
        }

        return allUsersArr
    }

    /**
     * Returns a user from the database with an object id
     * matching the uid param passed in the param
     * @param uid {string} the user id of the user you want to find
     */
    async findUserById(uid: string): Promise<User> {
        const userFromDb = await UserModel.findById(uid).lean();
        console.log(userFromDb)

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