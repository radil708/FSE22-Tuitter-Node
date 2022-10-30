import {Request, Response,Express} from "express";
import TuitControllerInterface from "./TuitControllerInterface";
import TuitDao from "./TuitDao";
import Tuit from "./Tuit";
import User from "../Users/User";
import UserDao from "../Users/UserDao";


//IMPORTANT LEARNIN NOTE, MAKE THESE FUNCTIONS ASYNC BECAUSE
// THEY RELY ON ASYNC METHODS, OTHERWISE WILL SEND BACK BLANK
export default class TuitController implements TuitControllerInterface {
    app: Express;

    // TODO ask why setting attribute doesn't actually set attribute
    private tuitDao: TuitDao;

    public constructor(appIn: Express) {
        this.app = appIn;
        // TODO ask why setting attribute doesn't actually set attribute
        this.tuitDao = TuitDao.getInstance();
        this.app.get('/tuits', this.findAllTuits);
        this.app.get('/tuits/:tid', this.findTuitById);
        this.app.delete('/tuits/:tid', this.deleteTuit)
        this.app.post('/users/:uid/tuits', this.createTuit)
        this.app.get('/users/:uid/tuits',this.findTuitsByUser)

    }


    async createTuit(req: Request, res: Response) {

        // Get all info needed to make a Tuit object
        const tuitedById = req.params.uid;
        const tuitContent = req.body.tuit;
        let tuitPostedDate = req.body.postedOn

        // if date not added in body then make one for today
        if (tuitPostedDate = '' || tuitPostedDate == null) {
            tuitPostedDate = new Date();
        }

        console.log(tuitPostedDate)

        const clientTuit = new Tuit(
            '',
            tuitedById,
            tuitContent,
            tuitPostedDate
        )

        const dbResp = await TuitDao.getInstance().createTuit(clientTuit)

        res.send(dbResp)
    }

    async deleteTuit(req: Request, res: Response) {
        const tdao = TuitDao.getInstance()
        const targetTid = req.params.tid
        const numDeleted = await tdao.deleteTuit(targetTid)

        const stringResp = "Number of users deleted: " + numDeleted.toString()

        // send needs to be a string otherwise it will thinkg status code
        res.send(stringResp)
    }

    async findAllTuits(req: Request, res: Response) {

        res.send(await TuitDao.getInstance().findAllTuits())
    }

    async findTuitById(req: Request, res: Response) {
        const tuitdao = TuitDao.getInstance();
        const tidString = req.params.tid

        const targetTuit = await tuitdao.findTuitById(tidString);

        res.send(targetTuit)
    }

    async findTuitsByUser(req: Request, res: Response) {
        const tuitdao = TuitDao.getInstance();
        const tuitsByUser = await tuitdao.findTuitsByUser(req.params.uid)
        res.send(tuitsByUser)

    }

}