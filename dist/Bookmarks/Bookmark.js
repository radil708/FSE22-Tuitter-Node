"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Bookmark {
    constructor(idIn, bookmarkedTuitIn, bookmarkedByIn) {
        this._bookmarkId = '';
        this._bookmarkedTuit = null;
        this._bookmarkedBy = null;
        this._bookmarkId = idIn;
        this._bookmarkedTuit = bookmarkedTuitIn;
        this._bookmarkedBy = bookmarkedByIn;
    }
    getId() {
        return this._bookmarkId;
    }
    getbookmarkedTuit() {
        return this._bookmarkedTuit;
    }
    getbookmarkedBy() {
        return this._bookmarkedBy;
    }
}
exports.default = Bookmark;
//# sourceMappingURL=Bookmark.js.map