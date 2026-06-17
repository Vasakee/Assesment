const { createHandler } = require('@app-core/server');
const { appLogger } = require('@app-core/logger');
const getCreatorCardService = require('@app/services/creator-card/get-creator-card');

module.exports = createHandler({
  path: '/creator-cards/:slug',
  method: 'get',
  middlewares: [],
  async onResponseEnd(rc, rs) {
    appLogger.info({ requestContext: rc, response: rs }, 'get-creator-card-completed');
  },
  async handler(rc, helpers) {
    const { slug } = rc.params;
    const { access_code } = rc.query;

    const response = await getCreatorCardService({ slug, access_code });

    return {
      status: helpers.http_statuses.HTTP_200_OK,
      data: response,
    };
  },
});
