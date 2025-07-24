/**
 * restaurant router
 */

//import { factories } from '@strapi/strapi';

//export default factories.createCoreRouter('api::restaurant.restaurant');

export default {
    routes: [
        {
            method: 'POST',
            path: '/custom/restaurants',
            handler: 'restaurant.createCustom',
            config: {
                policies: ['single-restaurant-per-vendor']
            }
        },
    ]
}
