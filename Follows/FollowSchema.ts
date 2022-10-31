import mongoose from "mongoose";

/**
 * Defines what each entry in the Follows collection looks like
 */
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