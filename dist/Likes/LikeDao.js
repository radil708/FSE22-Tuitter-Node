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
const TuitDao_1 = require("../Tuits/TuitDao");
const LikeModel_1 = require("./LikeModel");
const LikeModel_2 = require("./LikeModel");
const UserDao_1 = require("../Users/UserDao");
class LikeDao {
    /**
     * Singleton Architecture
     */
    constructor() {
        this.converter = new MongoToClassConverter_1.MongoToClassConverter();
    }
    /**
     * Singleton Architecture
     */
    static getInstance() {
        return this.likeSingletonDao;
    }
    /**
     * Create a Like entry in the Likes database and return
     * a Like object representing the entry
     * @param likedTuitId
     * @param likedByUserId
     */
    createLike(likedTuitId, likedByUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newLike = yield LikeModel_1.default.create({
                likedTuit: likedTuitId,
                likedBy: likedByUserId
            });
            const newLikeId = newLike._id.toString();
            return this.getLikeById(newLikeId);
        });
    }
    /**
     * Checks if a user has already liked a tuit
     * @param likedTuitId {string} id of tuit that was liked
     * @param likedByUserId {string} id of user who liked
     */
    doesLikeEntryAlreadyExist(likedTuitId, likedByUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            // this is an array
            const check = yield LikeModel_1.default.find({
                likedTuit: likedTuitId,
                likedBy: likedByUserId
            });
            if (check.length > 0) {
                return true;
            }
            return false;
        });
    }
    /**
     * Get every Like entry from the database and return them
     * as Like objects
     */
    getAllLikes() {
        return __awaiter(this, void 0, void 0, function* () {
            const allLikesFromDb = yield LikeModel_1.default.find().lean();
            const allLikes = [];
            for (const eachLike of allLikesFromDb) {
                allLikes.push(yield this.converter.convertToLike(eachLike));
            }
            return allLikes;
        });
    }
    /**
     * Get a specific Like entry from the database with a
     * client defined userId and return it as a Like Object
     * @param likeId
     */
    getLikeById(likeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const likeFromDb = yield LikeModel_1.default.findById(likeId);
            return yield this.converter.convertToLike(likeFromDb);
        });
    }
    /**
     * Get all Tuits that have been liked by a client defined
     * userid and return them as Tuit objects
     * @param userId
     */
    getAllTuitsLikedBy(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allLikesFromDb = yield LikeModel_2.default.find({ likedBy: userId });
            const allTids = [];
            // get all tids of the Tuits that were liked by this user
            for (const eachLike of allLikesFromDb) {
                allTids.push((yield eachLike).likedTuit._id.toString());
            }
            const allTuits = [];
            const tDao = TuitDao_1.default.getInstance();
            for (const eachId of allTids) {
                allTuits.push(yield tDao.findTuitById(eachId));
            }
            return allTuits;
        });
    }
    /**
     * Get all users that have liked a Tuit with an id
     * defined by the client and return them as User objects
     * @param tuitId
     */
    getAllUsersThatLikesThisTuit(tuitId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allLikesFromDb = yield LikeModel_2.default.find({ likedTuit: tuitId });
            const tUDao = yield UserDao_1.default.getInstance();
            const allUserIds = [];
            for (const eachLike of allLikesFromDb) {
                allUserIds.push((yield eachLike).likedBy._id.toString());
            }
            const allUsers = [];
            for (const eachUserId of allUserIds) {
                allUsers.push(yield tUDao.findUserById(eachUserId));
            }
            return allUsers;
        });
    }
    /**
     * Represents unliking a tweet. Delete the Like entry
     * with a client defined id.
     * @param likeId
     */
    deleteLike(likeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbResp = yield LikeModel_1.default.deleteOne({ _id: likeId });
            return dbResp.deletedCount;
        });
    }
}
exports.default = LikeDao;
LikeDao.likeSingletonDao = new LikeDao();
//# sourceMappingURL=LikeDao.js.map