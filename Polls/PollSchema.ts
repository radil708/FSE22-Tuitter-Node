import mongoose from "mongoose";


/**
 * This is the PollSchema. This will match the format of every entry
 * in the 'Polls' collection from the database
 */
const PollSchema = new mongoose.Schema({
  question: {type: String, required: true},
  options: {type: Array<String>},
  optionCount: {type: Array<number>},
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel'}
}, {collection: "Polls"});
export default PollSchema;