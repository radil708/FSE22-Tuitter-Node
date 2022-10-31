import {Express, Request, Response} from "express";
import LikeDao from "./LikeDao";
import TuitDao from "../Tuits/TuitDao";
import UserDao from "../Users/UserDao";

/**
 * This parses client requests and reads/writes data to/from the database
 * using a dao.
 */
export default class LikeController{
    app: Express;
    likeDao: LikeDao;

    constructor(app: Express) {
        this.app = app;
        // TODO setting this attr does not seem to work, ask why
        this.likeDao = LikeDao.getInstance();

        this.app.post('/tuits/:tid/user/:uid/likes', this.createLike)
        this.app.get('/likes',this.getAllLikes)
        this.app.get('/likes/:lid', this.getLikeById)
        this.app.get('/users/:uid/likes', this.getAllTuitsLikedBy)
        this.app.get('/tuits/:tid/likes', this.getAllUsersThatLikedThisTuit)
        this.app.delete('/likes/:lid', this.unlike)
    }

    /**
     * Creates a new Like entry based on the client provided
     * userid and tuitId from the req.params
     * @param req {Request} This object is used to get the client request info
     * @param res {Response} This object is used to send data back to the client
     */
    async createLike(req: Request, res: Response) {
        const tuitId = req.params.tid;
        const userId = req.params.uid;

        // check if Tuit exists
        const tDao = TuitDao.getInstance()
        const uDao = UserDao.getInstance()
        let doesTuitExist;
        let doesUserExist;
        let serverResponse

        doesTuitExist = await tDao.doesTuitExist(tuitId)
        doesUserExist = await uDao.doesUserIdExist(userId)

        if (doesTuitExist == false ) {
            serverResponse = "Tuit with id: " + tuitId +" does not exist"
        }
        if (doesUserExist == false) {
            serverResponse = "User with id: " + userId + " does not exist"
        }

        if (doesTuitExist == false || doesUserExist == false) {
            res.send(serverResponse)
            return
        }

        const tLikeDao= LikeDao.getInstance();

        const doesLikeAlreadyExist = await tLikeDao.doesLikeEntryAlreadyExist(tuitId,userId)

        if (doesLikeAlreadyExist == true) {
            serverResponse = "user with id: " + userId + " has already liked tuit with id: " + tuitId
        }
        else {
            serverResponse = await tLikeDao.createLike(tuitId,userId)
        }

        res.send(serverResponse)
    }

    /**
     * Sends every Like entry to the client
     * @param req {Request} This object is used to get the client request info
     * @param res {Response} This object is used to send data back to the client
     */
    async getAllLikes(req: Request, res: Response) {
        const tLikeDao= LikeDao.getInstance();
        const allLikes = await tLikeDao.getAllLikes();
        res.send(allLikes);
    }

    /**
     * Send a specific like entrty from the db to
     * the client with an id specified by the client
     * @param req {Request} This object is used to get the client request info
     * @param res {Response} This object is used to send data back to the client
     */
    async getLikeById(req: Request, res: Response) {
        const tLikeDao= LikeDao.getInstance();
        let serverResponse
        try{
            serverResponse = await tLikeDao.getLikeById(req.params.lid)
        }
        catch (BSONTypeError) {
            serverResponse = "Either like entry with id: " + req.params.lid + " does NOT exist \nOR\nFormat is incorrect"
        }

        res.send(serverResponse)
    }

    /**
     * Sends all Tuits that were liked by User
     * with an id specified by the client in the req.params
     * @param req {Request} This object is used to get the client request info
     * @param res {Response} This object is used to send data back to the client
     */
    async getAllTuitsLikedBy(req: Request, res: Response) {
        const tLikeDao= LikeDao.getInstance();

        const uDao = UserDao.getInstance()
        const doesUserExist = await uDao.doesUserIdExist(req.params.uid)
        let serverResponse
        if (doesUserExist == false) {
            serverResponse = "There is no user with id: " + req.params.uid + " in the database"
        }
        else {
            serverResponse = await tLikeDao.getAllTuitsLikedBy(req.params.uid);
        }

        res.send(serverResponse);
    }

    /**
     * Sends all the Users that liked a Tuit with an id
     * matching an id specified by the client in the req.params
     * @param req {Request} This object is used to get the client request info
     * @param res {Response} This object is used to send data back to the client
     */
    async getAllUsersThatLikedThisTuit (req: Request, res: Response) {
        const tLikeDao= LikeDao.getInstance();
        const tDao = TuitDao.getInstance()
        const doesTuitExist = await tDao.doesTuitExist(req.params.tid)
        let serverResponse

        if (doesTuitExist == false ) {
            serverResponse = "Tuit with id: " + req.params.tid + " does NOT exist"
        }
        else {
            serverResponse = await tLikeDao.getAllUsersThatLikesThisTuit(req.params.tid)
        }

        res.send(serverResponse);
    }

    /**
     * Deletes a like entry from the collection based
     * on the likeid specified by the client
     * @param req {Request} This object is used to get the client request info
     * @param res {Response} This object is used to send data back to the client
     */
    async unlike(req: Request, res: Response) {
        const tLikeDao= LikeDao.getInstance();
        const numDeleted = await tLikeDao.deleteLike(req.params.lid)
        const resp = "Likes Deleted = " + numDeleted.toString()
        res.send(resp)
    }


}