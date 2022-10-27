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
class LikeController {
    constructor(app) {
        this.app = app;
        // TODO setting this attr does not seem to work, ask why
        this.likeDao = LikeDao_1.default.getInstance();
        this.app.post('/tuits/:tid/user/:uid/likes', this.createLike);
        this.app.get('/likes', this.getAllLikes);
    }
    createLike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tuitId = req.params.tid;
            const userId = req.params.uid;
            const tLikeDao = LikeDao_1.default.getInstance();
            const likeObj = yield tLikeDao.createLike(tuitId, userId);
            res.send(likeObj);
        });
    }
    getAllLikes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tLikeDao = LikeDao_1.default.getInstance();
            const allLikes = yield tLikeDao.getAllLikes();
            res.send(allLikes);
        });
    }
}
exports.default = LikeController;
//# sourceMappingURL=LikeController.js.map