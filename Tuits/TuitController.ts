import {Request, Response,Express} from "express";
import TuitControllerInterface from "./TuitControllerInterface";
import TuitDao from "./TuitDao";
import UserDao from "../Users/UserDao";
import User from "../Users/User";
import Tuit from "./Tuit";
import staticDaos from "../staticDaos";


export default class TuitController implements TuitControllerInterface {
    app: Express;
    tuitDao: TuitDao = staticDaos.getInstance().getTuitDao();
    userDao: UserDao = staticDaos.getInstance().getUserDao();

    constructor(appIn: Express ) {
        this.app = appIn;

        this.app.get('/tuits', this.findAllTuits);
        this.app.get('/tuits/:tid', this.findTuitById)
        this.app.get('/users/:uid/tuits', this.findTuitsByUser)
        this.app.post('/users/:uid/tuits',this.createTuit);
        this.app.delete('/tuits/:tid', this.deleteTuit)
        //this.app.put('/tuits/:tid', this.updateTuit)


    }


    createTuit = async (req: Request, res: Response) => {

        const userId = req.params.uid;
        //TODO what if user does not exist?

        const clientTuit = new Tuit(
           '',
            userId.toString(),
            req.body.tuit,
            req.body.postedOn
        )

        //pass in userId as well
        const tuitFromDb = await this.tuitDao.createTuit(clientTuit);

        res.send(tuitFromDb)

    }

    deleteTuit = async (req: Request, res: Response) => {
        const tuitIdTarget = req.params.tid;
        const count = await this.tuitDao.deleteTuit(tuitIdTarget);
        res.send(count)
    }

    findAllTuits = async (req: Request, res: Response) => {
        const allTuits = await this.tuitDao.findAllTuits();
        res.json(allTuits);
    }

    findTuitById = async (req: Request, res: Response) => {
        const tuitIdTarget = req.params.tid;
        const targetTuit = await this.tuitDao.findTuitById(tuitIdTarget);
        res.json(targetTuit);

    }

    // updateTuit = async (req: Request, res: Response) => {
    //     const tuitIdTarget = req.params.tid;
    //
    //     const tuitToUpdate = await this.tuitDao.findTuitById(tuitIdTarget);
    //
    //     const req_content = req.body.tuit;
    //
    //     // update the content of the tuit
    //     tuitToUpdate.setContent(req_content);
    //
    //     const updateResp = await this.tuitDao.updateTuit(tuitIdTarget, tuitToUpdate)
    //
    //     res.send(updateResp);
    // }

    findTuitsByUser = (req: Request, res: Response) => {

        this.tuitDao.findTuitsByUser(req.params.uid)
            .then(tuits => res.json(tuits));
    }

}