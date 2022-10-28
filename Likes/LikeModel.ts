import mongoose from "mongoose";
import LikeSchema from "./LikeSchema";

/**
 * This model interacts with the database in regards to the Likes collection
 */
const LikeModel = mongoose.model('LikeModel', LikeSchema);

export default LikeModel;