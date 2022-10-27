import LikeDaoInterface from "./LikeDaoInterface";
import Like from "./Like";
import LikeModel from "./LikeModel";
import User from "../Users/User";
import Tuit from "../Tuits/Tuit";
import jsonToTuit from "./jsonToTuit";
import jsonToUser from "./jsonToUser";


export default class LikeDao implements LikeDaoInterface{
    createLike(tuitLiked: Tuit, likedBy: User): Promise<Like> {
        return Promise.resolve(undefined);
    }

    deleteLike(likedId: string): Promise<number> {
        return Promise.resolve(0);
    }

    async findAllLikes(): Promise<Like[]> {
        const allLikesJson = await LikeModel.find()
            .populate("likedTuit").populate("likedBy").exec();

        const likedArr = [];

        for (const eachLike of allLikesJson) {
            likedArr.push(new Like(eachLike._id.toString(),jsonToTuit(eachLike.likedTuit),jsonToUser(eachLike.likedBy)));
        }

        return likedArr;

    }

    findLikeById(id: string): Promise<Like> {
        return Promise.resolve(undefined);
    }

}