import User from "./Users/User";
import UserDao from "./Users/UserDao";


export default class MongoToClassConverter {
    private userDao;

    constructor() {
        this.userDao = UserDao.getInstance();
    }

    async convertToUser(mongoRes, showPassword = false, showNames= true): Promise<User> {
        const jScriptObj = mongoRes

        let pwd = '';
        let firstName = '';
        let lastName = '';

        if (showPassword == true) {
            pwd = jScriptObj["password"]
        }

        if (showNames == true) {
            firstName = jScriptObj["firstName"];
            lastName = jScriptObj["lastName"];
        }


        return new User(
            jScriptObj["_id"],
            jScriptObj["username"],
            firstName,
            lastName,
            pwd,
            jScriptObj["email"])

    }




}