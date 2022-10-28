import {Express, Request, Response} from "express";
import BookmarkDao from "./BookmarkDao";

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

    async bookmarkTuit(req: Request, res: Response) {
        const tuitId = req.params.tid
        const userId = req.params.uid

        const bDao = BookmarkDao.getInstance();

        const newBookmark = await bDao.createBookmark(tuitId, userId)

        res.send(newBookmark)
    }

    async getBookmarkById(req: Request, res: Response) {
        const bId = req.params.bid
        const bDao = BookmarkDao.getInstance();
        const bookmark = await bDao.getBookmarkById(bId)
        res.send(bookmark)
    }

    async getAllBookmarks(req: Request, res: Response) {
        const bDao = BookmarkDao.getInstance();
        res.send(await bDao.getAllBookmarks())
    }

    async getUsersBookmarks(req: Request, res: Response) {
        const bDao = BookmarkDao.getInstance();
        const bookmarksBookedByUser = await bDao.getUsersBookmarks(req.params.uid)
        res.send(bookmarksBookedByUser)
    }

    async unbookmark(req: Request, res: Response) {
        const bookmarkId = req.params.bid
        const bDao = BookmarkDao.getInstance();
        const numDel = await bDao.deleteBookmark(bookmarkId)
        res.send("Bookmarks Deleted = " + numDel.toString())
    }
}