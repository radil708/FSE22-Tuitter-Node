import User from "../Users/User";
import Tuit from "../Tuits/Tuit";

export default class Like {
    private likedId: string = "";
    private likedTuit: Tuit | null = null;
    private likedBy: User | null = null;

    constructor(likedIdIn: string, tuitIn: Tuit , userThatLiked: User ) {
        this.likedId = likedIdIn;
        this.likedTuit = tuitIn;
        this.likedBy = userThatLiked;
    }

    getId(): string {
        return this.likedId;
    }

    getTuit(): Tuit {
        return this.likedTuit;
    }

    getLikedBy(): User {
        return this.likedBy;
    }

}