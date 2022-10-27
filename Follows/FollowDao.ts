import FollowModel from "./FollowModel";
import {MongoToClassConverter} from "../MongoToClassConverter";
import Follow from "./Follow";

export default class FollowDao {
    private static fSingletonDao: FollowDao = new FollowDao()

    public static getInstance() {
        return this.fSingletonDao;
    }

    private constructor() {
    }

    async findById(followId: string) {
        const converter = new MongoToClassConverter();
        const followFromDb = await FollowModel.findById(followId).lean()
        return await converter.convertToFollow(followFromDb);
    }

    async createFollow(followerId: string, userFollowedId: string): Promise<Follow> {
        const followFromDb = await FollowModel.create({
            userFollowing:followerId,
            userFollowed:userFollowedId})

        const converter = new MongoToClassConverter();
        const newFollow = await FollowModel.findById(followFromDb._id.toString()).lean()
        return await converter.convertToFollow(followFromDb);
    }

    async getAllFollows(): Promise<Follow[]> {
        const allFollowsFromDb = await FollowModel.find()
        const converter = new MongoToClassConverter();

        const allFollowsArr = []

        for (const eachEntry of allFollowsFromDb) {
            allFollowsArr.push(await converter.convertToFollow(eachEntry))
        }

        return allFollowsArr;
    }



}