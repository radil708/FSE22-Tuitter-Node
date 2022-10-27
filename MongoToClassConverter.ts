import User from "./Users/User";
import UserDao from "./Users/UserDao";
import TuitDao from "./Tuits/TuitDao";
import Tuit from "./Tuits/Tuit";


export class MongoToClassConverter {
    // TODO ask, why can't I set more than one attr??
    private convUserDao = UserDao.getInstance();
    private tuitDao;


    constructor() {}

    public setTuitDao(tuitDaoIn: TuitDao) {
        this.tuitDao = tuitDaoIn;
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

    async convertToTuit(mongoRes): Promise<Tuit> {
        const tid = mongoRes["_id"].toString()

        const uid = mongoRes["postedBy"]._id.toString()

        const tuitedBy = await this.convUserDao.findUserById(uid)

        const retTuit =  new Tuit(
            tid,
            uid,
            mongoRes["tuit"],
            mongoRes["postedOn"],
            tuitedBy)

        return retTuit

    }




}