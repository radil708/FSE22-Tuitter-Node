"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Follow {
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