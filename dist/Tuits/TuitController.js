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
const TuitDao_1 = require("./TuitDao");
const Tuit_1 = require("./Tuit");
//IMPORTANT LEARNIN NOTE, MAKE THESE FUNCTIONS ASYNC BECAUSE
// THEY RELY ON ASYNC METHODS, OTHERWISE WILL SEND BACK BLANK
class TuitController {
    constructor(appIn) {
        this.app = appIn;
        // TODO ask why setting attribute doesn't actually set attribute
        this.tuitDao = TuitDao_1.default.getInstance();
        this.app.get('/tuits', this.findAllTuits);
        this.app.get('/tuits/:tid', this.findTuitById);
        this.app.delete('/tuits/:tid', this.deleteTuit);
        this.app.post('/users/:uid/tuits', this.createTuit);
        this.app.get('/users/:uid/tuits', this.findTuitsByUser);
    }
    createTuit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get all info needed to make a Tuit object
            const tuitedById = req.params.uid;
            const tuitContent = req.body.tuit;
            let tuitPostedDate = req.body.postedOn;
            // if date not added in body then make one for today
            if (tuitPostedDate = '' || tuitPostedDate == null) {
                tuitPostedDate = new Date();
            }
            console.log(tuitPostedDate);
            const clientTuit = new Tuit_1.default('', tuitedById, tuitContent, tuitPostedDate);
            const dbResp = yield TuitDao_1.default.getInstance().createTuit(clientTuit);
            res.send(dbResp);
        });
    }
    deleteTuit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tdao = TuitDao_1.default.getInstance();
            const targetTid = req.params.tid;
            const numDeleted = yield tdao.deleteTuit(targetTid);
            const stringResp = "Number of users deleted: " + numDeleted.toString();
            // send needs to be a string otherwise it will thinkg status code
            res.send(stringResp);
        });
    }
    findAllTuits(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.send(yield TuitDao_1.default.getInstance().findAllTuits());
        });
    }
    findTuitById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tuitdao = TuitDao_1.default.getInstance();
            const tidString = req.params.tid;
            const targetTuit = yield tuitdao.findTuitById(tidString);
            res.send(targetTuit);
        });
    }
    findTuitsByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tuitdao = TuitDao_1.default.getInstance();
            const tuitsByUser = yield tuitdao.findTuitsByUser(req.params.uid);
            res.send(tuitsByUser);
        });
    }
}
exports.default = TuitController;
//# sourceMappingURL=TuitController.js.map