import Like from "./Like";
import Tuit from "../Tuits/Tuit";
import User from "../Users/User";

/**
 * This interface declares the methods required by any LikeDao type objects.
 * All the methods must return a Promise which allows the
 * program to keep going while waiting for a response
 * from database.
 */
export default interface LikeDaoInterface {
    /**
     * Create a Like entry in the Likes database and return
     * a Like object representing the entry
     * @param likedTuitId
     * @param likedByUserId
     */
    createLike(likedTuitId: string, likedByUserId: string): Promise<Like>

    /**
     * Get every Like entry from the database and return them
     * as Like objects
     */
    getAllLikes(): Promise<Like[]>

    /**
     * Get a specific Like entry from the database with a
     * client defined userId and return it as a Like Object
     * @param likeId
     */
    getLikeById(likeId: string): Promise<Like>

    /**
     * Get all Tuits that have been liked by a client defined
     * userid and return them as Tuit objects
     * @param userId
     */
    getAllTuitsLikedBy(userId: string): Promise<Tuit[]>

    /**
     * Get all users that have liked a Tuit with an id
     * defined by the client and return them as User objects
     * @param tuitId
     */
    getAllUsersThatLikesThisTuit(tuitId: string): Promise<User[]>

    /**
     * Represents unliking a tweet. Delete the Like entry
     * with a client defined id.
     * @param likeId
     */
    deleteLike(likeId: string): Promise<any>
}