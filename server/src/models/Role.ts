
import mongoose, { Document, Schema } from "mongoose";
import { IRole } from "../types/express";


const roleSchema = new Schema<IRole>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
});


roleSchema.virtual("id").get(function (this: IRole) {
  return (this._id as mongoose.Types.ObjectId).toHexString();
});


roleSchema.set("toObject", { virtuals: true });
roleSchema.set("toJSON", { virtuals: true });

const Role = mongoose.model<IRole>("Role", roleSchema);
export default Role;