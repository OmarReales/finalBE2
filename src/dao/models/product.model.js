import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "products";
const schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: String,
  code: { type: String, required: true, unique: true },
  stock: { type: Number, required: true },
  category: String,
  status: { type: Boolean, default: true },
  owner: { type: String, default: "admin" },
});

schema.plugin(mongoosePaginate);

export default mongoose.model(collection, schema);
