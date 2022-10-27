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
const Tuit_1 = require("./Tuit");
class TuitController {
    constructor(appIn, tuitDaoIn, userDaoIn) {
        this.createTuit = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.uid;
            //TODO what if user does not exist?
            const clientTuit = new Tuit_1.default('', userId.toString(), req.body.tuit, req.body.postedOn);
            //pass in userId as well
            const tuitFromDb = yield this.tuitDao.createTuit(clientTuit);
            res.send(tuitFromDb);
        });
        this.deleteTuit = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const tuitIdTarget = req.params.tid;
            const count = yield this.tuitDao.deleteTuit(tuitIdTarget);
            res.send(count);
        });
        this.findAllTuits = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const allTuits = yield this.tuitDao.findAllTuits();
            res.json(allTuits);
        });
        this.findTuitById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const tuitIdTarget = req.params.tid;
            const targetTuit = yield this.tuitDao.findTuitById(tuitIdTarget);
            res.json(targetTuit);
        });
        // updateTuit = async (req: Request, res: Response) => {
        //     const tuitIdTarget = req.params.tid;
        //
        //     const tuitToUpdate = await this.tuitDao.findTuitById(tuitIdTarget);
        //
        //     const req_content = req.body.tuit;
        //
        //     // update the content of the tuit
        //     tuitToUpdate.setContent(req_content);
        //
        //     const updateResp = await this.tuitDao.updateTuit(tuitIdTarget, tuitToUpdate)
        //
        //     res.send(updateResp);
        // }
        this.findTuitsByUser = (req, res) => {
            this.tuitDao.findTuitsByUser(req.params.uid)
                .then(tuits => res.json(tuits));
        };
        this.app = appIn;
        this.tuitDao = tuitDaoIn;
        this.userDao = userDaoIn;
        this.app.get('/tuits', this.findAllTuits);
        this.app.get('/tuits/:tid', this.findTuitById);
        this.app.get('/users/:uid/tuits', this.findTuitsByUser);
        this.app.post('/users/:uid/tuits', this.createTuit);
        this.app.delete('/tuits/:tid', this.deleteTuit);
        //this.app.put('/tuits/:tid', this.updateTuit)
    }
}
exports.default = TuitController;
//# sourceMappingURL=TuitController.js.map