import {Request, Response} from "express";
import User from "../Users/User";
import Poll from "../Polls/Poll";

export default interface ResponderToPollDaoInterface{

    /**
     * Gets a Response from the database with an ID matching the ID requested
     * by a client. It will send the matching Response in the response body in the JSON format
     * matching user object in the body for it.
     * @param req {Request} A Request object containing the client's request
     * as an express.Request object. Will contain the user defined responseID.
     * @param res {Response} A Response object that will be used to
     * send a single Response with id matching the userid from the req
     * to the client
     */
    findResponseToPollById(pollID: string): Promise<ResponderToPoll>;

    /**
     * Creates a Response in the database as defined by the client's req body.
     * It will also send back the created Response to the client as a JSON
     * in the response body.
     * @param req {Request} A Request object containing the client's request
     * as an express. Request object. Containing the user id of the user who is responding to the poll.
     * @param res {Response} A Response object that will be used to
     * send the created Response to the client
     */
    createResponseToPoll(userID: User, pollID: Poll, answer: string): Promise<ResponderToPoll>;

    /**
     * Deletes a Response from the database whose Response id matches the client
     * defined Response id.
     * @param req {Request}  A Request object containing the client's request
     * as an express.Request object. The request params need to contain the client defined response id
     * @param res {Response} A Response object that will send
     * the amount of deleted response to the client
     */
    deleteResponseToPoll(pollID: string): Promise<any>;

    /**
     * Gets Response from the database from a user with a userid defined by the client.
     * @param req {Request} A Request object containing the client's request
     * as an express.Request object. The req must contain the client defined user id
     * @param res
     */
    findResponseToPollByUser(userId: string): Promise<ResponderToPoll[]>;
}