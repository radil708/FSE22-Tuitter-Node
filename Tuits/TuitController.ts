import {Request, Response,Express} from "express";
import TuitControllerInterface from "./TuitControllerInterface";
import TuitDao from "./TuitDao";
import Tuit from "./Tuit";
import User from "../Users/User";
import UserDao from "../Users/UserDao";
import debugHelper from "../debugHelper";


//IMPORTANT LEARNIN NOTE, MAKE THESE FUNCTIONS ASYNC BECAUSE
// THEY RELY ON ASYNC METHODS, OTHERWISE WILL SEND BACK BLANK
export default class TuitController implements TuitControllerInterface {
    app: Express;

    // TODO ask why setting attribute doesn't actually set attribute
    private tuitDao: TuitDao;
    private userDao: UserDao

    public constructor(appIn: Express) {
        this.app = appIn;
        // TODO ask why setting attribute doesn't actually set attribute
        this.tuitDao = TuitDao.getInstance();
        this.userDao = UserDao.getInstance();

        this.app.get('/tuits', this.findAllTuits); // get all tuits
        this.app.get('/tuits/:tid', this.findTuitById); // get a specific tuit by id
        this.app.delete('/tuits/:tid', this.deleteTuit) // delete a tuit
        this.app.post('/users/:uid/tuits', this.createTuit) // create a new tuit
        this.app.get('/users/:uid/tuits',this.findTuitsByUser) // find tuits by a specific user

        // api for A3
        this.app.get('/api/tuits', this.findAllTuits); // get all tuits
        this.app.get('/api/tuits/:tid', this.findTuitById); // get a specific tuit by id
        this.app.delete('/api/tuits/:tid', this.deleteTuit) // delete a tuit
        this.app.post('/api/users/:uid/tuits', this.createTuit) // create a new tuit
        this.app.get('/api/users/:uid/tuits',this.findTuitsByUser) // find tuits by a specific user

    }

    /**
     * Parses client request to create a tuit
     * @param req {Request} This object is used to get the client request info
     * @param res {Response} This object is used to send data back to the client
     */
    async createTuit(req: Request, res: Response) {

        // Get all info needed to make a Tuit object
        const tuitedById = req.params.uid;
        const tuitContent = req.body.tuit;
        let tuitPostedDate = req.body.postedOn
        let userIdExists = false;

        // create a new date if no data passed in the request body
        if (tuitPostedDate == '' || tuitPostedDate == null) {
            tuitPostedDate = new Date();
        }

        // BSON error may occur here, if userid passed is incorrect format
        try {
            userIdExists = await UserDao.getInstance().doesUserIdExist(tuitedById)
        }
        catch (BSONTypeError) {
            let msg = "Format is incorrect for uid\n" + "uid must be a string of 12 bytes or a string of 24 hex characters or an integer"
            const errorMsg = {"Error": msg}
            res.json(errorMsg)
            return
        }


        let controllerResp;
        let userWhoTuited;

        // if tuit property is empty send error
        if (tuitContent == '' || tuitContent == null) {
            controllerResp = "tuit property cannot be empty string or null"
            controllerResp += "\nPlease enter some value into tuit property"
            controllerResp = {"Error": controllerResp}
        }
        //user id is not in database
        else if (userIdExists == false) {
            let msg = "There are no users with id: " + tuitedById.toString() + " in the database"
            controllerResp = {"Error":msg}
        }
        else {
            userWhoTuited = await UserDao.getInstance().findUserById(tuitedById)
            const clientTuit = new Tuit(
                '',
                tuitContent,
                tuitPostedDate,
                userWhoTuited
            )
            controllerResp = await TuitDao.getInstance().createTuit(clientTuit)
        }

        res.json(controllerResp)

        // Set to true to see debug statements
        const printDebug = false;
        if (printDebug) {
            console.log("Does user with id: " + tuitedById + " exist?\n", userIdExists)
            console.log("Response to client:\n", controllerResp)
            debugHelper.printEnd("createTuit", "TuitController")
        }
    }

    /**
     * parses client request to delete a Tuit from the database
     * @param req {Request} This object is used to get the client request info
     * @param res {Response} This object is used to send data back to the client
     */
    async deleteTuit(req: Request, res: Response) {
        const tdao = TuitDao.getInstance()
        const targetTid = req.params.tid
        let numDeleted;

        try {
            numDeleted = await tdao.deleteTuit(targetTid)
        }
        catch (BSONTypeError) {
            let msg = "Format is incorrect for tid\n" + "tid must be a string of 12 bytes or a string of 24 hex characters or an integer"
            const errorMsg = {"Error": msg}
            res.json(errorMsg)
            return
        }

        // modifying to work with tests in A3
        res.json({"tuitsDeleted": numDeleted})
    }

    /**
     * Gets all tuit entries from database, converts them to Tuit objects
     * and sends them to client
     * @param req {Request} This object is used to get the client request info
     * @param res {Response} This object is used to send data back to the client
     */
    async findAllTuits(req: Request, res: Response) {

        res.json(await TuitDao.getInstance().findAllTuits())
    }

    /**
     * Gets a tuit from db with an id matching the requested id
     * @param req {Request} This object is used to get the client request info
     * @param res {Response} This object is used to send data back to the client
     */
    async findTuitById(req: Request, res: Response) {
        const tuitdao = TuitDao.getInstance();
        const tidString = req.params.tid
        let isTuitIdInDb = false;
        let controllerResp;

        //BSONTypeError if value passed incorrect format
        try {
            controllerResp = await tuitdao.findTuitById(tidString)
        }
        catch (BSONTypeError) {
            controllerResp = {"Error" : "Incorrect format for tid. Tid must be a string of 12 bytes or a string of 24 hex characters or an integer"}
            res.json(controllerResp)
            return
        }

        if (controllerResp == null) {
            isTuitIdInDb = true;
            controllerResp = {"Error": "There are no tuits with the id: " + tidString}
        }

        const printDebug = false;
        if (printDebug) {
            console.log("Does user with id" + tidString + "exist? ", isTuitIdInDb )
            console.log("serverResponse: ", controllerResp)
            debugHelper.printEnd("findTuitById", "TuitController")
        }

        res.json(controllerResp)

    }

    /**
     * Gets all Tuits posted by a specific user and sends them to the client
     * @param req {Request} This object is used to get the client request info
     * @param res {Response} This object is used to send data back to the client
     */
    async findTuitsByUser(req: Request, res: Response) {
        const tuitdao = TuitDao.getInstance();
        let serverResponse
        let anyMatchingUsers = false

        try{
            serverResponse = await tuitdao.findTuitsByUser(req.params.uid)
            anyMatchingUsers = true
        }
        catch (BSONTypeError) {
            serverResponse = "No users with id: " + req.params.uid + " exist in the database"
        }

        if (anyMatchingUsers == false) {
            res.json()
        }
        else {
            res.json(serverResponse)
        }


    }

}