import {MongoToClassConverter} from "../MongoToClassConverter";
import TuitDao from "../Tuits/TuitDao";
import Like from "./Like";
import LikeModel from "./LikeModel";
import likeModel from "./LikeModel";
import Tuit from "../Tuits/Tuit";
import User from "../Users/User";
import UserDao from "../Users/UserDao";
import LikeDaoInterface from "./LikeDaoInterface";
import TuitModel from "../Tuits/TuitModel";


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

        const tDao = TuitDao.getInstance()
        //
        const tFromDb = await TuitModel.findById(likedTuitId)
        let currentLikeCount = tFromDb.stats.likes
        currentLikeCount += 1
        tFromDb.stats.likes = currentLikeCount
        const newStats = tFromDb.stats

        //modify stats
        await TuitModel.updateOne({_id: likedTuitId }, {$set:{stats: newStats}})

        const newLikeId = newLike._id.toString()

        return this.getLikeById(newLikeId);

    }

    /**
     * Checks if a user has already liked a tuit
     * @param likedTuitId {string} id of tuit that was liked
     * @param likedByUserId {string} id of user who liked
     */
    async doesLikeEntryAlreadyExist(likedTuitId: string, likedByUserId: string): Promise<boolean> {
        // this is an array
        const check = await LikeModel.find({
            likedTuit:likedTuitId,
            likedBy:likedByUserId})


        if (check.length > 0) {
            return true
        }
        return false
    }

    async toggleLikes(likedTuitId: string, likedByUserId: string): Promise<number> {
        const alreadyExist = await this.doesLikeEntryAlreadyExist(likedTuitId, likedByUserId)
        let likeFromDb
        let result
        // if the user has already liked this tuit, toggle to unlike
        if (alreadyExist) {
            const arrResults = await LikeModel.find({
                likedTuit:likedTuitId,
                likedBy:likedByUserId})
            //TODO delete
            console.log(arrResults[0])
            likeFromDb = arrResults[0]
            await this.deleteLike(likeFromDb._id.toString())
            result = 0
        }
        else {
            await this.createLike(likedTuitId, likedByUserId)
            result = 1
        }
        return result;
    }

    async getLikeByUserAndTuit(likedTuitId: string, likedByUserId: string): Promise<Like> {
        // this is an array
        const check = await LikeModel.find({
            likedTuit:likedTuitId,
            likedBy:likedByUserId})

        if (check["likedTuit"] == null) {
            return null
        }
        else {
            return await this.converter.convertToLike(check)
        }
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
        //
        const likeFromDb = await LikeModel.findById(likeId)
        const tuitFromDb = await TuitModel.findById(likeFromDb.likedTuit.toString())
        //TODO delete print
        console.log(tuitFromDb)

        let currentLikeCount = tuitFromDb.stats.likes
        currentLikeCount -= 1
        tuitFromDb.stats.likes = currentLikeCount
        const newStats = tuitFromDb.stats

        //modify stats
        await TuitModel.updateOne({_id: tuitFromDb._id.toString() }, {$set:{stats: newStats}})
        const dbResp = await LikeModel.deleteOne({_id: likeId})
        return dbResp.deletedCount;
    }

}