import Tuit from "../Tuits/Tuit";
import User from "../Users/User";

function jsonToUser(jsonIn) {
    return new User(jsonIn._id.toString(),
        jsonIn.username,
        jsonIn.firstName,
        jsonIn.lastName,
        '',
        jsonIn.email);
}

export default jsonToUser;