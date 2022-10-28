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
const BookmarkDao_1 = require("./BookmarkDao");
class BookmarkController {
    constructor(appIn) {
        this.app = appIn;
        this.app.post('/tuits/:tid/users/:uid/bookmarks', this.bookmarkTuit);
    }
    bookmarkTuit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tuitId = req.params.tid;
            const userId = req.params.uid;
            const bDao = BookmarkDao_1.default.getInstance();
            const newBookmark = yield bDao.createBookmark(tuitId, userId);
            res.send(newBookmark);
        });
    }
}
exports.default = BookmarkController;
//# sourceMappingURL=BookmarkController.js.map