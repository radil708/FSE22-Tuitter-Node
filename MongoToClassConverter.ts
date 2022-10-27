import User from "./Users/User";
import TuitDao from "./Tuits/TuitDao";
import staticDaos from "./staticDaos";
import UserDao from "./Users/UserDao";
import Tuit from "./Tuits/Tuit";
import mongoose from "mongoose";


export default class MongoToClassConverter {
    private static converter: MongoToClassConverter | null = null;
    private static userDao: UserDao

    private constructor() {
        MongoToClassConverter.userDao = new UserDao();
    }

    public static getInstance() {
        if (MongoToClassConverter.converter == null) {
            MongoToClassConverter.converter = new MongoToClassConverter()
        }
        return MongoToClassConverter.converter
    }

    public convertToUser(mongoRes, showPassword = false): User {
        const jScriptObj = mongoRes

        let pwd;

        if (showPassword == true) {
            pwd = jScriptObj["password"]
        }

        else {
            pwd = '';
        }

        const uRet =  new User(
            jScriptObj["_id"],
            jScriptObj["username"],
            jScriptObj["firstName"],
            jScriptObj["lastName"],
            pwd,
            jScriptObj["email"])


        return uRet

    }

    async convertToTuit(mongoRes): Promise<Tuit> {
        const jScriptObj = mongoRes;
        //console.log(jScriptObj.postedBy._id.toString())
        const userId = jScriptObj.postedBy._id.toString()

        //userQuery returns a Promise<User>
        const userQuery = await MongoToClassConverter.userDao.findUserById(userId)


        const tRet = new Tuit(
            jScriptObj["_id"],
            userId,
            jScriptObj["tuit"],
            jScriptObj["postedOn"])

        tRet.setUser(userQuery)

        return tRet;
    }



}