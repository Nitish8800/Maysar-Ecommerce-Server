// utils/queryHelpers.ts

import { IUser } from "../types/schema";

/**
 * Builds a match condition for active and accessible users
 * @param {mongoose.Types.ObjectId|string|null} requestingUserId - The ID of the user making the request
 * @returns {Object} Mongoose query conditions
 */
export const buildUserAccessConditions = (
  requestingUserId: IUser["_id"] | null
) => {
  // Base conditions - user must not be deleted or deactivated
  const baseConditions = {
    "deleted.status": false,
    "deactivated.status": false,
  };

  // If we have a requesting user, handle privacy rules
  if (requestingUserId) {
    console.log(
      JSON.stringify(
        {
          ...baseConditions,
          $or: [
            { isAnonymized: false }, // Public profiles are visible to all
            { "followers.list": { $in: [requestingUserId] } }, // Or the requesting user is a follower
          ],
        },
        null,
        2
      ),
      "User Request"
    );
    return {
      ...baseConditions,
      $or: [
        { isAnonymized: false }, // Public profiles are visible to all
        { "followers.list": { $in: [requestingUserId] } }, // Or the requesting user is a follower
      ],
    };
  }
  console.log(
    JSON.stringify(
      {
        ...baseConditions,
        isAnonymized: false,
      },
      null,
      2
    ),
    "Without User Request"
  );
  // For anonymous requests, only show public profiles
  return {
    ...baseConditions,
    isAnonymized: false,
  };
};

/**
 * Creates population options for author fields with privacy controls
 * @param {mongoose.Types.ObjectId|string|null} requestingUserId - The ID of the user making the request
 * @param {string} path - The path to populate (defaults to 'author')
 * @param {string|string[]} select - Fields to select from the populated document
 * @returns {Object} Mongoose population options
 */
export const createSecurePopulateOptions = (
  requestingUserId: IUser["_id"],
  path = "author",
  select: string | string[] = ""
) => {
  console.log(
    JSON.stringify(
      {
        path,
        match: buildUserAccessConditions(requestingUserId),
        select,
      },
      null,
      2
    ),
    "Populate Options"
  );
  return {
    path,
    match: buildUserAccessConditions(requestingUserId),
    select,
  };
};
