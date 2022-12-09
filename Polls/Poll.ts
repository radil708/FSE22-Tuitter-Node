/**
 * This class represents a Poll.
 * A Poll has an id, a question, responses, and the user who posted
 */
import User from "../Users/User";

export default class Poll {
  private pollID: string = '';
  private poster: User;
  private question: string = '';
  private answerOptions: string[];
  private answerOptionsCount: number[];


  /**
   * Constructor for polls.
   * @param pollIDIn {string} unique ID of poll
   * @param posterIn {User} User who made the poll
   * @param questionIn {string} the text of the poll prompt
   * @param answerOptionsIn {string[]} array of response options to prompt
   */
  constructor(pollIDIn: string, posterIn: User, questionIn: string,
              answerOptionsIn: string[]) {
    this.pollID = pollIDIn;
    this.poster = posterIn;
    this.question = questionIn;
    this.answerOptions = answerOptionsIn;

    // make new associative array to answerOptions all values to 0
    let arrAssociative = []

    for (let i = 0; i < this.answerOptions.length; i++) {
      arrAssociative.push(0)
    }
    this.answerOptionsCount = arrAssociative;
  }



  /**
   * @return {string} the pollID
   */
  getPollID() : string {
    return this.pollID;
  }

  /**
   * @return {string} the posterID
   */
  getPosterID() : string {
    return this.poster.getUserId()
  }

  /**
   * @return {string} the Author's username (posterUserName)
   */
  getAuthorUserName() : string {
    return this.poster.getUserName()
  }

  getAuthor() : User {
    return this.poster;
  }
  /**
   * @return {string} the question
   */
  getQuestion() : string {
    return this.question;
  }

  /**
   * @return {string} the response options to the question
   */
  getAllOptions() : string[] {
    return this.answerOptions;
  }

  /**
   * @return {string} the answerOptionsCount
   */
  getAnswerOptionsCount() : number[] {
    return this.answerOptionsCount;
  }

  /**
   * @return {string} the total amount of responses to a poll
   */
  getTotalResponseCount() : number {
    return this.answerOptionsCount.reduce((accumulator, current) => {
      return accumulator + current
    }, 0);
  }

  setAuthor(posterIn: User) {
    this.poster = posterIn;
  }

  incrementVote(optionsIndex: number) {
    this.answerOptionsCount[optionsIndex] += 1;
  }

  decrementVote(optionsIndex: number) {
    this.answerOptionsCount[optionsIndex] -= 1;
  }


}
