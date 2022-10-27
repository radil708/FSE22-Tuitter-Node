import Like from "./Like";
import Tuit from "../Tuits/Tuit";
import User from "../Users/User";

export default interface LikeDaoInterface {
    findAllLikes(): Promise<Like[]>
    createLike(tuitLiked: Tuit, likedBy: User): Promise<Like>
    deleteLike(likedId: string): Promise<number>
    findLikeById(id: string): Promise<Like>
}