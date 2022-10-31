"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This class represents a user bookmarking a Tuit
 */
class Bookmark {
    /**
     * Constructor for Bookmark class
     * @param idIn
     * @param bookmarkedTuitIn
     * @param bookmarkedByIn
     */
    constructor(idIn, bookmarkedTuitIn, bookmarkedByIn) {
        this._bookmarkId = '';
        this._bookmarkedTuit = null;
        this._bookmarkedBy = null;
        this._bookmarkId = idIn;
        this._bookmarkedTuit = bookmarkedTuitIn;
        this._bookmarkedBy = bookmarkedByIn;
    }
    /**
     * Get the id of the bookmark which corresponds to entry id
     */
    getId() {
        return this._bookmarkId;
    }
    /**
     * Gets id of bookmarked tuit
     */
    getbookmarkedTuit() {
        return this._bookmarkedTuit;
    }
    /**
     * get user who bookmarked a tuit
     */
    getbookmarkedBy() {
        return this._bookmarkedBy;
    }
}
exports.default = Bookmark;
//# sourceMappingURL=Bookmark.js.map