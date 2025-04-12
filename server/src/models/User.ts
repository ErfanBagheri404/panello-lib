import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../types/express";


const userSchema = new Schema<IUser>(
  {
    googleId: { type: String, unique: true, sparse: true },
    firstName: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    lastName: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/draufvx5a/image/upload/v1743061072/syy0koyk8gymiuyql07h.jpg",
    },
    role: {
      type: String,
      enum: ["owner", "co-owner", "administrator", "moderator", "member"],
      default: "member",
    },
    isInvited: {
      type: Boolean,
      default: false,
    },
    accountState: {
      type: String,
      enum: ["Active", "Deactivated"],
      default: "Active",
    },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (
  this: IUser,
  password: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error as Error);
  }
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
