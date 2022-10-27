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
class TuitDao {
    constructor() {
        this.converter = new MongoToClassConverter_1.MongoToClassConverter();
        this.converter.setTuitDao(TuitDao.getInstance());
    }
    static getInstance() {
        return this.tSingletonDao;
    }
    createTuit(tuitIn) {
        return __awaiter(this, void 0, void 0, function* () {
            // this will populate postedBy property with user from db
            const tuitJSON = yield TuitModel_1.default.create({
                tuit: tuitIn.getContent(),
                postedOn: tuitIn.getDate(),
                postedBy: tuitIn.getUserID()
            });
            const newTuitId = tuitJSON._id.toString();
            // get user after being made, this returns a User type obj
            return yield this.findTuitById(newTuitId);
        });
    }
    deleteTuit(tuitId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("in TuitDao", tuitId);
            const dbResp = yield TuitModel_1.default.deleteOne({ _id: tuitId });
            console.log("after model deletes", dbResp.deletedCount);
            return dbResp.deletedCount;
        });
    }
    findAllTuits() {
        return __awaiter(this, void 0, void 0, function* () {
            const allTuitsJSON = yield TuitModel_1.default.find().lean();
            const allTuitArr = [];
            for (const eachTuit of allTuitsJSON) {
                allTuitArr.push(yield this.converter.convertToTuit(eachTuit));
            }
            return allTuitArr;
        });
    }
    findTuitById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tartgetT = yield TuitModel_1.default.findById(id).lean();
            const t = yield this.converter.convertToTuit(tartgetT);
            return t;
        });
    }
    findTuitsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbTuits = yield TuitModel_1.default.find({ postedBy: userId });
            const allTuitsArr = [];
            for (const eachTuit of dbTuits) {
                allTuitsArr.push(yield this.converter.convertToTuit(eachTuit));
            }
            return allTuitsArr;
        });
    }
}
exports.default = TuitDao;
//Singleton Architecture
TuitDao.tSingletonDao = new TuitDao();
//# sourceMappingURL=TuitDao.js.map