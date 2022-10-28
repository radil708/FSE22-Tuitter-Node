import User from "./User";
import UserModel from "./UserModel";
import UserDaoInterface from "./UserDaoInterface";
import {MongoToClassConverter} from "../MongoToClassConverter";

export default class UserDao implements UserDaoInterface {
    // Singleton Architecture
    private static userDao: UserDao = new UserDao();
    private converter: MongoToClassConverter = new MongoToClassConverter();

    public static getInstance() {
        return this.userDao;
    }


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

    async deleteUser(uid: string): Promise<number> {
        const modelsAfterDeletion = await UserModel.deleteOne({_id: uid});
        return modelsAfterDeletion.deletedCount;
    }

    /**
     * Get all users from the database, password, first name and last names are omitted
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

    async findUserById(uid: string): Promise<User> {
        const userFromDb = await UserModel.findById(uid).lean();
        console.log(userFromDb)

        // returns a user object
        return this.converter.convertToUser(userFromDb)
    }

    // get user by filterbyName
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