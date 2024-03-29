import mongoose from "mongoose";


/**
 * This is the TuitSchema. This will match the format of every entry
 * in the 'Tuits' collection from the database
 */
const TuitSchema = new mongoose.Schema({
    tuit: {type: String, required: true},
    postedOn: Date,
    // This stores reference to something that lives
    // in another collection
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'},
    stats: {
        replies: {type: Number, default: 0},
        retuits: {type: Number, default: 0},
        likes: {type: Number, default: 0}
    }
}, {collection: "Tuits"});
export default TuitSchema;