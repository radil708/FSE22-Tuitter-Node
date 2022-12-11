"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//iter1
/**
 * This class represents a tuit.
 * A tuit has an id, some content, date posted, and the user who posted
 */
class Tuit {
    /**
     * The constructor for the Tuit
     * @param tuitIdIn {string} the id of the tuit corresponding to the entry id from the database
     * @param contentIn {string} the content of the tuit
     * @param postedOnIn {Date} the data the tuit was posted
     * @param userIn {User} the user who posted the tuit
     */
    constructor(tuitIdIn, contentIn, postedOnIn, userIn = null) {
        this.tuitID = '';
        this.tuitContent = '';
        this.postedOn = new Date();
        this.tuitID = tuitIdIn;
        this.tuitContent = contentIn;
        this.postedOn = postedOnIn;
        this.postedBy = userIn;
    }
    /**
     * @return {string} the id attribute of the tuit
     */
    getTuitId() {
        return this.tuitID;
    }
    /**
     * @return {string} the content of the tuit
     */
    getContent() {
        return this.tuitContent;
    }
    /**
     * @return {User} the user of who posted the Tuit
     */
    getUser() {
        return this.postedBy;
    }
    /**
     * This method will be used to update or set the tuitContent attribute
     * of the Tuit object instant
     * @param contentIn {string} will replace the current tuitContent attribute
     */
    setContent(contentIn) {
        this.tuitContent = contentIn;
    }
    /**
     * @return {Date} the date the tuit was posted
     */
    getDate() {
        return this.postedOn;
    }
    /**
     * For A4 need to have a stats property
     * @param likeCount
     */
    setStats(likeCount) {
        if (likeCount == 0) {
            this.stats = { replies: 0, retuits: 0, likes: 0 };
        }
        else {
            this.stats = { replies: 0, retuits: 0, likes: likeCount };
        }
    }
}
exports.default = Tuit;
//# sourceMappingURL=Tuit.js.map