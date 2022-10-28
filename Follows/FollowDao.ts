import FollowModel from "./FollowModel";
import {MongoToClassConverter} from "../MongoToClassConverter";
import Follow from "./Follow";
import UserDao from "../Users/UserDao";
import User from "../Users/User";

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

    async deleteFollow(followId: string): Promise<any> {
        const dbResp = await FollowModel.deleteOne({_id: followId })
        return dbResp.deletedCount;
    }

    async getUsersIAmFollowing(userIdFollower: string): Promise<User[]> {
        // client is the one following
        const allFollowsWhereUserIsFollower = await FollowModel.find({userFollowing: userIdFollower})

        const allFollowingIdsArr = []

        for (const eachFollow of allFollowsWhereUserIsFollower) {
            allFollowingIdsArr.push((await eachFollow).userFollowed._id.toString())
        }

        const allUsersBeingFollowedByMe = []
        const uDao = UserDao.getInstance();
        for (const eachUserId of allFollowingIdsArr) {
            allUsersBeingFollowedByMe.push(await uDao.findUserById(eachUserId))
        }
        return allUsersBeingFollowedByMe;
    }

    async getUsersFollowingMe(followingId: string): Promise<User[]> {
        const followsDb = await FollowModel.find({userFollowed: followingId})

        const userIds = []

        // get user id's of everyone following me
        for (const eachFollow of followsDb) {
            userIds.push((await eachFollow).userFollowing._id.toString())
        }

        const uDao = UserDao.getInstance();

        const usersFollowingMe = []

        // use the userID's to get Users
        for (const eachId of userIds) {
            usersFollowingMe.push(await uDao.findUserById(eachId))
        }

        return usersFollowingMe;
    }



}