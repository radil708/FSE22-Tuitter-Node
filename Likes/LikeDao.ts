import LikeDaoInterface from "./LikeDaoInterface";
import Like from "./Like";
import LikeModel from "./LikeModel";
import User from "../Users/User";
import Tuit from "../Tuits/Tuit";
import TuitModel from "../Tuits/TuitModel";
import likeModel from "./LikeModel";

export default class LikeDao implements LikeDaoInterface{

    async createLike(tuitLikedId: string, userLikedId: string): Promise<Like> {
        const createdLike = await LikeModel.create({likedTuit: tuitLikedId, likedBy: userLikedId})
        return new Like(createdLike._id.toString(),null,null)
    }

    async deleteLike(likedId: string): Promise<any> {
        return await LikeModel.deleteOne({_id: likedId})
    }

    async findAllLikes(): Promise<Like[]> {
        const allLikesJson = await LikeModel.find()
            .populate("likedTuit").populate("likedBy").exec();

        const likedArr = [];

        for (const eachLike of allLikesJson) {
            let targetTuit = eachLike.likedTuit
            let userTarget = eachLike.likedBy

            let tUser = new User(
                userTarget._id.toString() || '',
                userTarget['username'] || '',
                userTarget['firstName'] || '',
                userTarget['lastName'] || '',
                userTarget['password'] || '',
                userTarget['email'] || '');

            let tTuit = new Tuit(
                targetTuit._id.toString(),
                userTarget._id.toString(),
                targetTuit['tuit'],
                targetTuit['postedOn'])

            tTuit.setUser(tUser);

            likedArr.push(new Like(eachLike._id.toString(),tTuit, tUser));
        }

        return likedArr;

    }

    async findLikeById(id: string): Promise<Like> {
        const likeFromDb = await LikeModel.findById(id);
        const targetTuit = likeFromDb.likedTuit
        const userTarget = likeFromDb.likedBy

        const tUser = new User(
            userTarget._id.toString() || '',
            userTarget['username'] || '',
            userTarget['firstName'] || '',
            userTarget['lastName'] || '',
            userTarget['password'] || '',
            userTarget['email'] || '');

        const tTuit = new Tuit(
            targetTuit._id.toString(),
            userTarget._id.toString(),
            targetTuit['tuit'],
            targetTuit['postedOn'])

        return new Like(likeFromDb._id.toString(), tTuit,tUser)

    }

}