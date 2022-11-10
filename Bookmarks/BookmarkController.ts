import {Express, Request, Response} from "express";
import BookmarkDao from "./BookmarkDao";
import TuitDao from "../Tuits/TuitDao";
import UserDao from "../Users/UserDao";

/**
 * This parses client request and reads/writes data to/from the database
 *
 */
export default class BookmarkController {
    app: Express;

    constructor(appIn: Express) {
        this.app = appIn;

        this.app.post('/tuits/:tid/users/:uid/bookmarks', this.bookmarkTuit)
        this.app.get('/bookmarks/:bid', this.getBookmarkById)
        this.app.get('/bookmarks', this.getAllBookmarks)
        this.app.get('/users/:uid/bookmarks', this.getUsersBookmarks)
        this.app.delete('/bookmarks/:bid', this.unbookmark)

    }

    /**
     * User bookmarks a tuit
     * @param req
     * @param res
     */
    async bookmarkTuit(req: Request, res: Response) {
        const tuitId = req.params.tid
        const userId = req.params.uid

        // check if Tuit exists
        const tDao = TuitDao.getInstance()
        const uDao = UserDao.getInstance()
        let doesTuitExist;
        let doesUserExist;
        let serverResponse

        try {
            doesTuitExist = await tDao.doesTuitExist(tuitId)
        }
        catch (BSONTypeError) {
            serverResponse = {"Error": "Format is incorrect for tid\n" + "tid must be a string of 12 bytes or a string of 24 hex characters or an integer"}
            res.json(serverResponse)
            return
        }

        try {
            doesUserExist = await uDao.doesUserIdExist(userId)
        }
        catch (BSONTypeError) {
            serverResponse = {"Error": "Format is incorrect for uid\n" + "uid must be a string of 12 bytes or a string of 24 hex characters or an integer"}
            res.json(serverResponse)
            return
        }


        if (doesTuitExist == false ) {
            serverResponse = "Tuit with id: " + tuitId +" does not exist"
        }
        if (doesUserExist == false) {
            serverResponse = "User with id: " + userId + " does not exist"
        }

        if (doesTuitExist == false || doesUserExist == false) {
            res.send({"Error": serverResponse})
            return
        }

        const bDao = BookmarkDao.getInstance();
        const alreadyBookmarked = await bDao.doesBookmarkAlreadyExist(tuitId,userId)

        if (alreadyBookmarked == true) {
            serverResponse = {"Error": "User with id: " + userId + " has already bookmarked tuit with id: " + tuitId}
        }
        else {
            serverResponse = await bDao.createBookmark(tuitId, userId)
        }

        res.json(serverResponse)
    }

    /**
     * Get a specific bookmark with matching id
     * @param req
     * @param res
     */
    async getBookmarkById(req: Request, res: Response) {
        const bId = req.params.bid
        const bDao = BookmarkDao.getInstance();
        let bookmark

        try {
            bookmark = await bDao.getBookmarkById(bId)
        }
        catch (BSONTypeError) {
            bookmark = {"Error": "No entries with bookmark id = " + bId}
        }
        res.json(bookmark)
    }

    /**
     * Get all bookmarks
     * @param req
     * @param res
     */
    async getAllBookmarks(req: Request, res: Response) {
        const bDao = BookmarkDao.getInstance();
        res.send(await bDao.getAllBookmarks())
    }

    /**
     * Get all bookmarks of a user
     * @param req
     * @param res
     */
    async getUsersBookmarks(req: Request, res: Response) {
        const bDao = BookmarkDao.getInstance();
        let bookmarksBookedByUser
        try {
            bookmarksBookedByUser = await bDao.getUsersBookmarks(req.params.uid)
        }
        catch (BSONTypeError) {
            bookmarksBookedByUser = {"Error": "Incorrect format for uid"}
        }

        res.json(bookmarksBookedByUser)
    }

    /**
     * user unbookmarks a tuit
     * @param req
     * @param res
     */
    async unbookmark(req: Request, res: Response) {
        const bookmarkId = req.params.bid
        const bDao = BookmarkDao.getInstance();
        let numDel = 0;

        try {
            numDel = await bDao.deleteBookmark(bookmarkId)
        }
        catch (BSONTypeError) {
            const errorResp = {"Error": "Incorrect format for uid"}
            res.json(errorResp)
            return
        }

        res.send({"bookmarksDeleted" : + numDel.toString()})
    }
}