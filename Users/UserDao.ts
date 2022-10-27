import User from "./User";
import UserModel from "./UserModel";
import UserDaoInterface from "./UserDaoInterface";
import MongoToClassConverter from "../MongoToClassConverter";

export default class UserDao implements UserDaoInterface {
    async createUser(user: User): Promise<User> {
        const userModelObj = await UserModel.create(user);
        // useerModelObj is a dictionary
        const newUser = new User(
            userModelObj._id.toString(),
            userModelObj['username'],
            userModelObj['firstName'], userModelObj['lastName'],
            userModelObj['password'], userModelObj['email']);

        return newUser;
    }

    async deleteUser(uid: string): Promise<number> {
        const modelsAfterDeletion = await UserModel.deleteOne({_id: uid});
        return modelsAfterDeletion.deletedCount;
    }
    // declare that the function is asynchronous
    async findAllUsers(): Promise<User[]> {
        // find wihtout a user passed in will return all documents form user table
        // gets an array of user models
        const allUserJsons = await UserModel.find();
        // for each user model in array allUserJsons
        return allUserJsons.map(eachUserJSON => new User(
            eachUserJSON._id.toString(),
            eachUserJSON['username'],
            eachUserJSON['firstName'],
            eachUserJSON['lastName'],
            eachUserJSON['password'],
            eachUserJSON['email']));
    }

    async findUserById(uid: string): Promise<User> {
        const userFromDb = await UserModel.findById(uid).lean();


        // returns a user object
        return MongoToClassConverter.getInstance().convertToUser(userFromDb)
    }

    // get user by filterbyName
    async findUserbyUserName(userNameIn: string): Promise<User> {
        // TODO gotta use findOne need to implement no same username
        const userFromDb = await UserModel.findOne({username: userNameIn });

        return new User(
            userFromDb._id.toString() || '',
            userFromDb['username'] || '',
            userFromDb['firstName'] || '',
            userFromDb['lastName'] || '',
            userFromDb['password'] || '',
            userFromDb['email'] || ''
        );
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