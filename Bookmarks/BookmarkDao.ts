import BookmarkModel from "./BookmarkModel";
import {MongoToClassConverter} from "../MongoToClassConverter";
import Bookmark from "./Bookmark";
import User from "../Users/User";

export default class BookmarkDao {
    private static bSingleton: BookmarkDao = new BookmarkDao()

    public static getInstance() {
        return this.bSingleton;
    }

    private constructor() {
    }

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