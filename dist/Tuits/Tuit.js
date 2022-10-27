"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../Users/User");
/*
this class represent a tuit/tweet. It uses the User class as an attribute.
 */
class Tuit {
    constructor(tuitIdIn, userIdIn, contentIn, postedOnIn, userIn = null) {
        this.tuitID = '';
        this.userId = '';
        this.tuitContent = '';
        this.postedOn = new Date();
        this.tuitID = tuitIdIn;
        this.userId = userIdIn;
        this.tuitContent = contentIn;
        this.postedOn = postedOnIn;
        this.postedBy = userIn;
    }
    getTuitId() {
        return this.tuitID;
    }
    getUserId() {
        return this.userId;
    }
    getContent() {
        return this.tuitContent;
    }
    setUser(userIn) {
        this.postedBy = new User_1.default(userIn.getUserId(), userIn.getUserName(), userIn.getFirstName(), userIn.getLastName(), userIn.getPassword(), userIn.getEmail());
    }
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
    getDate() {
        return this.postedOn;
    }
    getUserID() {
        return this.userId;
    }
}
exports.default = Tuit;
//# sourceMappingURL=Tuit.js.map