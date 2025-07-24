/**
 * restaurant controller
 */
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::restaurant.restaurant', ({ strapi }) => ({
  async createCustom(ctx) {
    const user = ctx.state.user;
    const restaurant = await strapi.documents('api::restaurant.restaurant').create({
        data:{
            ...ctx.request.body.data
        }
    })
    await strapi.documents('plugin::users-permissions.user').update({
        documentId: user.documentId,
        data:{
            restaurant: restaurant.id
        }
    })
    return restaurant;
  },
}));
