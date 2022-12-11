import ResponderToPollDaoInterface from "./ResponderToPollDaoInterface";
import {MongoToClassConverter} from "../MongoToClassConverter";
import {Error} from "mongoose";
import debugHelper from "../debugHelper";
import PollModel from "../Polls/PollModel";
import Poll from "../Polls/Poll";
import User from "../Users/User";
import ResponderToPoll from "./ResponderToPoll";
import ResponderToPollModel from "./ResponderToPollModel";


export default class ResponderToPollDao implements ResponderToPollDaoInterface {
    //Singleton Architecture
    private static rSingletonDao: ResponderToPollDao = new ResponderToPollDao()

    /**
     * Enforces Singleton Architecture. Call this method to get the TuitDao
     */
    public static getInstance() {
        return this.rSingletonDao;
    }

    /**
     * User to enfore the Singleton Architecture
     * @private
     */
    private constructor() {
    }

    /**
     * Get all responderTopoll entries
     */
    async findAll() {
        const dbResp = await ResponderToPollModel.find()
        return dbResp;
    }

    /**
     * Creates a new entry in the Tuits Collection
     * @param userID
     * @param pollID
     * @param answer
     */
    async createResponseToPoll(userID: User, pollID: Poll, answer: string): Promise<ResponderToPoll> {
        //throw new Error("Method not implemented.");
        const daoJSON = await ResponderToPollModel.create({
            answer: answer,
            responderId: userID.getUserId(),
            pollId: pollID.getPollID()
        });

        //todo delete
        console.log("DAO JSON form createRespnse to Poll -> ", daoJSON)
        const newRTPid = daoJSON._id.toString()

        // get user after being made, this returns a rtp type obj
        return await this.findResponseToPollById(newRTPid)
    }

    /**
     * This will delete a tuit entry from the Tuits collection
     * with an id matching the tuitID
     * @return the amount of tuits deleted, 1 if successful, 0 if failed
     * @param pollID
     */
    async deleteResponseToPoll(pollID: string): Promise<any> {
        const dbResp = await ResponderToPollModel.deleteOne({_id : pollID});
        return dbResp.deletedCount;
    }


    /**
     * Checks if tuit entry already exists
     * @param id {string} the id of the tuit entry you want to check
     */
    async doesPollExist(id: string) {
        const check = await ResponderToPollModel.findById(id)
        if (check != null) {
            return true
        }
        return false
    }


    /**
     * Searches for an entry in the Tuits collection with an
     * id matching the id passed in. It will throw a ValidationError
     * if no such id exists
     * @param id {string} the id of the tuit you are looking for
     */
    async findResponseToPollById(pollID: string): Promise<ResponderToPoll> {
        // I can't make this an attribute without an npm error
        const conv = new MongoToClassConverter();
        const tartgetT = await ResponderToPollModel.findById(pollID).lean();
        let pollIdExist;
        let retResponse;

        if (tartgetT == null) {
            retResponse = null;
        }
        else {
            pollIdExist = true;
            retResponse = conv.convertToResponse(tartgetT)
        }

        const printDebug = true;
        if (printDebug) {
            console.log("Does pollId: " + pollID+ " exist?  ", pollIdExist)
            console.log("Target t-> ", tartgetT)
            console.log("Response returned by model:\n", retResponse)
            debugHelper.printEnd("findResponseToPollById", "ResponseToPollDao")
        }

        return retResponse

    }

    /**
     * This will find all Tuits posted by a user with an id
     * matching the userId passed in
     * @param userId {string} the userId of user whose Tuits are you are looking for
     */
    async findResponseToPollByUser(userId: string): Promise<ResponderToPoll[]> {
        const dbResp = await ResponderToPollModel.find({responderId: userId})
        const conv = new MongoToClassConverter();
        const allResponsesArr = []

        for (const eachTuit of dbResp) {
            allResponsesArr.push(await conv.convertToTuit(eachTuit))
        }

        return allResponsesArr;
    }

}