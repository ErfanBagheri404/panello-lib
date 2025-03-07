import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  role: string;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>({
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
    default: "/default-avatar.png",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

userSchema.methods.comparePassword = async function (
  this: IUser,
  password: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

// Hash password before saving
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
