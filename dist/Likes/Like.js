"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This class represents a user liking a Tuit
 */
class Like {
    /**
     * Creates a Like object
     * @param likedIdIn
     * @param tuitIn
     * @param userThatLiked
     */
    constructor(likedIdIn, tuitIn, userThatLiked) {
        this.likedId = "";
        this.likedTuit = null;
        this.likedBy = null;
        this.likedId = likedIdIn;
        this.likedTuit = tuitIn;
        this.likedBy = userThatLiked;
    }
    /**
     * returns the like id of a Like corresponding to it's id in the database
     */
    getId() {
        return this.likedId;
    }
    /**
     * Returns the liked Tuit
     */
    getTuit() {
        return this.likedTuit;
    }
    /**
     * returns the User that liked the TUit
     */
    getLikedBy() {
        return this.likedBy;
    }
}
exports.default = Like;
//# sourceMappingURL=Like.js.map