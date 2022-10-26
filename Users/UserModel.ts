import mongoose from "mongoose";
import UserSchema from "./UserSchema";

/**
 * This is a mongoose model object used specifically to interact
 * with the database using the UsersSchema for entry addition,parsing, ..etc
 */
const UserModel = mongoose.model('UserModel', UserSchema);
export default UserModel;