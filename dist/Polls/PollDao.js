"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const PollModel_1 = require("./PollModel");
const MongoToClassConverter_1 = require("../MongoToClassConverter");
class PollDao {
    // Singleton Pattern
    constructor() {
    }
    // Singleton Pattern
    static getInstance() {
        return this.pSingletonDao;
    }
    /**
     * Get all poll entried
     */
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const dbResp = yield PollModel_1.default.find();
            return dbResp;
        });
    }
    /**
     * Adds an entry to the poll collection
     * @param pollIn
     */
    createPoll(pollIn) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbResp = yield PollModel_1.default.create({
                question: pollIn.getQuestion(),
                options: pollIn.getAllOptions(),
                optionCount: pollIn.getAnswerOptionsCount(),
                author: pollIn.getAuthor().getUserId()
            });
            return dbResp;
        });
    }
    /**
     * Searches for an entry in the Polls collection
     * with a matching id
     * @param pollId {string} id of requested poll
     */
    findPollById(pollId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbResp = yield PollModel_1.default.findById(pollId);
            const conv = new MongoToClassConverter_1.MongoToClassConverter();
            return yield conv.convertToPoll(dbResp);
        });
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
    deletePollById(pollId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbResp = yield PollModel_1.default.deleteOne({ _id: pollId });
            return dbResp.deletedCount;
        });
    }
    updateVote(pollIn) {
        return __awaiter(this, void 0, void 0, function* () {
            const targetPollID = pollIn.getPollID();
            const updatedVoteCountArr = pollIn.getAnswerOptionsCount();
            //update poll on database side by replace optionCount with updated Arr
            yield PollModel_1.default.findByIdAndUpdate(targetPollID, { optionCount: updatedVoteCountArr }, { new: true });
            const updated = yield PollModel_1.default.findById(targetPollID);
            return updated;
        });
    }
}
exports.default = PollDao;
// Singleton Pattern
PollDao.pSingletonDao = new PollDao();
//# sourceMappingURL=PollDao.js.map