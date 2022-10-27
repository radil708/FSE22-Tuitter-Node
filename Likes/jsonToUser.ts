import Tuit from "../Tuits/Tuit";
import User from "../Users/User";
import mongoose from "mongoose";

function jsonToUser(userFromDb) {
    return new User(
        userFromDb._id.toString() || '',
        userFromDb['username'] || '',
        userFromDb['firstName'] || '',
        userFromDb['lastName'] || '',
        userFromDb['password'] || '',
        userFromDb['email'] || '')
}

export default jsonToUser;