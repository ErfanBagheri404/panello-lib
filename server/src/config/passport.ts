
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User, { IUser } from "../models/User";
import { CallbackError } from "mongoose";

export const configurePassport = () => {

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {

      if (!profile.emails?.[0]?.value) {
        return done(new Error("Google account has no email"));
      }
  

      const email = profile.emails[0].value;
      const nameParts = profile.displayName?.split(' ') || ['User', ''];
      
      const userData = {
        googleId: profile.id,
        email,
        firstName: profile.name?.givenName || nameParts[0],
        lastName: profile.name?.familyName || nameParts.slice(1).join(' ') || 'User',
        avatar: profile.photos?.[0]?.value || '/default-avatar.png'
      };
  

      const user = await User.findOneAndUpdate(
        { $or: [{ googleId: profile.id }, { email }] },
        { $setOnInsert: userData },
        { upsert: true, new: true }
      );
  
      done(null, user);
    } catch (error) {
      done(error as Error);
    }
  }));


  passport.serializeUser((user: Express.User, done) => {
    done(null, (user as IUser)._id);
  });


  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await User.findById(id);
      done(null, user as IUser | null);
    } catch (error) {
      done(error as CallbackError);
    }
  });
};