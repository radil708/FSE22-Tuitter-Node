import UserDao from "./Users/UserDao";
import TuitDao from "./Tuits/TuitDao";


export default class staticDaos {
    private static sUserDao: UserDao;
    private static sTuitDao: TuitDao;
    private static selfStaticDao: staticDaos | null = null;

    private constructor() {
        staticDaos.sUserDao = new UserDao();
        staticDaos.sTuitDao = new TuitDao()
    }

    public static getInstance(){
        if (staticDaos.selfStaticDao== null) {
            staticDaos.selfStaticDao = new staticDaos()
        }
        return this.selfStaticDao;
    }

    public getUserDao() {
        return staticDaos.sUserDao;
    }

    public getTuitDao() {
        return staticDaos.sTuitDao
    }
}