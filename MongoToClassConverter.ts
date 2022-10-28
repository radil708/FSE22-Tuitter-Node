import User from "./Users/User";
import UserDao from "./Users/UserDao";
import TuitDao from "./Tuits/TuitDao";
import Tuit from "./Tuits/Tuit";
import Like from "./Likes/Like";
import FollowModel from "./Follows/FollowModel";
import Follow from "./Follows/Follow";
import FollowDao from "./Follows/FollowDao";
import Bookmark from "./Bookmarks/Bookmark";


export class MongoToClassConverter {
    // TODO ask, why can't I set more than one wihtout TypeError: MongoToClassConverter_1.MongoToClassConverter is not a constructor
    //  attr??

    constructor() {}

    async convertToUser(mongoRes, showPassword = false, showNames= true): Promise<User> {
        const jScriptObj = mongoRes

        let pwd = '';
        let firstName = '';
        let lastName = '';

        if (showPassword == true) {
            pwd = jScriptObj["password"]
        }

        if (showNames == true) {
            firstName = jScriptObj["firstName"];
            lastName = jScriptObj["lastName"];
        }


        return new User(
            jScriptObj["_id"],
            jScriptObj["username"],
            firstName,
            lastName,
            pwd,
            jScriptObj["email"])

    }

    async convertToTuit(mongoRes): Promise<Tuit> {
        const tUserDao = UserDao.getInstance();

        const tid = mongoRes["_id"].toString()

        const uid = mongoRes["postedBy"]._id.toString()

        const tuitedBy = await tUserDao.findUserById(uid)

        const retTuit =  new Tuit(
            tid,
            uid,
            mongoRes["tuit"],
            mongoRes["postedOn"],
            tuitedBy)

        return retTuit

    }

    async convertToLike(mongoRes): Promise<Like> {
        const likeId = mongoRes["_id"].toString()
        const likedTuitid = mongoRes["likedTuit"]._id.toString()
        const likedById = mongoRes["likedBy"]._id.toString()

        const tuitedBy = await UserDao.getInstance().findUserById(likedById)
        const likedTuit = await TuitDao.getInstance().findTuitById(likedTuitid)

        const retLike = new Like(
            likeId,
            likedTuit,
            tuitedBy
        )

        return retLike
    }

    async convertToFollow(mongoRes): Promise<Follow> {
        const followId = mongoRes["_id"].toString()
        const userFollowedId = mongoRes.userFollowed._id.toString();
        const userFollowingId = mongoRes.userFollowing._id.toString();

        const uDao = UserDao.getInstance();
        const userFollowed = await uDao.findUserById(userFollowedId)
        const userFollowing = await uDao.findUserById(userFollowingId)

        return new Follow(followId, userFollowed,userFollowing);

    }

    async convertToBookmark(mongoRes): Promise<Bookmark> {

        const bId = mongoRes["_id"].toString()
        const bookmarkedTuitId = mongoRes.bookmarkedTuit._id.toString()
        const bookedBy = mongoRes.bookmarkedBy._id.toString();

        //TODO remove prints
        // console.log(bId)
        console.log('tuit id', bookmarkedTuitId)
        console.log("user id",bookedBy)

        const uDao = UserDao.getInstance();
        const tDao = TuitDao.getInstance()

        const userIn = await uDao.findUserById(bookedBy)
        const tuitIn = await tDao.findTuitById(bookmarkedTuitId)

        return new Bookmark(bId, tuitIn,userIn)
    }





}