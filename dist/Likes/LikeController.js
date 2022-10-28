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
const LikeDao_1 = require("./LikeDao");
/**
 * This parses client requests and reads/writes data to/from the database
 * using a dao.
 */
class LikeController {
    constructor(app) {
        this.app = app;
        // TODO setting this attr does not seem to work, ask why
        this.likeDao = LikeDao_1.default.getInstance();
        this.app.post('/tuits/:tid/user/:uid/likes', this.createLike);
        this.app.get('/likes', this.getAllLikes);
        this.app.get('/likes/:lid', this.getLikeById);
        this.app.get('/users/:uid/likes', this.getAllTuitsLikedBy);
        this.app.get('/tuits/:tid/likes', this.getAllUsersThatLikedThisTuit);
        this.app.delete('/likes/:lid', this.unlike);
    }
    /**
     * Creates a new Like entry based on the client provided
     * userid and tuitId from the req.params
     * @param req
     * @param res
     */
    createLike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tuitId = req.params.tid;
            const userId = req.params.uid;
            const tLikeDao = LikeDao_1.default.getInstance();
            const likeObj = yield tLikeDao.createLike(tuitId, userId);
            res.send(likeObj);
        });
    }
    /**
     * Sends every Like entry to the client
     * @param req
     * @param res
     */
    getAllLikes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tLikeDao = LikeDao_1.default.getInstance();
            const allLikes = yield tLikeDao.getAllLikes();
            res.send(allLikes);
        });
    }
    /**
     * Send a specific like entrty from the db to
     * the client with an id specified by the client
     * @param req
     * @param res
     */
    getLikeById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tLikeDao = LikeDao_1.default.getInstance();
            const targetedLike = yield tLikeDao.getLikeById(req.params.lid);
            res.send(targetedLike);
        });
    }
    /**
     * Sends all Tuits that were liked by User
     * with an id specified by the client in the req.params
     * @param req
     * @param res
     */
    getAllTuitsLikedBy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tLikeDao = LikeDao_1.default.getInstance();
            const allTuitsLikedByUser = yield tLikeDao.getAllTuitsLikedBy(req.params.uid);
            res.send(allTuitsLikedByUser);
        });
    }
    /**
     * Sends all the Users that liked a Tuit with an id
     * matching an id specified by the client in the req.params
     * @param req
     * @param res
     */
    getAllUsersThatLikedThisTuit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tLikeDao = LikeDao_1.default.getInstance();
            const usersThatLiked = yield tLikeDao.getAllUsersThatLikesThisTuit(req.params.tid);
            res.send(usersThatLiked);
        });
    }
    /**
     * Deletes a like entry from the collection based
     * on the likeid specified by the client
     * @param req
     * @param res
     */
    unlike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tLikeDao = LikeDao_1.default.getInstance();
            const numDeleted = yield tLikeDao.deleteLike(req.params.lid);
            const resp = "Likes Deleted = " + numDeleted.toString();
            res.send(resp);
        });
    }
}
exports.default = LikeController;
//# sourceMappingURL=LikeController.js.map