import mongoose from "mongoose";
import ResponderSchema from "./ResponderSchema";

/**
 * This is a mongoose model object used specifically to
 * interact with the database using the PollSchema for entry addition,parsing, ..etc
 */
const ResponderToPollModel = mongoose.model('ResponderToPollModel',ResponderSchema);

export default ResponderToPollModel;