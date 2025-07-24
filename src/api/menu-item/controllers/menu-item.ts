// // import { factories } from '@strapi/strapi';

// // export default factories.createCoreController('api::menu-item.menu-item', ({ strapi }) => ({
// //   async findVendor(ctx) {
// //     const user = ctx.state.user;

// //     const restaurant = await strapi.documents('api::restaurant.restaurant').findMany({
// //         filters:{
// //             user: user.id
// //         },
// //         populate:['menu_items']
// //     })

// //     return restaurant[0].menu_items;
// // }
// // }));

// import { factories } from '@strapi/strapi';
// import restaurant from '../policies/restaurant';

// export default factories.createCoreController('api::menu-item.menu-item', ({ strapi }) => ({
//   async findVendor(ctx) {
//     const user = ctx.state.user;

//     try{
//         const restaurant = await strapi.documents('api::restaurant.restaurant').findMany({
//             filters:{
//                 user: user.id,
//             },
//             populate:['menu_items'],
//         })
//     }
//     catch(err){
//         ctx.body = err;
//     }

//     if(restaurant){
//         ctx.response.body = restaurant[0].menu_items;
//     }},

//     async exampleAction(ctx) {
//         try {
//         ctx.body = 'ok';
//         } catch (err) {
//         ctx.body = err;
//         }
//     },
// }));
import { factories } from '@strapi/strapi';
export default factories.createCoreController('api::menu-item.menu-item', ({ strapi }) => ({
    async findVendor(ctx) {
      const user = ctx.state.user;
      console.log('User from ctx.state:', user);
  
      let restaurant;
  
      try {
        console.log('Fetching restaurant for user ID:', user.id);
  
        restaurant = await strapi.entityService.findMany('api::restaurant.restaurant', {
          filters: {
            user: user.id,
          },
          populate: ['menu_items'],
        });
  
        console.log('Fetched restaurant:', restaurant);
      } catch (err) {
        console.error('Error while fetching restaurant:', err);
        ctx.status = 500;
        ctx.body = { message: 'Internal server error while fetching restaurant' };
        return;
      }
  
      if (!restaurant || restaurant.length === 0) {
        console.warn('No restaurant found for this user.');
        ctx.status = 404;
        ctx.body = { message: 'No restaurant found for this user' };
        return;
      }
  
      const menuItems = restaurant[0].menu_items;
  
      console.log('Returning menu items:', menuItems);
  
      ctx.send({ data: menuItems });
    },
    async exampleAction(ctx) {
        try {
        ctx.body = 'ok';
        } catch (err) {
        ctx.body = err;
        }
    },
  }));
  
