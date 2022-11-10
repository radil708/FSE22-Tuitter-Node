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
const MongoToClassConverter_1 = require("../MongoToClassConverter");
const TuitModel_1 = require("./TuitModel");
const debugHelper_1 = require("../debugHelper");
class TuitDao {
    /**
     * User to enfore the Singleton Architecture
     * @private
     */
    constructor() {
    }
    /**
     * Enforces Singleton Architecture. Call this method to get the TuitDao
     */
    static getInstance() {
        return this.tSingletonDao;
    }
    /**
     * Creates a new entry in the Tuits Collection
     * @param tuitIn
     */
    createTuit(tuitIn) {
        return __awaiter(this, void 0, void 0, function* () {
            // this will populate postedBy property with user from db
            const tuitJSON = yield TuitModel_1.default.create({
                tuit: tuitIn.getContent(),
                postedOn: tuitIn.getDate(),
                postedBy: tuitIn.getUser().getUserId()
            });
            const newTuitId = tuitJSON._id.toString();
            // get user after being made, this returns a User type obj
            return yield this.findTuitById(newTuitId);
        });
    }
    /**
     * Checks if tuit entry already exists
     * @param id {string} the id of the tuit entry you want to check
     */
    doesTuitExist(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const check = yield TuitModel_1.default.findById(id);
            if (check != null) {
                return true;
            }
            return false;
        });
    }
    /**
     * This will delete a tuit entry from the Tuits collection
     * with an id matching the tuitID
     * @param tuitId {string} the id of the tuit to be deleted
     * @return the amount of tuits deleted, 1 if successful, 0 if failed
     */
    deleteTuit(tuitId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbResp = yield TuitModel_1.default.deleteOne({ _id: tuitId });
            return dbResp.deletedCount;
        });
    }
    /**
     * Gets all the entries from the Tuits collection and
     * returns them as an array of Tuit objects
     * @return {Promise<Tuit[]>} an array of Tuit objects
     */
    findAllTuits() {
        return __awaiter(this, void 0, void 0, function* () {
            const allTuitsJSON = yield TuitModel_1.default.find().lean();
            const conv = new MongoToClassConverter_1.MongoToClassConverter();
            const allTuitArr = [];
            for (const eachTuit of allTuitsJSON) {
                allTuitArr.push(yield conv.convertToTuit(eachTuit));
            }
            return allTuitArr;
        });
    }
    /**
     * Searches for an entry in the Tuits collection with an
     * id matching the id passed in. It will throw a ValidationError
     * if no such id exists
     * @param id {string} the id of the tuit you are looking for
     */
    findTuitById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // I can't make this an attribute without an npm error
            const conv = new MongoToClassConverter_1.MongoToClassConverter();
            const tartgetT = yield TuitModel_1.default.findById(id).lean();
            let tuitIdExist;
            let retTuit;
            if (tartgetT == null || tartgetT == undefined) {
                retTuit = null;
            }
            else {
                tuitIdExist = true;
                retTuit = conv.convertToTuit(tartgetT);
            }
            const printDebug = false;
            if (printDebug) {
                console.log("Does tuitId: " + id + " exist?  ", tuitIdExist);
                console.log("Tuit returned by model:\n", retTuit);
                debugHelper_1.default.printEnd("findTuitById", "TuitDao");
            }
            return retTuit;
        });
    }
    /**
     * This will find all Tuits posted by a user with an id
     * matching the userId passed in
     * @param userId {string} the userId of user whose Tuits are you are looking for
     */
    findTuitsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbTuits = yield TuitModel_1.default.find({ postedBy: userId });
            const conv = new MongoToClassConverter_1.MongoToClassConverter();
            const allTuitsArr = [];
            for (const eachTuit of dbTuits) {
                allTuitsArr.push(yield conv.convertToTuit(eachTuit));
            }
            return allTuitsArr;
        });
    }
}
exports.default = TuitDao;
//Singleton Architecture
TuitDao.tSingletonDao = new TuitDao();
//# sourceMappingURL=TuitDao.js.map