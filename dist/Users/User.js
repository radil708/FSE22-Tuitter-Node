"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AccountType_1 = require("./UserEnums/AccountType");
const MaritalStatus_1 = require("./UserEnums/MaritalStatus");
/**
 * This class represents any user on tuitter. A user has a username, password, firstName
 * lastname...etc
 */
class User {
    /**
     * This is the constructor for the User class
     * @param userIdIn {string} the user id that is created by the Mongo database converted to a string
     * @param userNameIn {string} the userName of the user
     * @param firstNameIn {string} the first name of the user
     * @param lastNameIn {string} the last name of the user
     * @param passwordIn {string} the password of the user
     * @param emailIn {string} the email of the user
     */
    constructor(userIdIn, userNameIn, firstNameIn, lastNameIn, passwordIn, emailIn) {
        this.username = '';
        this.password = '';
        this.firstName = null;
        this.lastName = null;
        this.email = '';
        this.profilePhoto = null;
        this.headerImage = null;
        this.accountType = AccountType_1.default.Personal;
        this.maritalStatus = MaritalStatus_1.default.Single;
        this.biography = null;
        this.dateOfBirth = null;
        this.joined = new Date();
        this.location = null;
        this.userId = "";
        this.userId = userIdIn;
        this.username = userNameIn;
        this.firstName = firstNameIn;
        this.lastName = lastNameIn;
        this.password = passwordIn;
        this.email = emailIn;
    }
    /**
     * Returns the userId attribute of the object as a {string}
     */
    getUserId() {
        return this.userId;
    }
    /**
     * Returns the objects userName attribute as a {string}
     */
    getUserName() {
        return this.username;
    }
    /**
     * Returns the objects firstName attribute as a {string}
     */
    getFirstName() {
        let retVal = '';
        if (this.firstName != null) {
            retVal = this.firstName;
        }
        return retVal;
    }
    /**
     * Returns the objects password attribute as a {string}
     */
    getPassword() {
        return this.password;
    }
    /**
     * Returns the objects email attribute as a {string}
     */
    getEmail() {
        return this.email;
    }
    /**
     * Returns the objects lastName attribute as a {string}
     */
    getLastName() {
        let retVal = '';
        if (this.lastName != null) {
            retVal = this.lastName;
        }
        return retVal;
    }
    setPassword(passwordIn) {
        this.password = passwordIn;
    }
}
exports.default = User;
//# sourceMappingURL=User.js.map