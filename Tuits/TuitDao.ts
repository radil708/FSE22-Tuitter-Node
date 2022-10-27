import Tuit from "./Tuit";
import TuitSchema from "./TuitSchema";
import TuitModel from "./TuitModel";
import User from "../Users/User";
import userModel from "../Users/UserModel";
import TuitDaoInterface from "./TuitDaoInterface";
import MongoToClassConverter from "../MongoToClassConverter";

export default class TuitDao implements TuitDaoInterface {
    oid = require('mongodb').ObjectId;
    converter = MongoToClassConverter.getInstance()

    async findAllTuits(): Promise<Tuit[]> {
        const allTuitsJSON = await TuitModel.find().lean();

        const allTuitsArray = []

        for (const each of allTuitsJSON) {
            // need to make this await so call back when conversion complete
            allTuitsArray.push(await this.converter.convertToTuit(each))
        }

        return allTuitsArray;
    }

    async createTuit(tuitIn: Tuit): Promise<Tuit> {
        //can remove
        const userFromDb = await userModel.findById(tuitIn.getUserID());

        const tuitJSON = await TuitModel.create({tuit: tuitIn.getContent(),
                postedOn: tuitIn.getDate(), postedBy: tuitIn.getUserID()});

        const tuitResponse = new Tuit(
            tuitJSON._id.toString(),
            userFromDb._id.toString(),
            tuitJSON.tuit,
            tuitJSON.postedOn
        );

            // can remove
        const userT = new User(
            userFromDb._id.toString() || '',
            userFromDb['username'] || '',
            userFromDb['firstName'] || '',
            userFromDb['lastName'] || '',
            userFromDb['password'] || '',
            userFromDb['email'] || ''
        )

        tuitResponse.setUser(userT);

        return tuitResponse;
    }

    async deleteTuit(tuitId: string): Promise<any> {
        return await TuitModel.deleteOne({_id : tuitId});
    }

    // async updateTuit(tuitId: string, tuit : Tuit) : Promise<number> {
    //     const retTuit =  await TuitModel.updateOne(
    //         {_id: tuitId},
    //         {$set: tuit}
    // );
    //     return retTuit.matchedCount;
    // }

    async findTuitById(id: string) : Promise<Tuit> {
        const tuitFromDb = await TuitModel.findById(id);
        const userFromDb = await userModel.findById(tuitFromDb._id);

        const userT = new User(
            userFromDb._id.toString() || '',
            userFromDb['username'] || '',
            userFromDb['firstName'] || '',
            userFromDb['lastName'] || '',
            userFromDb['password'] || '',
            userFromDb['email'] || '')

        const tuitResponse = new Tuit(
            tuitFromDb._id.toString(),
            userFromDb._id.toString(),
            tuitFromDb.tuit,
            tuitFromDb.postedOn
        );

        tuitResponse.setUser(userT);

        return tuitResponse

    }

    async findTuitsByUser(userId: string): Promise<Tuit[]> {

        // get target user, hopefully they exist
        const userTarget = await userModel.findById(userId)

        const allTuitsByUser = await TuitModel.find({postedBy: userTarget._id})

        const allTuitsArray = allTuitsByUser.map(eachTuit => new Tuit(
                eachTuit._id.toString(),
                eachTuit.postedBy._id.toString(),
                eachTuit['tuit'],
                eachTuit['postedOn']
            )
        );

        allTuitsArray.forEach(indivTuit => indivTuit.setUser(
            new User(
                userTarget._id.toString() || '',
                userTarget['username'] || '',
                userTarget['firstName'] || '',
                userTarget['lastName'] || '',
                userTarget['password'] || '',
                userTarget['email'] || '')
            )
        );

        return allTuitsArray;
    }
}
