
export default {
    routes: [
      {
        method: 'PATCH',
        path: '/menu-items/:id',
        handler: 'menu-item.update',
        config: {
          policies: ['owner']
        }
      },
      {
        method: 'DELETE',
        path: '/menu-items/:id',
        handler: 'menu-item.delete',
        config: {
          policies: ['owner']
        }
      },
      {
        method: 'POST',
        path: '/menu-items',
        handler: 'menu-item.create',
        config: {
          policies: ['restaurant']
        }
      },
      {
        method: 'GET',
        path: '/menu-items/vendor',
        handler: 'menu-item.findVendor',
        config: {
          auth: {
            scope: ['plugin::users-permissions.user.read']
          }
        },
      },
    ]
  }