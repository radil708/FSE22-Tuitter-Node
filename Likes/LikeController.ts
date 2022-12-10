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

        this.app.post('/api/likes/tuits/:tid/user/:uid', this.createLike)
        this.app.get('/api/likes',this.getAllLikes)
        this.app.get('/api/likes/:lid', this.getLikeById)
        this.app.get('/api/likes/users/:uid', this.getAllTuitsLikedBy)
        this.app.get('/api/likes/tuits/:tid', this.getAllUsersThatLikedThisTuit)
        this.app.delete('/api/likes/:lid', this.unlike)
        this.app.get('/api/likes/users/:uid/tuits/:tid', this.getLikeByUserAndTuit)
        this.app.put('/api/likes/users/:uid/tuits/:tid', this.toggleLikes)
    }

    async toggleLikes(req: Request, res: Response) {
        const tLikeDao= LikeDao.getInstance();
        const tuitId = req.params.tid;
        const userId = req.params.uid;
        const toggleRes = tLikeDao.toggleLikes(tuitId, userId)
        res.send({"result":toggleRes})

    }

    async getLikeByUserAndTuit(req: Request, res: Response) {
        const tLikeDao= LikeDao.getInstance();
        const tuitId = req.params.tid;
        const userId = req.params.uid;
        const likeFound = tLikeDao.getLikeByUserAndTuit(tuitId, userId)
        if (likeFound == null) {
            res.send({"Error" : "no matching like"})
        }
        else {
            res.send(likeFound)
        }
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
            res.json({"Error": serverResponse})
            return
        }

        const tLikeDao= LikeDao.getInstance();

        const doesLikeAlreadyExist = await tLikeDao.doesLikeEntryAlreadyExist(tuitId,userId)

        if (doesLikeAlreadyExist == true) {
            serverResponse = {"Error":"user with id: " + userId + " has already liked tuit with id: " + tuitId}
        }
        else {
            serverResponse = await tLikeDao.createLike(tuitId,userId)
        }

        res.json(serverResponse)
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
            serverResponse = {"Error": "Format is for lid incorrect or lid does not exist in db"}
            res.json(serverResponse)
            return
        }

        if (serverResponse == null) {
            serverResponse = {"Error": "No entry with like id: " + req.params.lid }
        }

        res.json(serverResponse)
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
        let doesUserExist;
        let controllerResp;
        try {
            doesUserExist = await uDao.doesUserIdExist(req.params.uid)
        }
        catch (BSONTypeError) {
            controllerResp = {"Error": "Incorrect format for uid: " + req.params.uid}
            res.json(controllerResp)
            return
        }

        let serverResponse
        if (doesUserExist == false) {
            serverResponse = {"Error": "There is no user with id: " + req.params.uid + " in the database"}
        }
        else {
            serverResponse = await tLikeDao.getAllTuitsLikedBy(req.params.uid);
        }

        res.json(serverResponse);
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
        let doesTuitExist
        let controllerResp

        try {
            doesTuitExist = await tDao.doesTuitExist(req.params.tid)
        }
        catch (BSONTypeError) {
            controllerResp = {"Error": "Incorrect format for tid: " + req.params.tid}
            res.json(controllerResp)
            return
        }

        if (doesTuitExist == false ) {
            controllerResp = {"Error": "Tuit with id: " + req.params.tid + " does NOT exist"}
        }
        else {
            controllerResp = await tLikeDao.getAllUsersThatLikesThisTuit(req.params.tid)
        }

        res.send(controllerResp);
    }

    /**
     * Deletes a like entry from the collection based
     * on the likeid specified by the client
     * @param req {Request} This object is used to get the client request info
     * @param res {Response} This object is used to send data back to the client
     */
    async unlike(req: Request, res: Response) {
        const tLikeDao= LikeDao.getInstance();
        let numDeleted = 0

        try {
            numDeleted = await tLikeDao.deleteLike(req.params.lid)}
        catch (BSONTypeError) {
            const errorResp = {"Error": "lid format incorrect"}
            res.json(errorResp)
            return
        }

        const resp = {"likesDeleted": numDeleted.toString()}
        res.json(resp)
    }


}