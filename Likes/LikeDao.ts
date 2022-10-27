import {MongoToClassConverter} from "../MongoToClassConverter";
import TuitDao from "../Tuits/TuitDao";
import Like from "./Like";
import LikeModel from "./LikeModel";


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

}