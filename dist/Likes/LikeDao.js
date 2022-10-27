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
class LikeDao {
    constructor() {
        this.converter = new MongoToClassConverter_1.MongoToClassConverter();
    }
    static getInstance() {
        return this.likeSingletonDao;
    }
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
    getLikeById(likeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const likeFromDb = yield LikeModel_1.default.findById(likeId);
            return yield this.converter.convertToLike(likeFromDb);
        });
    }
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
}
exports.default = LikeDao;
LikeDao.likeSingletonDao = new LikeDao();
//# sourceMappingURL=LikeDao.js.map