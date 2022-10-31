import User from "../Users/User";

/**
 * This class represents a follow where one user follows another
 */
export default class Follow {
    private followId: string = '';
    private userFollowed: User | null = null;
    private userFollowing: User | null = null;

    /**
     * Constructor for follow
     * @param followIdIn
     * @param beingFollowed
     * @param follower
     */
    constructor(followIdIn: string, beingFollowed: User | null = null, follower: User | null = null) {
        this.followId = followIdIn;
        this.userFollowed = beingFollowed;
        this.userFollowing = follower;
    }

    getId(): string {
        return this.followId
    }

    getFollower(): User {
        return this.userFollowing;
    }

    getBeingFollowed(): User {
        return this.userFollowed;
    }
}