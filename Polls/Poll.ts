/**
 * This class represents a Poll.
 * A Poll has an id, a question, responses, and the user who posted
 */
export default class Poll {
  private pollID: string = '';
  private posterID: string = '';
  private posterUserName: string = '';
  private question: string = '';
  private answerOptions: string[];
  private answerOptionsCount: number[];


  /**
   * Constructor for polls.
   * @param pollIDIn {string} unique ID of poll
   * @param posterIDIn {string} unique ID of user who posted poll
   * @param posterUserNameIn {string} username of poster
   * @param questionIn {string} the text of the poll prompt
   * @param answerOptionsIn {string[]} array of response options to prompt
   * @param answerOptionsCountIn {number[]} array of tally of responses
   */
  constructor(pollIDIn: string, posterIDIn : string, posterUserNameIn: string, questionIn: string,
              answerOptionsIn: string[], answerOptionsCountIn: number[]) {
    this.pollID = pollIDIn;
    this.posterID = posterIDIn;
    this.posterUserName = posterUserNameIn;
    this.question = questionIn;
    this.answerOptions = answerOptionsIn;
    this.answerOptionsCount = answerOptionsCountIn;
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
    return this.posterID;
  }

  /**
   * @return {string} the Author's username (posterUserName)
   */
  getAuthor() : string {
    return this.posterUserName;
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


}
