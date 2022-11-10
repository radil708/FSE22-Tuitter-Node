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
            try {
                doesTuitExist = yield tDao.doesTuitExist(tuitId);
            }
            catch (BSONTypeError) {
                serverResponse = { "Error": "Format is incorrect for tid\n" + "tid must be a string of 12 bytes or a string of 24 hex characters or an integer" };
                res.json(serverResponse);
                return;
            }
            try {
                doesUserExist = yield uDao.doesUserIdExist(userId);
            }
            catch (BSONTypeError) {
                serverResponse = { "Error": "Format is incorrect for uid\n" + "uid must be a string of 12 bytes or a string of 24 hex characters or an integer" };
                res.json(serverResponse);
                return;
            }
            if (doesTuitExist == false) {
                serverResponse = "Tuit with id: " + tuitId + " does not exist";
            }
            if (doesUserExist == false) {
                serverResponse = "User with id: " + userId + " does not exist";
            }
            if (doesTuitExist == false || doesUserExist == false) {
                res.send({ "Error": serverResponse });
                return;
            }
            const bDao = BookmarkDao_1.default.getInstance();
            const alreadyBookmarked = yield bDao.doesBookmarkAlreadyExist(tuitId, userId);
            if (alreadyBookmarked == true) {
                serverResponse = { "Error": "User with id: " + userId + " has already bookmarked tuit with id: " + tuitId };
            }
            else {
                serverResponse = yield bDao.createBookmark(tuitId, userId);
            }
            res.json(serverResponse);
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
            let bookmark;
            try {
                bookmark = yield bDao.getBookmarkById(bId);
            }
            catch (BSONTypeError) {
                bookmark = { "Error": "No entries with bookmark id = " + bId };
            }
            res.json(bookmark);
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
            let bookmarksBookedByUser;
            try {
                bookmarksBookedByUser = yield bDao.getUsersBookmarks(req.params.uid);
            }
            catch (BSONTypeError) {
                bookmarksBookedByUser = { "Error": "Incorrect format for uid" };
            }
            res.json(bookmarksBookedByUser);
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
            let numDel = 0;
            try {
                numDel = yield bDao.deleteBookmark(bookmarkId);
            }
            catch (BSONTypeError) {
                const errorResp = { "Error": "Incorrect format for uid" };
                res.json(errorResp);
                return;
            }
            res.send({ "bookmarksDeleted": +numDel.toString() });
        });
    }
}
exports.default = BookmarkController;
//# sourceMappingURL=BookmarkController.js.map