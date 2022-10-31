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
const BookmarkDao_1 = require("./BookmarkDao");
const TuitDao_1 = require("../Tuits/TuitDao");
const UserDao_1 = require("../Users/UserDao");
/**
 * This parses client request and reads/writes data to/from the database
 *
 */
class BookmarkController {
    constructor(appIn) {
        this.app = appIn;
        this.app.post('/tuits/:tid/users/:uid/bookmarks', this.bookmarkTuit);
        this.app.get('/bookmarks/:bid', this.getBookmarkById);
        this.app.get('/bookmarks', this.getAllBookmarks);
        this.app.get('/users/:uid/bookmarks', this.getUsersBookmarks);
        this.app.delete('/bookmarks/:bid', this.unbookmark);
    }
    /**
     * User bookmarks a tuit
     * @param req
     * @param res
     */
    bookmarkTuit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tuitId = req.params.tid;
            const userId = req.params.uid;
            // check if Tuit exists
            const tDao = TuitDao_1.default.getInstance();
            const uDao = UserDao_1.default.getInstance();
            let doesTuitExist;
            let doesUserExist;
            let serverResponse;
            doesTuitExist = yield tDao.doesTuitExist(tuitId);
            doesUserExist = yield uDao.doesUserIdExist(userId);
            if (doesTuitExist == false) {
                serverResponse = "Tuit with id: " + tuitId + " does not exist";
            }
            if (doesUserExist == false) {
                serverResponse = "User with id: " + userId + " does not exist";
            }
            if (doesTuitExist == false || doesUserExist == false) {
                res.send(serverResponse);
                return;
            }
            const bDao = BookmarkDao_1.default.getInstance();
            const alreadyBookmarked = yield bDao.doesBookmarkAlreadyExist(tuitId, userId);
            if (alreadyBookmarked == true) {
                serverResponse = "User with id: " + userId + " has already bookmarked tuit with id: " + tuitId;
            }
            else {
                serverResponse = yield bDao.createBookmark(tuitId, userId);
            }
            res.send(serverResponse);
        });
    }
    /**
     * Get a specific bookmark with matching id
     * @param req
     * @param res
     */
    getBookmarkById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const bId = req.params.bid;
            const bDao = BookmarkDao_1.default.getInstance();
            const bookmark = yield bDao.getBookmarkById(bId);
            res.send(bookmark);
        });
    }
    /**
     * Get all bookmarks
     * @param req
     * @param res
     */
    getAllBookmarks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const bDao = BookmarkDao_1.default.getInstance();
            res.send(yield bDao.getAllBookmarks());
        });
    }
    /**
     * Get all bookmarks of a user
     * @param req
     * @param res
     */
    getUsersBookmarks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const bDao = BookmarkDao_1.default.getInstance();
            const bookmarksBookedByUser = yield bDao.getUsersBookmarks(req.params.uid);
            res.send(bookmarksBookedByUser);
        });
    }
    /**
     * user unbookmarks a tuit
     * @param req
     * @param res
     */
    unbookmark(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookmarkId = req.params.bid;
            const bDao = BookmarkDao_1.default.getInstance();
            const numDel = yield bDao.deleteBookmark(bookmarkId);
            res.send("Bookmarks Deleted = " + numDel.toString());
        });
    }
}
exports.default = BookmarkController;
//# sourceMappingURL=BookmarkController.js.map