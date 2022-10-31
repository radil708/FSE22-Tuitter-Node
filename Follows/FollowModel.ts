import mongoose from "mongoose";
import FollowSchema from "./FollowSchema";

/**
 * The mongoose model used to interact with the database
 */
const FollowModel = mongoose.model('FollowModel', FollowSchema);

export default FollowModel;