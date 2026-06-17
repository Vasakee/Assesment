const { createHandler } = require('@app-core/server');
const { appLogger } = require('@app-core/logger');
const deleteCreatorCardService = require('@app/services/creator-card/delete-creator-card');

module.exports = createHandler({
  path: '/creator-cards/:slug',
  method: 'delete',
  middlewares: [],
  async onResponseEnd(rc, rs) {
    appLogger.info({ requestContext: rc, response: rs }, 'delete-creator-card-completed');
  },
  async handler(rc, helpers) {
    const { slug } = rc.params;

    const response = await deleteCreatorCardService({ slug });

    return {
      status: helpers.http_statuses.HTTP_200_OK,
      data: response,
    };
  },
});
