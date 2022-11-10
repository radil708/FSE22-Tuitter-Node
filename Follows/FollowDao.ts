import FollowModel from "./FollowModel";
import {MongoToClassConverter} from "../MongoToClassConverter";
import Follow from "./Follow";
import UserDao from "../Users/UserDao";
import User from "../Users/User";

/**
 * This DAO uses the FollowModel to interact with the database
 */
export default class FollowDao {
    private static fSingletonDao: FollowDao = new FollowDao()

    /**
     * Enforces Singleton Architecture. Call this method to get the FollowDao
     */
    public static getInstance() {
        return this.fSingletonDao;
    }

    /**
     * Enforces Singleton Architecture
     * @private
     */
    private constructor() {
    }

    /**
     * Gets an entry from the database with an id matchin followIf
     * @param followId {string} the id of the entry being requested
     */
    async findById(followId: string) {
        const converter = new MongoToClassConverter();
        const followFromDb = await FollowModel.findById(followId).lean()
        return await converter.convertToFollow(followFromDb);
    }

    /**
     * Checks if the follow entry already exists
     * @param followerId {string} id of the user who is following
     * @param userFollowedId {string} if of the user being followed
     */
    async checkIfAlreadyFollowing(followerId: string, userFollowedId: string): Promise<boolean> {
        const check = await FollowModel.find({userFollowed: userFollowedId, userFollowing: followerId})

        if (check != null) {
            return true;
        }
        return false;
    }

    /**
     * Adds an entry to the Follows collection of the database
     * @param followerId {string} The database entry id of the follower
     * @param userFollowedId {string} the database entry id of the user being followed
     */
    async createFollow(followerId: string, userFollowedId: string): Promise<Follow> {

        const followFromDb = await FollowModel.create({
            userFollowing:followerId,
            userFollowed:userFollowedId})

        const converter = new MongoToClassConverter();
        const newFollow = await FollowModel.findById(followFromDb._id.toString()).lean()
        return await converter.convertToFollow(newFollow);
    }

    /**
     * Gets all follows from the database
     */
    async getAllFollows(): Promise<Follow[]> {
        const allFollowsFromDb = await FollowModel.find()
        const converter = new MongoToClassConverter();

        const allFollowsArr = []

        for (const eachEntry of allFollowsFromDb) {
            allFollowsArr.push(await converter.convertToFollow(eachEntry))
        }

        return allFollowsArr;
    }

    /**
     * Gets a follow entry with an id matching followId
     * @param followId {string} the id of the follow entry you want to get
     */
    async deleteFollow(followId: string): Promise<any> {
        const dbResp = await FollowModel.deleteOne({_id: followId })
        return dbResp.deletedCount;
    }

    /**
     * Gets all users that the current user is following
     * @param userIdFollower {string} the id of the current user
     */
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

    /**
     * Gets all users following the current user
     * @param followingId {string} the id of the current user
     */
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