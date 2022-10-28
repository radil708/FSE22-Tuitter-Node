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
const UserDao_1 = require("../Users/UserDao");
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
    deleteFollow(followId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbResp = yield FollowModel_1.default.deleteOne({ _id: followId });
            return dbResp.deletedCount;
        });
    }
    getUsersIAmFollowing(userIdFollower) {
        return __awaiter(this, void 0, void 0, function* () {
            // client is the one following
            const allFollowsWhereUserIsFollower = yield FollowModel_1.default.find({ userFollowing: userIdFollower });
            const allFollowingIdsArr = [];
            for (const eachFollow of allFollowsWhereUserIsFollower) {
                allFollowingIdsArr.push((yield eachFollow).userFollowed._id.toString());
            }
            const allUsersBeingFollowedByMe = [];
            const uDao = UserDao_1.default.getInstance();
            for (const eachUserId of allFollowingIdsArr) {
                allUsersBeingFollowedByMe.push(yield uDao.findUserById(eachUserId));
            }
            return allUsersBeingFollowedByMe;
        });
    }
    getUsersFollowingMe(followingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const followsDb = yield FollowModel_1.default.find({ userFollowed: followingId });
            const userIds = [];
            // get user id's of everyone following me
            for (const eachFollow of followsDb) {
                userIds.push((yield eachFollow).userFollowing._id.toString());
            }
            const uDao = UserDao_1.default.getInstance();
            const usersFollowingMe = [];
            // use the userID's to get Users
            for (const eachId of userIds) {
                usersFollowingMe.push(yield uDao.findUserById(eachId));
            }
            return usersFollowingMe;
        });
    }
}
exports.default = FollowDao;
FollowDao.fSingletonDao = new FollowDao();
//# sourceMappingURL=FollowDao.js.map