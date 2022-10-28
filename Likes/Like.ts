import User from "../Users/User";
import Tuit from "../Tuits/Tuit";

/**
 * This class represents a user liking a Tuit
 */
export default class Like {
    private likedId: string = "";
    private likedTuit: Tuit | null = null;
    private likedBy: User | null = null;

    /**
     * Creates a Like object
     * @param likedIdIn
     * @param tuitIn
     * @param userThatLiked
     */
    constructor(likedIdIn: string, tuitIn: Tuit , userThatLiked: User ) {
        this.likedId = likedIdIn;
        this.likedTuit = tuitIn;
        this.likedBy = userThatLiked;
    }

    /**
     * returns the like id of a Like corresponding to it's id in the database
     */
    getId(): string {
        return this.likedId;
    }

    /**
     * Returns the liked Tuit
     */
    getTuit(): Tuit {
        return this.likedTuit;
    }

    /**
     * returns the User that liked the TUit
     */
    getLikedBy(): User {
        return this.likedBy;
    }

}