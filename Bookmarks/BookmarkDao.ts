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
        const dbResp = await BookmarkModel.findById(bid)
        const converter = new MongoToClassConverter();

        return await converter.convertToBookmark(dbResp);
    }
}