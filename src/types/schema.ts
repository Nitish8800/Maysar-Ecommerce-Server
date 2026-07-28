import { Document, Schema, Types } from "mongoose";

export type Providers = "email" | "google" | "facebook";

export interface IAuthProvider {
  provider: Providers;
  id?: string;
}

export interface IUser extends Document {
  username?: string;
  firstName?: string;
  lastName?: string;
  role: string;
  email: string;
  phone?: number;
  recoveryEmail?: string;
  recoveryPhone?: string;
  dp?: string;
  password?: string;
  provider?: IAuthProvider;
  bio?: string;
  location?: {
    coordinates: {
      lat: string;
      lng: string;
    };
    address: string;
  };
  liveLocation: {
    coordinates: {
      lat: string;
      lng: string;
    };
    address: string;
    updatedAt: Date;
  };
  otp: {
    code: string;
    expiresAt: Date;
  };
  followers: {
    num: number;
    list: IUser[];
  };
  following: {
    num: number;
    list: IUser[];
  };
  likedItems: {
    itemType: "post" | "thought" | "glimps" | "comment";
    itemId: string;
  }[];
  savedItems: {
    itemType: "post" | "thought" | "glimps";
    itemId: string;
  }[];
  streaks: {
    currentStreak: number;
    lastStreakActivity: Date;
  };
  interactionHistory: {
    itemId: string;
    itemType: string;
    interactionType: string;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
  verified: boolean;
  verifyPassword: (password: string) => Promise<boolean>;
  stripeAccountId?: string;
  stripeCustomerId?: string;
  deactivated: {
    status: boolean;
    deactivatedAt: Date;
  };
  deleted: {
    status: boolean;
    deletedAt: Date;
    reason: string;
    detailedReason: string;
  };
  isAnonymized: boolean;
  fcmTokens: string[];
  refreshToken: string;
}

export interface IEmailVerificationToken extends Document {
  user: Schema.Types.ObjectId;
  token: string;
  createdAt: Date;
}
