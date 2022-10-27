import AccountType from "./UserEnums/AccountType";
import Location from "./UserEnums/Location";
import MaritalStatus from "./UserEnums/MaritalStatus";

/**
 * This is a User class utilized at the application level. It represents any user on tuitter.
 * A user has a username, password, firstName, lastName, email, accountType
 * maritalStatus, and location at minimum.
 * A User also has optional attributes like profilePhoto and headerImage.
 * By default, a user's accountType is Personal and maritalStatus is Single.
 */
export default interface User {
    username?: string,
    password: string,
    firstName?: string,
    lastName?: string,
    email: string,
    profilePhoto?: string,
    headerImage?: string,
    accountType?: AccountType,
    maritalStatus?: MaritalStatus,
    biography?: string,
    dateOfBirth?: Date,
    joined?: Date,
    location?: Location,
    userId?: string

}

