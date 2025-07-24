import {errors} from '@strapi/utils';
const {PolicyError} = errors;

export default async (policyContext, config, { strapi }) => {
    const user = policyContext.state.user;
    if(user.role.name === 'Administrator') return true;
    if(user.role.name !== 'Vendor'){
        throw new PolicyError('Access denied: Only Vendors are allowed',{
            policy:'restaurant',
            role: user?.role?.name || 'unknown',
            attemptedAt: new Date().toISOString()
        })
    };
    const restaurant = await strapi.documents('api::restaurant.restaurant').findMany({
        filters: {
            user: user.id
        }
    })
    if(restaurant){
        return true;
    }
    throw new PolicyError('You must have a restaurant first',{
        policy:'restaurant',
        restaurantExists: false,
        attemptedAt: new Date().toISOString()
    });
}