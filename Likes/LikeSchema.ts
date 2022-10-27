import mongoose from "mongoose";

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