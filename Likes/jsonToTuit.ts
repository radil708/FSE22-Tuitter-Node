import Tuit from "../Tuits/Tuit";

function jsonToTuit(jsonIn) {
    return new Tuit(jsonIn._id.toString(),
        jsonIn.likedBy._id.toString(),
        jsonIn.likedTuit.tuit,
        jsonIn.likedTuit.postedOn);
}

export default jsonToTuit;