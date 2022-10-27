// import classes that the User class is composed of
import AccountType from "./UserEnums/AccountType";
import MaritalStatus from "./UserEnums/MaritalStatus";
import Location from "./UserEnums/Location";
/*
The User class represents a user class on Tuiter. It uses the enums: AccountType and
Marital status. It also uses a Location object as part of its attributes.
 */

/**
 * This class represents any user on tuitter. A user has a username, password, firstName
 * lastname...etc
 */
export default class User {
    private username: string = '';
    private password: string = '';
    private firstName: string | null = null;
    private lastName: string | null = null;
    private email: string = '';
    private profilePhoto: string | null = null;
    private headerImage: string | null = null;
    private accountType: AccountType = AccountType.Personal;
    private maritalStatus: MaritalStatus = MaritalStatus.Single;
    private biography: string | null = null;
    private dateOfBirth: Date | null = null;
    private joined: Date = new Date();
    private location: Location | null = null;
    private userId: string = "";

    /**
     * This is the constructor for the User class
     * @param userIdIn {string} the user id that is created by the Mongo database converted to a string
     * @param userNameIn {string} the userName of the user
     * @param firstNameIn {string} the first name of the user
     * @param lastNameIn {string} the last name of the user
     * @param passwordIn {string} the password of the user
     * @param emailIn {string} the email of the user
     */
    constructor(userIdIn: string, userNameIn: string, firstNameIn: string, lastNameIn: string, passwordIn : string,
                emailIn: string) {
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
    public getUserId(): string {
        return this.userId;
    }

    /**
     * Returns the objects userName attribute as a {string}
     */
    getUserName(): string {
        return this.username;
    }

    /**
     * Returns the objects firstName attribute as a {string}
     */
    getFirstName(): string {
        let retVal = '';
        if (this.firstName != null) {
            retVal = this.firstName;
        }
        return retVal;
    }

    /**
     * Returns the objects password attribute as a {string}
     */
    getPassword(): string {
        return this.password;
    }

    /**
     * Returns the objects email attribute as a {string}
     */
    getEmail(): string {
        return this.email;
    }

    /**
     * Returns the objects lastName attribute as a {string}
     */
    getLastName(): string {
        let retVal = '';
        if (this.lastName != null) {
            retVal = this.lastName;
        }
        return retVal;
    }

}

