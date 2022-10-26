import AccountType from "./UserEnums/AccountType";
import MaritalStatus from "./UserEnums/MaritalStatus";
import Location from "./UserEnums/Location";
import mongoose from "mongoose";

export default interface UserInterface {
    userId?: string,
    username: string,
    password: string,
    email: string,
    firstName?: string,
    lastName?: string,
    profilePhoto?: string,
    headerImage?: string,
    biography?: string,
    dateOfBirth?: Date,
    accountType?: AccountType,
    maritalStatus?: MaritalStatus,
    location?: Location,
};