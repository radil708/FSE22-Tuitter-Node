import {Express, Request, Response} from "express";
import BookmarkDao from "./BookmarkDao";

export default class BookmarkController {
    app: Express;

    constructor(appIn:Express) {
        this.app = appIn;

        this.app.post('/tuits/:tid/users/:uid/bookmarks', this.bookmarkTuit)
        this.app.get('/bookmarks/:bid', this.getBookmarkById)
        this.app.get('/bookmarks', this.getAllBookmarks)

    }

    async bookmarkTuit(req: Request, res: Response){
        const tuitId = req.params.tid
        const userId = req.params.uid

        const bDao = BookmarkDao.getInstance();

        const newBookmark = await bDao.createBookmark(tuitId,userId)

        res.send(newBookmark)
    }

    async getBookmarkById(req: Request, res: Response){
        const bId = req.params.bid
        const bDao = BookmarkDao.getInstance();
        const bookmark = await bDao.getBookmarkById(bId)
        res.send(bookmark)
    }

    async getAllBookmarks(req: Request, res: Response){
        const bDao = BookmarkDao.getInstance();
        res.send(await bDao.getAllBookmarks())
    }



}