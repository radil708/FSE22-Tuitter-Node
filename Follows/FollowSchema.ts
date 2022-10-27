import mongoose from "mongoose";

const FollowSchema = new mongoose.Schema({
    userFollowed : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    userFollowing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    }
}, {collection: 'Follows'})

export default FollowSchema