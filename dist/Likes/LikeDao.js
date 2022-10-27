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
const Like_1 = require("./Like");
const LikeModel_1 = require("./LikeModel");
const User_1 = require("../Users/User");
const Tuit_1 = require("../Tuits/Tuit");
const staticDaos_1 = require("../staticDaos");
class LikeDao {
    createLike(tuitLikedId, userLikedId) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdLike = yield LikeModel_1.default.create({ likedTuit: tuitLikedId, likedBy: userLikedId });
            const userWhoLiked = yield staticDaos_1.default.getInstance().getUserDao().findUserById(userLikedId);
            const likedTuit = yield staticDaos_1.default.getInstance().getTuitDao().findTuitById(tuitLikedId);
            // console.log(typeof createdLike)
            // console.log(JSON.stringify(createdLike))
            // const example = createdLike.toObject()
            // console.log(example["likedTuit"].toString())
            // console.log(example["_id"].toString())
            // console.log(example)
            return new Like_1.default(createdLike._id.toString(), likedTuit, userWhoLiked);
        });
    }
    deleteLike(likedId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield LikeModel_1.default.deleteOne({ _id: likedId });
        });
    }
    // async findAllLikes(): Promise<Like[]> {
    //     const allLikesJson = await LikeModel.find().lean()
    //         .populate("likedTuit").populate("likedBy").exec();
    //
    //     const likedArr = [];
    //
    //     for (const eachLike of allLikesJson) {
    //         let targetTuit = eachLike.likedTuit
    //         let userTarget = eachLike.likedBy
    //
    //         let tUser = MongoToClassConverter.getInstance().convertToUser(userTarget)
    //
    //         let tTuit = await MongoToClassConverter.getInstance().convertToTuit(targetTuit)
    //
    //         tTuit.setUser(tUser);
    //
    //         likedArr.push(new Like(eachLike._id.toString(),tTuit, tUser));
    //     }
    //
    //     return likedArr;
    //
    // }
    findLikeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const likeFromDb = yield LikeModel_1.default.findById(id);
            const targetTuit = likeFromDb.likedTuit;
            const userTarget = likeFromDb.likedBy;
            const tUser = new User_1.default(userTarget._id.toString() || '', userTarget['username'] || '', userTarget['firstName'] || '', userTarget['lastName'] || '', userTarget['password'] || '', userTarget['email'] || '');
            const tTuit = new Tuit_1.default(targetTuit._id.toString(), userTarget._id.toString(), targetTuit['tuit'], targetTuit['postedOn']);
            return new Like_1.default(likeFromDb._id.toString(), tTuit, tUser);
        });
    }
}
exports.default = LikeDao;
//# sourceMappingURL=LikeDao.js.map