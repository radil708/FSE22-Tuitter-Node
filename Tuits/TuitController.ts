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

        let userIdExists = true;
        let userWhoTuited = null;

        try {
            //TODO ask why code below does not work but code below that one does
            //userWhoTuited = await this.userDao.findUserById(tuitedById)
            userWhoTuited = await UserDao.getInstance().findUserById(tuitedById)
        }
        catch (BSONTypeError) {
            userIdExists = false;
        }

        let serverResponse
        if (tuitContent == '' || tuitContent == null) {
            serverResponse = "tuit property cannot be empty string or null"
            serverResponse += "\nPlease enter some value into tuit property"
        }


        // if userId not in database
        if (userIdExists == false) {
            serverResponse = 'user with id: ' + tuitedById + ' does not exist in database'
            serverResponse += '\nPlease check user id value and format'
        }
        else {
            // if date not added in body then make one for today
            if (tuitPostedDate == '' || tuitPostedDate == null) {
                tuitPostedDate = new Date();
            }
            const clientTuit = new Tuit(
                '',
                tuitContent,
                tuitPostedDate,
                userWhoTuited
            )
            serverResponse = await TuitDao.getInstance().createTuit(clientTuit)
        }

        // Set to true to see debug statements
        const printDebug = true;
        if (printDebug) {
            console.log("Does user with id: " + tuitedById + " exist?\n", userIdExists)
            console.log("Response to client:\n", serverResponse)
            debugHelper.printEnd("createTuit", "TuitController")
        }

        // modifying to work with tests in A3
        if (userIdExists == false) {
            res.json()
        }
        else {
            res.json(serverResponse)
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
        const numDeleted = await tdao.deleteTuit(targetTid)

        const stringResp = "Number of tuits deleted: " + numDeleted.toString()

        // send needs to be a string otherwise it will think status code
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
        let serverResponse;

        try {
            serverResponse = await tuitdao.findTuitById(tidString)
            isTuitIdInDb = true
        }
        catch (ValidationError) {
            serverResponse = "Tuit with id: " + tidString + " does not exist in database"
        }

        const printDebug = false;
        if (printDebug) {
            console.log("Does user with id" + tidString + "exist? ", isTuitIdInDb )
            console.log("serverResponse: ", serverResponse)
            debugHelper.printEnd("findTuitById", "TuitController")
        }

        // modifying for tests in A3
        if (isTuitIdInDb == false) {
            res.json()
        }
        else {
            res.send(serverResponse)
        }

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