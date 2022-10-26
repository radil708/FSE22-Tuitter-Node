import User from "./User";
import UserModel from "./UserModel";

export default class UserDao {
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
}