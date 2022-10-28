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
            const dbResp = yield BookmarkModel_1.default.findById(bid);
            const converter = new MongoToClassConverter_1.MongoToClassConverter();
            return yield converter.convertToBookmark(dbResp);
        });
    }
}
exports.default = BookmarkDao;
BookmarkDao.bSingleton = new BookmarkDao();
//# sourceMappingURL=BookmarkDao.js.map