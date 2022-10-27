"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Tuit_1 = require("./Tuit");
const TuitModel_1 = require("./TuitModel");
const User_1 = require("../Users/User");
const UserModel_1 = require("../Users/UserModel");
class TuitDao {
    constructor() {
        this.oid = require('mongodb').ObjectId;
    }
    findAllTuits() {
        return __awaiter(this, void 0, void 0, function* () {
            const allTuitsJSON = yield TuitModel_1.default.find().populate("postedBy").exec();
            // const allTuitsArray = allTuitsJSON.map(eachTuit => new Tuit(
            //     eachTuit._id.toString(),
            //     eachTuit.postedBy._id.toString(),
            //     eachTuit['tuit'],
            //     eachTuit['postedOn']
            //     )
            // );
            //
            // return allTuitsArray;
            return allTuitsJSON;
        });
    }
    createTuit(tuitIn) {
        return __awaiter(this, void 0, void 0, function* () {
            //can remove
            const userFromDb = yield UserModel_1.default.findById(tuitIn.getUserID());
            const tuitJSON = yield TuitModel_1.default.create({ tuit: tuitIn.getContent(),
                postedOn: tuitIn.getDate(), postedBy: tuitIn.getUserID() });
            const tuitResponse = new Tuit_1.default(tuitJSON._id.toString(), userFromDb._id.toString(), tuitJSON.tuit, tuitJSON.postedOn);
            // can remove
            const userT = new User_1.default(userFromDb._id.toString() || '', userFromDb['username'] || '', userFromDb['firstName'] || '', userFromDb['lastName'] || '', userFromDb['password'] || '', userFromDb['email'] || '');
            tuitResponse.setUser(userT);
            return tuitResponse;
        });
    }
    deleteTuit(tuitId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield TuitModel_1.default.deleteOne({ _id: tuitId });
        });
    }
    // async updateTuit(tuitId: string, tuit : Tuit) : Promise<number> {
    //     const retTuit =  await TuitModel.updateOne(
    //         {_id: tuitId},
    //         {$set: tuit}
    // );
    //     return retTuit.matchedCount;
    // }
    findTuitById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tuitFromDb = yield TuitModel_1.default.findById(id);
            const userFromDb = yield UserModel_1.default.findById(tuitFromDb._id);
            const userT = new User_1.default(userFromDb._id.toString() || '', userFromDb['username'] || '', userFromDb['firstName'] || '', userFromDb['lastName'] || '', userFromDb['password'] || '', userFromDb['email'] || '');
            const tuitResponse = new Tuit_1.default(tuitFromDb._id.toString(), userFromDb._id.toString(), tuitFromDb.tuit, tuitFromDb.postedOn);
            tuitResponse.setUser(userT);
            return tuitResponse;
        });
    }
    findTuitsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // get target user, hopefully they exist
            const userTarget = yield UserModel_1.default.findById(userId);
            const allTuitsByUser = yield TuitModel_1.default.find({ postedBy: userTarget._id });
            const allTuitsArray = allTuitsByUser.map(eachTuit => new Tuit_1.default(eachTuit._id.toString(), eachTuit.postedBy._id.toString(), eachTuit['tuit'], eachTuit['postedOn']));
            allTuitsArray.forEach(indivTuit => indivTuit.setUser(new User_1.default(userTarget._id.toString() || '', userTarget['username'] || '', userTarget['firstName'] || '', userTarget['lastName'] || '', userTarget['password'] || '', userTarget['email'] || '')));
            return allTuitsArray;
        });
    }
}
exports.default = TuitDao;
//# sourceMappingURL=TuitDao.js.map