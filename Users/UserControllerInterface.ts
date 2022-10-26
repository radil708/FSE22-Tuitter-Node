import {Request, Response} from "express";

/**
 * This controller interface declares all the methods required for any UserController
 * type object. It uses Request and Response type object from
 * the express module.
 */
export default interface UserControllerInterface {
    /**
     * Gets all users from the database and sends them to the client
     * @param req {Request} A Request object containing the client's request
     * as an express.Request object
     * @param res {Response} A Response object which will be used to send
     * All users from the database in the format of a JSON array to the client
     */
    findAllUsers(req: Request, res: Response): void;

    /**
     * Gets a user from the database with an ID matching the ID requested
     * by a client. It will send the matching user in the response body
     * in the JSON format.
     * @param req {Request} A Request object containing the client's request
     * as an express.Request object
     * @param res {Response} A Response object that will be used to
     * send a single user with id matching the userid from the req
     * to the client
     */
    findUserById(req: Request, res: Response): void;

    /**
     * Gets a user by their username from the database with a username matching the
     * username requested by the client. This will send the matching user
     * in the response body in JSON format.
     * @param req {Request} A Request object containing the client's request
     * as an express.Request object
     * @param res {Response} A Response object that will be used to
     * send a single user with username matching the username from the req
     * to the client
     */
    findUserbyUserName(req: Request, res: Response): void;

    /**
     * Creates a user in the database as defined by the client's req body.
     * It will also send back the created user to the client as a JSON
     * in the response body.
     * @param req {Request} A Request object containing the client's request
     * as an express.Request object. The response body should contain
     * a JSON with the following properties:
     *      username:
     *      password:
     *      firstName:
     *      lastName:
     *      email:
     * @param res {Response} A Response object that will be used to
     * send the created user to the client
     */
    createUser(req: Request, res: Response): void;

    /**
     * Deletes a user from the database whose userid matches the user
     * defined userid from the client's request.
     * @param req {Request}  A Request object containing the client's request
     * as an express.Request object. The req.params['userid'] needs
     * to contain the client defined userid
     * @param res {Response} A Response object that will send
     * the amount of deleted users to the client
     */
    deleteUser(req: Request, res: Response): void;

    // /**
    //  * Replaces a user from the database with a user
    //  * defined by the client as a JSON in the client's
    //  * request. It will send the amount of entries updated
    //  * back to the user
    //  * @param req {Request}  A Request object containing the client's request
    //  * as an express.Request object. The req.params['userid'] needs
    //  * to contain the client defined userid. Additionally,
    //  * the req.body needs to contain the following properties
    //  * which will override the properties of the user
    //  * the client wants to update from the database
    //  *      username
    //  *      password
    //  *      firstName
    //  *      lastName
    //  *      email
    //  * @param res {Response} A Response object that will send
    //  * the amount of updated users to the client
    //  */
    // updateUser(req: Request, res: Response): void;
}
