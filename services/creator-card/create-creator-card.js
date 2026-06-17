const { throwAppError, ERROR_CODE } = require('@app-core/errors');
const { ulid } = require('@app-core/randomness');
const createRepositoryFactory = require('@app-core/repository-factory');
const validator = require('@app-core/validator');
const CreatorCardMessages = require('@app/messages/creator-card');

const CreatorCardRepository = createRepositoryFactory('CreatorCard');

// VSL spec for creating a creator card
const createSpec = `root {
  title string
  description? string
  bio? string
  slug? string
  creator_reference? string
  links[]? {
    title string
    url string
  }
  service_rates? {
    currency string
    rates[] {
      name string
      description? string
      amount number
    }
  }
  status? string(published|draft)
  services[]? any
  access_type? string(public|private)
  access_code? string
}`;

const parsedSpec = validator.parse(createSpec);


// Normalizes a string from a title or slug into a clean URL-friendly slug.
function generateSlug(value) {
  const normalized = String(value || '').toLowerCase().trim();
  let filtered = '';

  for (let index = 0; index < normalized.length; index += 1) {
    const character = normalized[index];
    if (
      (character >= 'a' && character <= 'z') ||
      (character >= '0' && character <= '9') ||
      character === ' ' ||
      character === '-'
    ) {
      filtered += character;
    }
  }

  const collapsedSpaces = filtered
    .split(' ')
    .filter((segment) => segment.length > 0)
    .join('-');

  const collapsedHyphens = collapsedSpaces
    .split('-')
    .filter((segment) => segment.length > 0)
    .join('-');

  return collapsedHyphens;
}

// To ensure that every slug is unique — we optionally reject an explicit duplicate slug
async function ensureUniqueSlug(baseSlug, rejectIfDuplicate = false) {
  const existing = await CreatorCardRepository.findOne({ query: { slug: baseSlug } });
  if (!existing) return baseSlug;
  if (rejectIfDuplicate) {
    throwAppError(
      CreatorCardMessages.SLUG_ALREADY_EXISTS(baseSlug),
      ERROR_CODE.DUPLRCRD,
    );
  }

  const suffix = ulid().slice(-6).toLowerCase();
  return `${baseSlug}-${suffix}`;
}

async function createCreatorCard(serviceData) {
  const validatedData = validator.validate(serviceData, parsedSpec);

  const {
    title,
    description,
    bio,
    slug: rawSlug,
    creator_reference,
    links,
    service_rates,
    status = 'published',
    services,
    access_type = 'public',
    access_code,
  } = validatedData;

  // Preferrably a client-provided slug, otherwise we derive one from the title, 
  // and if none of them contain valid characters, we throw an error. 
  // This ensures that every card has a slug, which is essential for retrieval and URL structure.
  const baseSlug = generateSlug(rawSlug || title);
  if (!baseSlug) {
    throwAppError(CreatorCardMessages.INVALID_SLUG, ERROR_CODE.INVLDDATA);
  }

  const slug = await ensureUniqueSlug(baseSlug, Boolean(rawSlug));

  if (access_type === 'private' && !access_code) {
    throwAppError(
      CreatorCardMessages.PRIVATE_CREATOR_CARD_REQUIRES_ACCESS_CODE,
      ERROR_CODE.AC03,
    );
  }

  if (access_type === 'public' && typeof access_code !== 'undefined') {
    throwAppError(
      CreatorCardMessages.PUBLIC_CREATOR_CARD_FORBIDS_ACCESS_CODE,
      ERROR_CODE.AC05,
    );
  }

  if (!['public', 'private'].includes(access_type)) {
    throwAppError(CreatorCardMessages.INVALID_ACCESS_TYPE, ERROR_CODE.AC05);
  }

  const cardData = {
    title,
    description,
    bio,
    slug,
    creator_reference,
    links,
    service_rates,
    status,
    services: services || [],
    access_type,
    access_code: access_type === 'private' ? access_code : undefined,
  };

  const created = await CreatorCardRepository.create(cardData);

  const result = { ...created, id: created._id };
  delete result._id;
  delete result.__v;

  return result;
}

module.exports = createCreatorCard;
