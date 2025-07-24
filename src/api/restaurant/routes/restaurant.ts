/**
 * restaurant router
 */

//import { factories } from '@strapi/strapi';

//export default factories.createCoreRouter('api::restaurant.restaurant');

export default {
    routes: [
        {
            method: 'POST',
            path: '/restaurants',
            handler: 'restaurant.create',
            config: {
                policies: ['single-restaurant-per-vendor']
            }
        },
    ]
}
