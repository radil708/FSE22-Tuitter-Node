import Like from "./Like";
import Tuit from "../Tuits/Tuit";
import User from "../Users/User";

export default interface LikeDaoInterface {
    findAllLikes(): Promise<Like[]>
    createLike(tuitLikedId: string, userLikedId: string): Promise<Like>
    deleteLike(likedId: string): Promise<any>
    findLikeById(id: string): Promise<Like>
}