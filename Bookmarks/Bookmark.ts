import User from "../Users/User";
import Tuit from "../Tuits/Tuit";

export default class Bookmark {
    private _bookmarkId: string = '';
    private _bookmarkedTuit: Tuit | null = null;
    private _bookmarkedBy: User | null= null;


    constructor(idIn: string, bookmarkedTuitIn: Tuit | null, bookmarkedByIn: User | null) {
        this._bookmarkId = idIn;
        this._bookmarkedTuit = bookmarkedTuitIn;
        this._bookmarkedBy = bookmarkedByIn;
    }

    getId(): string {
        return this._bookmarkId;
    }

    getbookmarkedTuit(): Tuit | null {
        return this._bookmarkedTuit;
    }

    getbookmarkedBy(): User | null {
        return this._bookmarkedBy;
    }
}