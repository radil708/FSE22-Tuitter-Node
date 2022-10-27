"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Like {
    constructor(likedIdIn, tuitIn, userThatLiked) {
        this.likedId = "";
        this.likedTuit = null;
        this.likedBy = null;
        this.likedId = likedIdIn;
        this.likedTuit = tuitIn;
        this.likedBy = userThatLiked;
    }
    getId() {
        return this.likedId;
    }
    getTuit() {
        return this.likedTuit;
    }
    getLikedBy() {
        return this.likedBy;
    }
}
exports.default = Like;
//# sourceMappingURL=Like.js.map