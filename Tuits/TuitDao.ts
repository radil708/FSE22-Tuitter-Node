import TuitDaoInterface from "./TuitDaoInterface";
import Tuit from "./Tuit";
import {MongoToClassConverter} from "../MongoToClassConverter";
import TuitModel from "./TuitModel";

export default class TuitDao implements TuitDaoInterface{
    //Singleton Architecture
    private static tSingletonDao: TuitDao = new TuitDao()

    public static getInstance() {
        return this.tSingletonDao;
    }

    private constructor() {
    }


    async createTuit(tuitIn: Tuit): Promise<Tuit> {

        // this will populate postedBy property with user from db
        const tuitJSON = await TuitModel.create({
            tuit: tuitIn.getContent(),
            postedOn: tuitIn.getDate(),
            postedBy: tuitIn.getUserID()});

        const newTuitId = tuitJSON._id.toString()

        // get user after being made, this returns a User type obj
        return await this.findTuitById(newTuitId)


    }

    async deleteTuit(tuitId: string): Promise<any> {
        console.log("in TuitDao", tuitId)
        const dbResp = await TuitModel.deleteOne({_id : tuitId});
        console.log("after model deletes", dbResp.deletedCount);
        return dbResp.deletedCount;
    }

    async findAllTuits(): Promise<Tuit[]> {
        const allTuitsJSON = await TuitModel.find().lean();
        const conv = new MongoToClassConverter();

        const allTuitArr = [];

        for (const eachTuit of allTuitsJSON) {
            allTuitArr.push(await conv.convertToTuit(eachTuit))
        }

        return allTuitArr
    }

    async findTuitById(id: string): Promise<Tuit> {
        // I can't make this an attribute without an nmp error
        const conv = new MongoToClassConverter();
        const tartgetT = await TuitModel.findById(id).lean();
        const t = await conv.convertToTuit(tartgetT)
        return t
    }

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