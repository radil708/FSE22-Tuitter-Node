import {MongoToClassConverter} from "../MongoToClassConverter";
import TuitDao from "../Tuits/TuitDao";
import Like from "./Like";
import LikeModel from "./LikeModel";
import likeModel from "./LikeModel";
import Tuit from "../Tuits/Tuit";
import User from "../Users/User";
import UserDao from "../Users/UserDao";
import LikeDaoInterface from "./LikeDaoInterface";


export default class LikeDao implements LikeDaoInterface{
    private converter: MongoToClassConverter = new MongoToClassConverter()
    private static likeSingletonDao: LikeDao = new LikeDao()

    /**
     * Singleton Architecture
     */
    public static getInstance() {
        return this.likeSingletonDao;
    }

    /**
     * Singleton Architecture
     */
    private constructor() {
    }

    /**
     * Create a Like entry in the Likes database and return
     * a Like object representing the entry
     * @param likedTuitId
     * @param likedByUserId
     */
    async createLike(likedTuitId: string, likedByUserId: string): Promise<Like> {
        const newLike = await LikeModel.create({
            likedTuit: likedTuitId,
            likedBy: likedByUserId
        })

        const newLikeId = newLike._id.toString()

        return this.getLikeById(newLikeId);

    }

    /**
     * Get every Like entry from the database and return them
     * as Like objects
     */
    async getAllLikes(): Promise<Like[]> {
        const allLikesFromDb = await LikeModel.find().lean();

        const allLikes = []

        for (const eachLike of allLikesFromDb) {
            allLikes.push(await this.converter.convertToLike(eachLike))
        }

        return allLikes;

    }

    /**
     * Get a specific Like entry from the database with a
     * client defined userId and return it as a Like Object
     * @param likeId
     */
    async getLikeById(likeId: string): Promise<Like> {
        const likeFromDb = await LikeModel.findById(likeId);
        return await this.converter.convertToLike(likeFromDb)
    }

    /**
     * Get all Tuits that have been liked by a client defined
     * userid and return them as Tuit objects
     * @param userId
     */
    async getAllTuitsLikedBy(userId: string): Promise<Tuit[]> {
        const allLikesFromDb = await likeModel.find({likedBy: userId})
        const allTids = []

        // get all tids of the Tuits that were liked by this user
        for (const eachLike of allLikesFromDb) {
            allTids.push((await eachLike).likedTuit._id.toString())
        }

        const allTuits = []

        const tDao = TuitDao.getInstance();

        for (const eachId of allTids) {
            allTuits.push(await tDao.findTuitById(eachId))
        }

        return allTuits;

    }

    /**
     * Get all users that have liked a Tuit with an id
     * defined by the client and return them as User objects
     * @param tuitId
     */
    async getAllUsersThatLikesThisTuit(tuitId: string): Promise<User[]> {
        const allLikesFromDb = await likeModel.find({likedTuit: tuitId})
        const tUDao = await UserDao.getInstance();

        const allUserIds = []

        for (const eachLike of allLikesFromDb) {
            allUserIds.push((await eachLike).likedBy._id.toString())
        }

        const allUsers = []


        for (const eachUserId of allUserIds) {
            allUsers.push(await tUDao.findUserById(eachUserId))
        }


        return allUsers

    }

    /**
     * Represents unliking a tweet. Delete the Like entry
     * with a client defined id.
     * @param likeId
     */
    async deleteLike(likeId: string): Promise<any> {
        const dbResp = await LikeModel.deleteOne({_id: likeId})
        return dbResp.deletedCount;
    }

}