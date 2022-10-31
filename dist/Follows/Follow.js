"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This class represents a follow where one user follows another
 */
class Follow {
    /**
     * Constructor for follow
     * @param followIdIn
     * @param beingFollowed
     * @param follower
     */
    constructor(followIdIn, beingFollowed = null, follower = null) {
        this.followId = '';
        this.userFollowed = null;
        this.userFollowing = null;
        this.followId = followIdIn;
        this.userFollowed = beingFollowed;
        this.userFollowing = follower;
    }
    getId() {
        return this.followId;
    }
    getFollower() {
        return this.userFollowing;
    }
    getBeingFollowed() {
        return this.userFollowed;
    }
}
exports.default = Follow;
//# sourceMappingURL=Follow.js.map