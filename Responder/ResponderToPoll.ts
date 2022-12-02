/**
 * This is a mapping class linking users to polls they vote on.
 * A ResponderToPoll has an associated poll, responder, and the response they chose.
 */
import User from "../Users/User";
import Poll from "../Polls/Poll";

export default class ResponderToPoll {
  private poll: Poll;
  private responder: User;
  private response: string = '';


  /**
   * Constructor for responder to poll.
   * @param poll {Poll} poll that was voted on
   * @param responder {User} User who voted
   * @param response {string} the text of the user's choice
   */
  constructor(poll: Poll, responder: User, response: string) {
    this.poll = poll;
    this.responder = responder;
    this.response = response;
  }

  /**
   * @return {Poll} the Poll
   */
  getPoll() : Poll {
    return this.poll;
  }

  /**
   * @return {User} the responder to the poll
   */
  getResponder() : User {
    return this.responder;
  }

  /**
   * @return {string} the responder's response
   */
  getResponse() : string {
    return this.response;
  }
}
