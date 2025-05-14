import mongoose from "mongoose";

const collection = "ticket";

const schema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  purchase_datetime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    ref: "users",
    required: true,
  },
});

export default mongoose.model(collection, schema);
