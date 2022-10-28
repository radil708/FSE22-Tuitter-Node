import mongoose from "mongoose";

/**
 * This schema represents how each entry in the Likes collection
 * of the database will be formatted. It contains references
 * to Tuits and Users.
 */
const LikeSchema = new mongoose.Schema({
    likedTuit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TuitModel'
    },
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    }
}, {collection: "Likes"});

export default LikeSchema;