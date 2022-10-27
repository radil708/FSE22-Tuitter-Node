import {MongoToClassConverter} from "../MongoToClassConverter";
import TuitDao from "../Tuits/TuitDao";
import Like from "./Like";
import LikeModel from "./LikeModel";
import likeModel from "./LikeModel";
import Tuit from "../Tuits/Tuit";
import User from "../Users/User";
import UserDao from "../Users/UserDao";


export default class LikeDao {
    private converter: MongoToClassConverter = new MongoToClassConverter()
    private static likeSingletonDao: LikeDao = new LikeDao()

    public static getInstance() {
        return this.likeSingletonDao;
    }

    private constructor() {
    }

    async createLike(likedTuitId: string, likedByUserId: string): Promise<Like> {
        const newLike = await LikeModel.create({
            likedTuit: likedTuitId,
            likedBy: likedByUserId
        })

        const newLikeId = newLike._id.toString()

        return this.getLikeById(newLikeId);

    }

    async getAllLikes(): Promise<Like[]> {
        const allLikesFromDb = await LikeModel.find().lean();

        const allLikes = []

        for (const eachLike of allLikesFromDb) {
            allLikes.push(await this.converter.convertToLike(eachLike))
        }

        return allLikes;

    }

    async getLikeById(likeId: string): Promise<Like> {
        const likeFromDb = await LikeModel.findById(likeId);
        return await this.converter.convertToLike(likeFromDb)
    }

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

    async deleteLike(likeId: string): Promise<any> {
        const dbResp = await LikeModel.deleteOne({_id: likeId})
        return dbResp.deletedCount;
    }

}