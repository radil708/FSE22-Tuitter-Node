import Poll from "./Poll";
import PollModel from "./PollModel";
import pollModel from "./PollModel";
import {MongoToClassConverter} from "../MongoToClassConverter";
import UserDao from "../Users/UserDao";

export default class PollDao {
    // Singleton Pattern
    private static pSingletonDao: PollDao = new PollDao();

    // Singleton Pattern
    public static getInstance() {
        return this.pSingletonDao;
    }

    // Singleton Pattern
    private constructor() {
    }

    /**
     * Get all poll entried
     */
    async findAll() {
        const dbResp = await PollModel.find()
        return dbResp;
    }

    /**
     * Adds an entry to the poll collection
     * @param pollIn
     */
    async createPoll(pollIn: Poll) {

        const dbResp = await PollModel.create({
            question: pollIn.getQuestion(),
            options: pollIn.getAllOptions(),
            optionCount: pollIn.getAnswerOptionsCount(),
            author: pollIn.getAuthor().getUserId()
        })

        return dbResp;
    }

    /**
     * Searches for an entry in the Polls collection
     * with a matching id
     * @param pollId {string} id of requested poll
     */
    async findPollById(pollId: string): Promise<Poll> {
        const dbResp = await PollModel.findById(pollId);
        const conv = new MongoToClassConverter();
        //todo delete
        console.log("find poll by id ->", dbResp)
        return await conv.convertToPoll(dbResp);
    }
    //
    // async findPollsByAuthor(usernameIn: string) {
    //     const pollArr = await PollModel.find({author : {username: usernameIn}}, {})
    // }
    //
    /**
     * Deletes an entry from the Polls collection with matching id
     * @param pollId
     */
    async deletePollById(pollId: string): Promise<number> {
        const dbResp = await PollModel.deleteOne({_id: pollId})
        return dbResp.deletedCount;
    }

    async updateVote(pollIn: Poll) {
        const targetPollID = pollIn.getPollID();
        const updatedVoteCountArr = pollIn.getAnswerOptionsCount();

        //update poll on database side by replace optionCount with updated Arr
        await PollModel.findByIdAndUpdate(
            targetPollID,
            {optionCount: updatedVoteCountArr},
            {new: true}
        )

        const updated = await PollModel.findById(targetPollID)


        return updated;
    }
}
