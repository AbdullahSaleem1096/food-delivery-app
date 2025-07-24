import {errors, policy} from '@strapi/utils';
const {PolicyError} = errors;

export default async (policyContext, config, {starpi})=>{
    const user = policyContext.state.user;
    const restaurant = await strapi.documents('api::restaurant.restaurant').findMany({
        filters: {
            user: user.id
        }
    })
    if(restaurant.length > 0){
        throw new PolicyError('You cannot have more than one restaurant',{
            policy: 'single-restaurant-per-vendor',
            attemptedAt: new Date().toISOString()
        })
    }
    return true;
}