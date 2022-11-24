import Poll from "./Poll";
import PollModel from "./PollModel";
import pollModel from "./PollModel";
import {MongoToClassConverter} from "../MongoToClassConverter";

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
     * Adds an entry to the poll collection
     * @param pollIn
     */
    async createPoll(pollIn: Poll) {
        const dbResp = await PollModel.create({
            question: pollIn.getQuestion(),
            options: pollIn.getAllOptions(),
            optionCount: pollIn.getAnswerOptionsCount(),
            author: pollIn.getPosterID()})

        return dbResp;
    }

    /**
     * Searches for an entry in the Polls collection
     * with a matching id
     * @param pollId {string} id of requested poll
     */
    async findPollById(pollId: string) {
        const dbResp = await PollModel.findById(pollId);
        const conv = new MongoToClassConverter();
        return dbResp;
    }


}