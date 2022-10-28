import {Express, Request, Response} from "express";
import BookmarkDao from "./BookmarkDao";

export default class BookmarkController {
    app: Express;

    constructor(appIn:Express) {
        this.app = appIn;

        this.app.post('/tuits/:tid/users/:uid/bookmarks', this.bookmarkTuit)

    }

    async bookmarkTuit(req: Request, res: Response){
        const tuitId = req.params.tid
        const userId = req.params.uid

        const bDao = BookmarkDao.getInstance();

        const newBookmark = await bDao.createBookmark(tuitId,userId)

        res.send(newBookmark)
    }

}