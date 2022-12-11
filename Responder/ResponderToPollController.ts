import {Express, Request, Response} from "express";
import UserDao from "../Users/UserDao";
import ResponderToPoll from "./ResponderToPoll";
import ResponderToPollDao from "../Responder/ResponderToPollDao";
import debugHelper from "../debugHelper";
import {MongoToClassConverter} from "../MongoToClassConverter";
import PollDao from "../Polls/PollDao";


export default class ResponderToPollController {
    app: Express;

    public constructor(appIn: Express) {
        this.app = appIn;

        this.app.get("/api/respondertopolls", this.findAllResponderToPolls) // get all ResponderToPoll entries
        this.app.post('/api/respondertopolls/polls/:pid/users/:uid', this.createResponderToPoll) // make a new ResponderToPoll
        this.app.delete('/api/respondertopolls/polls/:pid/users/:uid', this.deleteResponderToPollById) // delete a ResponderToPoll by id
        // this.app.get('/api/respondertopolls/polls/:pid/', this.findResponsesToPoll) // find all responses to poll
        this.app.get('/api/respondertopolls/users/:uid', this.findAllPollsVotedOn) // search R2P by user IS THIS RIGHT??
    }

    async findAllResponderToPolls(req: Request, res: Response) {
        const pDao = ResponderToPollDao.getInstance()
        const all_rtpolls = await pDao.findAll();
        res.send(all_rtpolls)
    }

    async createResponderToPoll(req: Request, res: Response) {
        //get user who posted id
        const userId = req.params.uid
        const pollID = req.params.pid
        const answer = req.params.answer

        const userProfile = await UserDao.getInstance().findUserById(userId)
        const pollActual = await PollDao.getInstance().findPollById(pollID)
        // const rPollInstanceNew = new ResponderToPoll(pollActual,userProfile, answer);

        let dbResp

        dbResp = await ResponderToPollDao.getInstance().createResponseToPoll(userProfile, pollActual, answer);

        res.json(dbResp);

        /**
        let errorMsg = null;
        // Check is userid format correct and that it exists, catch BSONTypeError
        let userIdExists = false;
        try {
            userIdExists = await UserDao.getInstance().doesUserIdExist(userId)
        }
        catch (BSONTypeError) {
            let msg = "Format is incorrect for uid\n" + "uid must be a string of 12 bytes or a string of 24 hex characters or an integer"
            errorMsg = {"Error": msg}
        }
         **/

    }

    async deleteResponderToPollById(req: Request, res: Response) {
        const targetPollId = req.params.pid
        const deletedCount = ResponderToPollDao.getInstance().deleteResponseToPoll(targetPollId)
        res.json({"ResponderToPollsDeleted" : deletedCount})
    }

    async findResponsesToPoll(req: Request, res: Response) {
        const pDao = ResponderToPollDao.getInstance()
        const all_rtpolls = await pDao.findAll();
        res.send(all_rtpolls)
    }

    async findAllPollsVotedOn(req: Request, res: Response) {
        const targetUserID = req.params.uid
        const pDao = ResponderToPollDao.getInstance()
        const all_votes = await pDao.findResponseToPollByUser(targetUserID);
        res.send(all_votes)


    }

}
