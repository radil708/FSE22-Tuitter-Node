import mongoose from "mongoose";
import MaritalStatus from "./UserEnums/MaritalStatus";
import AccountType from "./UserEnums/AccountType";
import Location from "./UserEnums/Location";

/**
 * This is the UsersSchema. This will match the format of every entry
 * in the 'Tuits' collection from the database and has default values
 * set where necessary
 */
const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    firstName: String,
    lastName: String,
    email: String,
    profilePhoto: String,
    headerImage: String,
    accountType: {type: String, default: 'PERSONAL', enum: ['PERSONAL', 'ACADEMIC', 'PROFESSIONAL']},
    maritalStatus: {type: String, default: 'SINGLE', enum: ['MARRIED', 'SINGLE', 'WIDOWED']},
    biography: String,
    dateOfBirth: Date,
    joined: {type: Date, default: Date.now},
    location: {
        latitude: {type: Number, default: 0.0},
        longitude: {type: Number, default: 0.0},
    }
    },
    {collection: 'Users'});

export default UserSchema;