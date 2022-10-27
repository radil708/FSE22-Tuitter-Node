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
const FollowModel_1 = require("./FollowModel");
const MongoToClassConverter_1 = require("../MongoToClassConverter");
class FollowDao {
    constructor() {
    }
    static getInstance() {
        return this.fSingletonDao;
    }
    findById(followId) {
        return __awaiter(this, void 0, void 0, function* () {
            const converter = new MongoToClassConverter_1.MongoToClassConverter();
            const followFromDb = yield FollowModel_1.default.findById(followId).lean();
            return yield converter.convertToFollow(followFromDb);
        });
    }
    createFollow(followerId, userFollowedId) {
        return __awaiter(this, void 0, void 0, function* () {
            const followFromDb = yield FollowModel_1.default.create({
                userFollowing: followerId,
                userFollowed: userFollowedId
            });
            const converter = new MongoToClassConverter_1.MongoToClassConverter();
            const newFollow = yield FollowModel_1.default.findById(followFromDb._id.toString()).lean();
            return yield converter.convertToFollow(followFromDb);
        });
    }
    getAllFollows() {
        return __awaiter(this, void 0, void 0, function* () {
            const allFollowsFromDb = yield FollowModel_1.default.find();
            const converter = new MongoToClassConverter_1.MongoToClassConverter();
            const allFollowsArr = [];
            for (const eachEntry of allFollowsFromDb) {
                allFollowsArr.push(yield converter.convertToFollow(eachEntry));
            }
            return allFollowsArr;
        });
    }
}
exports.default = FollowDao;
FollowDao.fSingletonDao = new FollowDao();
//# sourceMappingURL=FollowDao.js.map