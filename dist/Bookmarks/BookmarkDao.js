"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const BookmarkModel_1 = require("./BookmarkModel");
const MongoToClassConverter_1 = require("../MongoToClassConverter");
/**
 * This creates higher level api for database interactions
 */
class BookmarkDao {
    /**
     * This enforces Singleton Architecture
     */
    constructor() {
    }
    /**
     * This enforces Singleton Architecture
     */
    static getInstance() {
        return this.bSingleton;
    }
    /**
     * Adds a bookmark entry to the Bookmarks collection
     * @param tid {string} the id of the tuit to be bookmarked
     * @param uid {string} the id of the user that is bookmarking the tuit
     */
    createBookmark(tid, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbResp = yield BookmarkModel_1.default.create({
                bookmarkedTuit: tid,
                bookmarkedBy: uid
            });
            const bId = dbResp._id.toString();
            return yield this.getBookmarkById(bId);
        });
    }
    /**
     * Get a bookmark by id
     * @param bid
     */
    getBookmarkById(bid) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbResp = yield BookmarkModel_1.default.findById(bid).lean();
            const converter = new MongoToClassConverter_1.MongoToClassConverter();
            return yield converter.convertToBookmark(dbResp);
        });
    }
    /**
     * check if a bookmark entry already exists
     * @param tid
     * @param uid
     */
    doesBookmarkAlreadyExist(tid, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const check = yield BookmarkModel_1.default.find({ bookmarkedTuit: tid, bookmarkedBy: uid });
            console.log(check);
            if (check.length > 0) {
                return true;
            }
            return false;
        });
    }
    /**
     * get all bookmarks
     */
    getAllBookmarks() {
        return __awaiter(this, void 0, void 0, function* () {
            const allDbBookmarks = yield BookmarkModel_1.default.find();
            const allBookmarks = [];
            for (const eachBookmark of allDbBookmarks) {
                allBookmarks.push(yield this.getBookmarkById(eachBookmark._id.toString()));
            }
            return allBookmarks;
        });
    }
    /**
     * get all bookmarks of a specific user
     * @param userId
     */
    getUsersBookmarks(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbResp = yield BookmarkModel_1.default.find({ bookmarkedBy: userId });
            const bookmarksIds = [];
            for (const eachBookmark of dbResp) {
                bookmarksIds.push((yield eachBookmark)._id.toString());
            }
            const bookmarks = [];
            for (const eachId of bookmarksIds) {
                bookmarks.push(yield this.getBookmarkById(eachId));
            }
            return bookmarks;
        });
    }
    /**
     * delete an entry from the Bookmarks collection
     * @param bookmarkId
     */
    deleteBookmark(bookmarkId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbResp = yield BookmarkModel_1.default.deleteOne({ _id: bookmarkId });
            return dbResp.deletedCount;
        });
    }
}
exports.default = BookmarkDao;
BookmarkDao.bSingleton = new BookmarkDao();
//# sourceMappingURL=BookmarkDao.js.map