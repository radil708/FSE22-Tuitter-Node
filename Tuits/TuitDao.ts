import TuitDaoInterface from "./TuitDaoInterface";
import Tuit from "./Tuit";
import {MongoToClassConverter} from "../MongoToClassConverter";
import TuitModel from "./TuitModel";
import {Error} from "mongoose";
import {ValidationError} from "../Users/UserDao";
import debugHelper from "../debugHelper";

export default class TuitDao implements TuitDaoInterface{
    //Singleton Architecture
    private static tSingletonDao: TuitDao = new TuitDao()

    /**
     * Enforces Singleton Architecture. Call this method to get the TuitDao
     */
    public static getInstance() {
        return this.tSingletonDao;
    }

    /**
     * User to enfore the Singleton Architecture
     * @private
     */
    private constructor() {
    }


    /**
     * Creates a new entry in the Tuits Collection
     * @param tuitIn
     */
    async createTuit(tuitIn: Tuit): Promise<Tuit> {

        // this will populate postedBy property with user from db
        const tuitJSON = await TuitModel.create({
            tuit: tuitIn.getContent(),
            postedOn: tuitIn.getDate(),
            postedBy: tuitIn.getUser().getUserId()
        });

        const newTuitId = tuitJSON._id.toString()

        // get user after being made, this returns a User type obj
        return await this.findTuitById(newTuitId)
    }

    /**
     * Checks if tuit entry already exists
     * @param id {string} the id of the tuit entry you want to check
     */
    async doesTuitExist(id: string) {
        const check = await TuitModel.findById(id)
        if (check != null) {
            return true
        }
        return false
    }

    /**
     * This will delete a tuit entry from the Tuits collection
     * with an id matching the tuitID
     * @param tuitId {string} the id of the tuit to be deleted
     * @return the amount of tuits deleted, 1 if successful, 0 if failed
     */
    async deleteTuit(tuitId: string): Promise<any> {
        const dbResp = await TuitModel.deleteOne({_id : tuitId});
        return dbResp.deletedCount;
    }

    /**
     * Gets all the entries from the Tuits collection and
     * returns them as an array of Tuit objects
     * @return {Promise<Tuit[]>} an array of Tuit objects
     */
    async findAllTuits(): Promise<Tuit[]> {
        const allTuitsJSON = await TuitModel.find().lean();
        const conv = new MongoToClassConverter();

        const allTuitArr = [];

        for (const eachTuit of allTuitsJSON) {
            allTuitArr.push(await conv.convertToTuit(eachTuit))
        }

        return allTuitArr
    }

    /**
     * Searches for an entry in the Tuits collection with an
     * id matching the id passed in. It will throw a ValidationError
     * if no such id exists
     * @param id {string} the id of the tuit you are looking for
     */
    async findTuitById(id: string): Promise<Tuit> {
        // I can't make this an attribute without an nmp error
        const conv = new MongoToClassConverter();
        const tartgetT = await TuitModel.findById(id).lean();
        let tuitIdExist;
        let retTuit;

        if (tartgetT == null || tartgetT == undefined) {
            tuitIdExist = false;
        }
        else {
            tuitIdExist = true;
            retTuit = conv.convertToTuit(tartgetT)
        }

        const printDebug = false;
        if (printDebug) {
            console.log("Does tuitId: " + id+ " exist?  ", tuitIdExist)
            console.log("Tuit returned by model:\n", retTuit)
            debugHelper.printEnd("findTuitById", "TuitDao")
        }

        if (tuitIdExist) {
            return retTuit
        }
        else {
            throw new ValidationError("Tuit id: " + id + "does not exist in database")
        }

    }

    /**
     * This will find all Tuits posted by a user with an id
     * matching the userId passed in
     * @param userId {string} the userId of user whose Tuits are you are looking for
     */
    async findTuitsByUser(userId: string): Promise<Tuit[]> {
        const dbTuits = await TuitModel.find({postedBy: userId})
        const conv = new MongoToClassConverter();
        const allTuitsArr = []

        for (const eachTuit of dbTuits) {
            allTuitsArr.push(await conv.convertToTuit(eachTuit))
        }

        return allTuitsArr;
    }

}