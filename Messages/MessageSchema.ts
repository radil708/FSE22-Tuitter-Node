import mongoose from "mongoose";

/**
 * This defines the format for each entry in the Messages collection
 */
const MessageSchema = new mongoose.Schema({
    content: String,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    privacyStatus: Boolean
}, {collection: "Messages"})

export default MessageSchema