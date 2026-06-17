const { throwAppError, ERROR_CODE } = require('@app-core/errors');
const createRepositoryFactory = require('@app-core/repository-factory');
const CreatorCardMessages = require('@app/messages/creator-card');

const CreatorCardRepository = createRepositoryFactory('CreatorCard');


 // Access rule order (strict):
 // 1. NF01 — card not found (or soft-deleted)
 // 2. AC04 — card is private but no access_code provided
 // 3. AC05 — card is private and wrong access_code provided
 
async function getCreatorCard({ slug, access_code }) {
  const card = await CreatorCardRepository.findOne({ query: { slug } });

  if (!card) {
    throwAppError(
      CreatorCardMessages.CREATOR_CARD_NOT_FOUND(slug),
      ERROR_CODE.NOTFOUND,
    );
  }

  if (card.status !== 'published') {
    throwAppError(
      CreatorCardMessages.CREATOR_CARD_NOT_PUBLISHED(slug),
      ERROR_CODE.NOTFOUND,
    );
  }

  if (card.access_type === 'private') {
    if (!access_code) {
      throwAppError(
        CreatorCardMessages.PRIVATE_ACCESS_CODE_REQUIRED,
        ERROR_CODE.AC03,
      );
    }

    if (access_code !== card.access_code) {
      throwAppError(
        CreatorCardMessages.PRIVATE_ACCESS_CODE_INCORRECT,
        ERROR_CODE.AC04,
      );
    }
  }

  const result = { ...card, id: card._id };
  delete result._id;
  delete result.__v;
  delete result.access_code;
  delete result.deleted;

  return result;
}

module.exports = getCreatorCard;
