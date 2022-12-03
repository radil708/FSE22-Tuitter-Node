"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponderToPoll {
    /**
     * Constructor for responder to poll.
     * @param poll {Poll} poll that was voted on
     * @param responder {User} User who voted
     * @param response {string} the text of the user's choice
     */
    constructor(poll, responder, response) {
        this.response = '';
        this.poll = poll;
        this.responder = responder;
        this.response = response;
    }
    /**
     * @return {Poll} the Poll
     */
    getPoll() {
        return this.poll;
    }
    /**
     * @return {User} the responder to the poll
     */
    getResponder() {
        return this.responder;
    }
    /**
     * @return {string} the responder's response
     */
    getResponse() {
        return this.response;
    }
}
exports.default = ResponderToPoll;
//# sourceMappingURL=ResponderToPoll.js.map