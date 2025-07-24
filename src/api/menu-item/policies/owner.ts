// export default async(policyContext, config, { strapi }) => {

//     if (policyContext.state.user.role.name === 'vendor') {
//         const menu_item_id = policyContext.request.params.id;
//         const requested_user = policyContext.state.user;


//         const restaurant = await strapi.documents('api::restaurant.restaurant').findOne({
//             menu_items : menu_item_id
//         })

//         if(restaurant.user === requested_user){
//             return true;
//         }

//       // Go to next policy or will reach the controller's action.
//       return false;
//     }
//     return false;
// };

import {errors} from '@strapi/utils';
const {PolicyError} = errors;
export default async (policyContext, config, { strapi }) => {
    const user = policyContext.state.user;
  
    // Allow admins
    if (user.role.name === 'Administrator') return true;
  
    // Only vendors allowed below
    if (user.role.name !== 'vendor'){
        throw new errors.PolicyError('Only vendors are allowed for this action',{
            policy: 'owner',
            role: user?.role?.name || 'unknown'
        })
    };
  
    const menuItemId = policyContext.request.params.id;
  
    // Find restaurant that owns this menu item
    const restaurant = await strapi.documents('api::restaurant.restaurant').findOne({
      where: {
        user: user.id,
        menu_items: {
          id: menuItemId,
        },
      },
      populate: ['menu_items'],
    });
  
    // Allow only if the menu item is in vendor's restaurant
    if (restaurant) return true;
  
    throw new errors.PolicyError('You are not the owner of this menu-item',{
        policy:'owner',
        action: policyContext.request?.method || 'unknown'
    })
};