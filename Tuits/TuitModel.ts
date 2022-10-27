import mongoose from "mongoose";
import TuitSchema from "./TuitSchema";

/**
 * This is a mongoose model object used specifically to
 * interact with the database using the TuitSchema for entry addition,parsing, ..etc
 */
const TuitModel = mongoose.model('TuitModel',TuitSchema);

export default TuitModel;