"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserDao_1 = require("./Users/UserDao");
const TuitDao_1 = require("./Tuits/TuitDao");
class staticDaos {
    constructor() {
        staticDaos.sUserDao = new UserDao_1.default();
        staticDaos.sTuitDao = new TuitDao_1.default();
    }
    static getInstance() {
        if (staticDaos.selfStaticDao == null) {
            staticDaos.selfStaticDao = new staticDaos();
        }
        return this.selfStaticDao;
    }
    getUserDao() {
        return staticDaos.sUserDao;
    }
    getTuitDao() {
        return staticDaos.sTuitDao;
    }
}
exports.default = staticDaos;
staticDaos.selfStaticDao = null;
//# sourceMappingURL=staticDaos.js.map