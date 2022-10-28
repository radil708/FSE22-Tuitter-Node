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
class BookmarkDao {
    constructor() {
    }
    static getInstance() {
        return this.bSingleton;
    }
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
    getBookmarkById(bid) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbResp = yield BookmarkModel_1.default.findById(bid).lean();
            const converter = new MongoToClassConverter_1.MongoToClassConverter();
            return yield converter.convertToBookmark(dbResp);
        });
    }
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