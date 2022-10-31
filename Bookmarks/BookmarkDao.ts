import BookmarkModel from "./BookmarkModel";
import {MongoToClassConverter} from "../MongoToClassConverter";
import Bookmark from "./Bookmark";
import User from "../Users/User";

/**
 * This creates higher level api for database interactions
 */
export default class BookmarkDao {
    private static bSingleton: BookmarkDao = new BookmarkDao()

    /**
     * This enforces Singleton Architecture
     */
    public static getInstance() {
        return this.bSingleton;
    }

    /**
     * This enforces Singleton Architecture
     */
    private constructor() {
    }

    /**
     * Adds a bookmark entry to the Bookmarks collection
     * @param tid {string} the id of the tuit to be bookmarked
     * @param uid {string} the id of the user that is bookmarking the tuit
     */
    async createBookmark(tid: string, uid: string): Promise<Bookmark> {

        const dbResp = await BookmarkModel.create({
            bookmarkedTuit: tid,
            bookmarkedBy: uid
        })

        const bId = dbResp._id.toString();
        return await this.getBookmarkById(bId);
    }

    async getBookmarkById(bid: string): Promise<Bookmark> {
        const dbResp = await BookmarkModel.findById(bid).lean()
        const converter = new MongoToClassConverter();

        return await converter.convertToBookmark(dbResp);
    }

    async doesBookmarkAlreadyExist(tid: string, uid: string): Promise<boolean> {
        const check = await BookmarkModel.find({bookmarkedTuit: tid ,bookmarkedBy: uid})
        console.log(check)
        if (check.length > 0 ) {
            return true
        }
        return false
    }

    async getAllBookmarks(): Promise<Bookmark[]> {
        const allDbBookmarks = await BookmarkModel.find();

        const allBookmarks = []

        for (const eachBookmark of allDbBookmarks) {
            allBookmarks.push(await this.getBookmarkById(eachBookmark._id.toString()))
        }

        return allBookmarks;
    }

    async getUsersBookmarks(userId: string): Promise<Bookmark[]> {
        const dbResp = await BookmarkModel.find({bookmarkedBy: userId})

        const bookmarksIds = []

        for (const eachBookmark of dbResp) {
            bookmarksIds.push((await eachBookmark)._id.toString())
        }

        const bookmarks = []

        for (const eachId of bookmarksIds) {
            bookmarks.push(await this.getBookmarkById(eachId))
        }

        return bookmarks
    }

    async deleteBookmark(bookmarkId: string): Promise<any> {
        const dbResp = await BookmarkModel.deleteOne({_id: bookmarkId})
        return dbResp.deletedCount;
    }
}