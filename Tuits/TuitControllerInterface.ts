import Tuit from "./Tuit";
import {Request, Response} from "express";

export default interface TuitControllerInterface{

    /**
     * Gets all users from the database and sends them to the client
     * @param req {Request} A Request object containing the client's request
     * as an express.Request object. This is linked to the '/tuits' URI
     * @param res {Response} A Response object which will be used to send
     * All Tuits from the database in the format of a JSON array to the client
     * in its response body
     */
    findAllTuits(req: Request, res: Response): void;

    /**
     * Gets a Tuit from the database with an ID matching the ID requested
     * by a client. It will send the matching Tuit in the response body
     * in the JSON format.
     * matching user object in the body fo t
     * @param req {Request} A Request object containing the client's request
     * as an express.Request object. The req.params.tid will contain the
     * user defined tid.
     * @param res {Response} A Response object that will be used to
     * send a single Tuit with id matching the userid from the req
     * to the client
     */
    findTuitById(req: Request, res: Response): void;

    /**
     * Creates a Tuit in the database as defined by the client's req body.
     * It will also send back the created Tuit to the client as a JSON
     * in the response body.
     * @param req {Request} A Request object containing the client's request
     * as an express.Request object. The req.params.uid must containe
     * the user id of the user who is "posting" the tweet.
     * The response body should contain a JSON with the following properties:
     *      tuit: {string}
     *      postedOn: {Date} or string rep of a date is ISO format
     * @param res {Response} A Response object that will be used to
     * send the created Tuit to the client
     */
    createTuit(req: Request, res: Response): void;

    /**
     * Deletes a Tuit from the database whose tuit id matches the client
     * defined tuit id.
     * @param req {Request}  A Request object containing the client's request
     * as an express.Request object. The req.params.tid needs
     * to contain the client defined tuit id
     * @param res {Response} A Response object that will send
     * the amount of deleted tuits to the client
     */
    deleteTuit(req: Request, res: Response): void;

    // /**
    //  * Replaces a Tuit from the database with a Tuit
    //  * defined by the client as a JSON in the client's
    //  * request. It will send the amount of entries updated
    //  * back to the user
    //  * @param req {Request}  A Request object containing the client's request
    //  * as an express.Request object. The req.params.tid needs
    //  * to contain the client defined tuit id. Additionally,
    //  * the req.body needs to contain the following properties
    //  * which will override the properties of the tuit
    //  * the client wants to update from the database
    //  *      tuit: {string}
    //  *      postedOn: {Date} or string rep of a date is ISO format
    //  * @param res {Response} A Response object that will send
    //  * the amount of updated users to the client
    //  */
    // updateTuit(req: Request, res: Response): void;

    /**
     * Gets all Tuits from the database from a user with a userid
     * defined by the client.
     * @param req {Request} A Request object containing the client's request
     * as an express.Request object. The req.params.uid must contain
     * the client defined user id
     * @param res
     */
    findTuitsByUser (req: Request, res: Response) : void;
}