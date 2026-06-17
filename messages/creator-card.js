const CreatorCardMessages = {
  SLUG_ALREADY_EXISTS: (slug) => `Creator card with slug "${slug}" already exists.`,
  INVALID_SLUG: 'Title or slug must contain at least one valid character for slug generation.',
  PRIVATE_CREATOR_CARD_REQUIRES_ACCESS_CODE: 'Private creator cards require an access_code.',
  PUBLIC_CREATOR_CARD_FORBIDS_ACCESS_CODE: 'Public creator cards cannot have an access_code.',
  INVALID_ACCESS_TYPE: 'access_type must be either "public" or "private".',
  CREATOR_CARD_NOT_FOUND: (slug) => `Creator card with slug "${slug}" was not found.`,
  CREATOR_CARD_NOT_PUBLISHED: (slug) => `Creator card with slug "${slug}" was not found.`,
  PRIVATE_ACCESS_CODE_REQUIRED: 'This creator card is private. An access_code is required.',
  PRIVATE_ACCESS_CODE_INCORRECT: 'The provided access_code is incorrect.',
};

module.exports = CreatorCardMessages;
