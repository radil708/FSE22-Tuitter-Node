import mongoose from "mongoose";
import PollSchema from "./PollSchema";

/**
 * This is a mongoose model object used specifically to
 * interact with the database using the PollSchema for entry addition,parsing, ..etc
 */
const PollModel = mongoose.model('PollModel',PollSchema);

export default PollModel;