import User from "../Users/User";
import Tuit from "../Tuits/Tuit";

/**
 * This class represents a user bookmarking a Tuit
 */
export default class Bookmark {
    private _bookmarkId: string = '';
    private _bookmarkedTuit: Tuit | null = null;
    private _bookmarkedBy: User | null= null;


    /**
     * Constructor for Bookmark class
     * @param idIn
     * @param bookmarkedTuitIn
     * @param bookmarkedByIn
     */
    constructor(idIn: string, bookmarkedTuitIn: Tuit | null, bookmarkedByIn: User | null) {
        this._bookmarkId = idIn;
        this._bookmarkedTuit = bookmarkedTuitIn;
        this._bookmarkedBy = bookmarkedByIn;
    }

    /**
     * Get the id of the bookmark which corresponds to entry id
     */
    getId(): string {
        return this._bookmarkId;
    }

    /**
     * Gets id of bookmarked tuit
     */
    getbookmarkedTuit(): Tuit | null {
        return this._bookmarkedTuit;
    }

    /**
     * get user who bookmarked a tuit
     */
    getbookmarkedBy(): User | null {
        return this._bookmarkedBy;
    }
}