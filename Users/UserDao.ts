import UserModel from "./UserModel";
import User from "./User";

export default class UserDao {
    private static userDaoAttr: UserDao | null = null;

    public static getInstance(): UserDao {
        if (UserDao.userDaoAttr == null) {
            UserDao.userDaoAttr = new UserDao();
        }
        return UserDao.userDaoAttr;
    }

    private constructor() {}

    findAllUsers = async (): Promise<User[]> =>
        UserModel.find();
}