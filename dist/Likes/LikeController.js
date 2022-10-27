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
class LikeController {
    constructor(appIn, likeDaoIn) {
        this.findAllLikes = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const allLikes = yield this.likeDao.findAllLikes();
            res.json(allLikes);
        });
        this.createLike = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const createdLike = yield this.likeDao.createLike(req.params.tid, req.params.uid);
            res.json(createdLike);
        });
        this.app = appIn;
        this.likeDao = likeDaoIn;
        this.app.get('/likes', this.findAllLikes);
        this.app.post('tuit/:tid/likedBy/:uid/likes', this.createLike);
    }
}
exports.default = LikeController;
//# sourceMappingURL=LikeController.js.map