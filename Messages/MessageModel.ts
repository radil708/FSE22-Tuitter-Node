import mongoose from "mongoose";
import MessageSchema from "./MessageSchema";

/**
 * This interacts with the Messages Collections
 */
const MessageModel = mongoose.model('MessageModel', MessageSchema)
export default MessageModel