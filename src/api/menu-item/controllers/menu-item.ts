import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::menu-item.menu-item', ({ strapi }) => ({
  async findVendor(ctx) {
    const { data, meta } = await super.find(ctx);
    const user = ctx.state.user;

    const restaurant = await strapi.documents('api::restaurant.restaurant').findMany({
        filters:{
            user: user.id
        }
    })
    const restaurantId = restaurant[0].id;

    const filteredData = data.filter(item => {
        return item.attributes.restaurant?.data?.id === restaurantId;
    });

    return { data: filteredData, meta: { total: filteredData.length }};
}
}));
