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
const debugHelper_1 = require("../debugHelper");
const ResponderToPollModel_1 = require("./ResponderToPollModel");
class ResponderToPollDao {
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
        return this.rSingletonDao;
    }
    /**
     * Get all responderTopoll entries
     */
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const dbResp = yield ResponderToPollModel_1.default.find();
            return dbResp;
        });
    }
    /**
     * Creates a new entry in the Tuits Collection
     * @param userID
     * @param pollID
     * @param answer
     */
    createResponseToPoll(userID, pollID, answer) {
        return __awaiter(this, void 0, void 0, function* () {
            //throw new Error("Method not implemented.");
            const daoJSON = yield ResponderToPollModel_1.default.create({
                answer: answer,
                responderId: userID.getUserId(),
                pollId: pollID.getPollID()
            });
            //todo delete
            console.log("DAO JSON form createRespnse to Poll -> ", daoJSON);
            const newRTPid = daoJSON._id.toString();
            // get user after being made, this returns a rtp type obj
            return yield this.findResponseToPollById(newRTPid);
        });
    }
    /**
     * This will delete a tuit entry from the Tuits collection
     * with an id matching the tuitID
     * @return the amount of tuits deleted, 1 if successful, 0 if failed
     * @param pollID
     */
    deleteResponseToPoll(pollID) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbResp = yield ResponderToPollModel_1.default.deleteOne({ _id: pollID });
            return dbResp.deletedCount;
        });
    }
    /**
     * Checks if tuit entry already exists
     * @param id {string} the id of the tuit entry you want to check
     */
    doesPollExist(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const check = yield ResponderToPollModel_1.default.findById(id);
            if (check != null) {
                return true;
            }
            return false;
        });
    }
    /**
     * Searches for an entry in the Tuits collection with an
     * id matching the id passed in. It will throw a ValidationError
     * if no such id exists
     * @param id {string} the id of the tuit you are looking for
     */
    findResponseToPollById(pollID) {
        return __awaiter(this, void 0, void 0, function* () {
            // I can't make this an attribute without an npm error
            const conv = new MongoToClassConverter_1.MongoToClassConverter();
            const tartgetT = yield ResponderToPollModel_1.default.findById(pollID).lean();
            let pollIdExist;
            let retResponse;
            if (tartgetT == null) {
                retResponse = null;
            }
            else {
                pollIdExist = true;
                retResponse = conv.convertToResponse(tartgetT);
            }
            const printDebug = true;
            if (printDebug) {
                console.log("Does pollId: " + pollID + " exist?  ", pollIdExist);
                console.log("Target t-> ", tartgetT);
                console.log("Response returned by model:\n", retResponse);
                debugHelper_1.default.printEnd("findResponseToPollById", "ResponseToPollDao");
            }
            return retResponse;
        });
    }
    /**
     * This will find all Tuits posted by a user with an id
     * matching the userId passed in
     * @param userId {string} the userId of user whose Tuits are you are looking for
     */
    findResponseToPollByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbResp = yield ResponderToPollModel_1.default.find({ responderId: userId });
            const conv = new MongoToClassConverter_1.MongoToClassConverter();
            const allResponsesArr = [];
            for (const eachTuit of dbResp) {
                allResponsesArr.push(yield conv.convertToTuit(eachTuit));
            }
            return allResponsesArr;
        });
    }
}
exports.default = ResponderToPollDao;
//Singleton Architecture
ResponderToPollDao.rSingletonDao = new ResponderToPollDao();
//# sourceMappingURL=ResponderToPollDao.js.map