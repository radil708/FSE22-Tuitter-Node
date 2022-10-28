import {Request, Response} from "express";

/**
 * This interface declares the methods required by any LikeControllerObjects.
 * All the methods return void and instead send a response to the client.
 */
export default interface LikeControllerInterface {
    /**
     * Creates a new Like entry based on the client provided
     * userid and tuitId from the req.params
     * @param req
     * @param res
     */
    createLike(req: Request, res: Response)

    /**
     * Sends every Like entry to the client
     * @param req
     * @param res
     */
    getAllLikes(req: Request, res: Response)

    /**
     * Send a specific like entrty from the db to
     * the client with an id specified by the client
     * @param req
     * @param res
     */
    getLikeById(req: Request, res: Response)

    /**
     * Sends all Tuits that were liked by User
     * with an id specified by the client in the req.params
     * @param req
     * @param res
     */
    getAllTuitsLikedBy(req: Request, res: Response)

    /**
     * Sends all the Users that liked a Tuit with an id
     * matching an id specified by the client in the req.params
     * @param req
     * @param res
     */
    getAllUsersThatLikedThisTuit (req: Request, res: Response)

    /**
     * Deletes a like entry from the collection based
     * on the likeid specified by the client
     * @param req
     * @param res
     */
    unlike(req: Request, res: Response)
}