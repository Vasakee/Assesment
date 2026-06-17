const { ModelSchema, SchemaTypes, DatabaseModel } = require('@app-core/mongoose');

const modelName = 'creator-cards';

const schemaConfig = {
  _id: { type: SchemaTypes.ULID, required: true },
  title: { type: SchemaTypes.String, required: true },
  slug: { type: SchemaTypes.String, required: true },
  description: { type: SchemaTypes.String },
  creator_reference: { type: SchemaTypes.String },
  bio: { type: SchemaTypes.String },
  services: { type: SchemaTypes.Array },
  links: { type: SchemaTypes.Array },
  service_rates: { type: SchemaTypes.Mixed },
  access_type: { type: SchemaTypes.String, required: true, default: 'public' },
  access_code: { type: SchemaTypes.String },
  status: { type: SchemaTypes.String, required: true, default: 'published' },
  created: { type: SchemaTypes.Number, required: true },
  updated: { type: SchemaTypes.Number, required: true },
};

const modelSchema = new ModelSchema(schemaConfig, { collection: modelName });
modelSchema.index({ slug: 1 }, { unique: true });

module.exports = DatabaseModel.model(modelName, modelSchema, { paranoid: true });
