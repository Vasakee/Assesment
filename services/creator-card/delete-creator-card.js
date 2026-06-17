const { throwAppError, ERROR_CODE } = require('@app-core/errors');
const createRepositoryFactory = require('@app-core/repository-factory');
const CreatorCardMessages = require('@app/messages/creator-card');

const CreatorCardRepository = createRepositoryFactory('CreatorCard');

async function deleteCreatorCard({ slug }) {
  const card = await CreatorCardRepository.findOne({ query: { slug } });

  if (!card) {
    throwAppError(
      CreatorCardMessages.CREATOR_CARD_NOT_FOUND(slug),
      ERROR_CODE.NOTFOUND,
    );
  }

  await CreatorCardRepository.deleteOne({ query: { slug } });

  const result = { ...card, id: card._id, deleted: Date.now() };
  delete result._id;
  delete result.__v;
  delete result.access_code;

  return result;
}

module.exports = deleteCreatorCard;
