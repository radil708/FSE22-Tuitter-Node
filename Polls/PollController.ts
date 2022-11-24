import {Express, Request, Response} from "express";
import UserDao from "../Users/UserDao";
import Poll from "./Poll";
import PollDao from "./PollDao";
import debugHelper from "../debugHelper";

export default class PollController {
    app: Express;

    public constructor(appIn: Express) {
        this.app = appIn;

        this.app.post('/api/users/:uid/polls')

    }

    async createPoll(req: Request, res: Response) {
        //get user who posted id
        const userId = req.params.uid
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

        // check req.body for poll info, question cannot be blank and answeroptions len must be greater than 0
        const clientQuestion = req.body.question
        const clientQAnswerOptions = req.body.options

        if (clientQuestion == null || clientQuestion == '') {
            errorMsg = {"Error":"question property cannot be null or empty string"}

        }

        if (clientQAnswerOptions.length == 0 || clientQAnswerOptions == null) {
            errorMsg = {"Error": "options property cannot be empty array or null"}
        }

        const arrOptionCount = []

        // count initialized to 0 for every answer option
        for (let i = 0; i< clientQAnswerOptions.length; i++) {
            arrOptionCount.push(0);
        }

        let dbResp;

        if (errorMsg == null) {
            const userProfile = await UserDao.getInstance().findUserById(userId)
            const pollInstanceNew = new Poll('',userProfile,clientQuestion,clientQAnswerOptions,arrOptionCount);
            dbResp = await PollDao.getInstance().createPoll(pollInstanceNew);
        }
        else {
            dbResp = errorMsg;
        }

        res.json(dbResp);

        let printDebug = false; // set to true to print debug statements

        if (printDebug) {
            if (errorMsg == null) {
                console.log("No error message sent")
            }
            else {
                console.log("Encountered Error")
                console.log("error msg -> ", errorMsg)
            }
            console.log("Client Request User id -> ", userId)
            console.log("Does user exist? -> ", userIdExists)
            console.log("Response to client -> ", dbResp)
            debugHelper.printEnd("createPoll", "PollController")

        }


    }

}