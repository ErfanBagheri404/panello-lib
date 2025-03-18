// models/Role.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IRole extends Document {
  name: string;
  description: string;
  id: string; // Explicitly define id as a string
}

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

// Add a virtual to expose _id as id
roleSchema.virtual("id").get(function (this: IRole) {
  return (this._id as mongoose.Types.ObjectId).toHexString();
});

// Ensure the virtual is included in JSON output
roleSchema.set("toObject", { virtuals: true });
roleSchema.set("toJSON", { virtuals: true });

const Role = mongoose.model<IRole>("Role", roleSchema);
export default Role;