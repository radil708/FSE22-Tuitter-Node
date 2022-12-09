"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Poll {
    /**
     * Constructor for polls.
     * @param pollIDIn {string} unique ID of poll
     * @param posterIn {User} User who made the poll
     * @param questionIn {string} the text of the poll prompt
     * @param answerOptionsIn {string[]} array of response options to prompt
     */
    constructor(pollIDIn, posterIn, questionIn, answerOptionsIn) {
        this.pollID = '';
        this.question = '';
        this.pollID = pollIDIn;
        this.poster = posterIn;
        this.question = questionIn;
        this.answerOptions = answerOptionsIn;
        // make new associative array to answerOptions all values to 0
        let arrAssociative = [];
        for (let i = 0; i < this.answerOptions.length; i++) {
            arrAssociative.push(0);
        }
        this.answerOptionsCount = arrAssociative;
    }
    /**
     * @return {string} the pollID
     */
    getPollID() {
        return this.pollID;
    }
    /**
     * @return {string} the posterID
     */
    getPosterID() {
        return this.poster.getUserId();
    }
    /**
     * @return {string} the Author's username (posterUserName)
     */
    getAuthorUserName() {
        return this.poster.getUserName();
    }
    getAuthor() {
        return this.poster;
    }
    /**
     * @return {string} the question
     */
    getQuestion() {
        return this.question;
    }
    /**
     * @return {string} the response options to the question
     */
    getAllOptions() {
        return this.answerOptions;
    }
    /**
     * @return {string} the answerOptionsCount
     */
    getAnswerOptionsCount() {
        return this.answerOptionsCount;
    }
    /**
     * @return {string} the total amount of responses to a poll
     */
    getTotalResponseCount() {
        return this.answerOptionsCount.reduce((accumulator, current) => {
            return accumulator + current;
        }, 0);
    }
    setAuthor(posterIn) {
        this.poster = posterIn;
    }
    incrementVote(optionsIndex) {
        this.answerOptionsCount[optionsIndex] += 1;
    }
    decrementVote(optionsIndex) {
        this.answerOptionsCount[optionsIndex] -= 1;
    }
}
exports.default = Poll;
//# sourceMappingURL=Poll.js.map