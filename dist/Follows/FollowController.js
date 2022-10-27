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
const FollowDao_1 = require("./FollowDao");
class FollowController {
    constructor(appIn) {
        this.app = appIn;
        this.app.post('/follower/:rid/following/:gid/follows', this.createFollow);
    }
    createFollow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const fDao = FollowDao_1.default.getInstance();
            const followerId = req.params.rid;
            const followingId = req.params.gid;
            const createdFollow = yield fDao.createFollow(followerId, followingId);
            res.send(createdFollow);
        });
    }
}
exports.default = FollowController;
//# sourceMappingURL=FollowController.js.map