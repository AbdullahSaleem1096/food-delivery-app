export default{
    async register(ctx) {
        const pluginStore = await strapi.store({ type: 'plugin', name: 'users-permissions' });
    
        const settings = await pluginStore.get({ key: 'advanced' });
    
        if (!settings.allow_register) {
          throw new ApplicationError('Register action is currently disabled');
        }
    
        const { register } = strapi.config.get('plugin.users-permissions');
        const alwaysAllowedKeys = ['username', 'password', 'email','role'];
        const userModel = strapi.contentTypes['plugin::users-permissions.user'];
        const { attributes } = userModel;
        console.log("hello i have reached the conrollers")
    
        const nonWritable = getNonWritableAttributes(userModel);
    
        const allowedKeys = compact(
          concat(
            alwaysAllowedKeys,
            isArray(register?.allowedFields)
              ? // Note that we do not filter allowedFields in case a user explicitly chooses to allow a private or otherwise omitted field on registration
                register.allowedFields // if null or undefined, compact will remove it
              : // to prevent breaking changes, if allowedFields is not set in config, we only remove private and known dangerous user schema fields
                // TODO V5: allowedFields defaults to [] when undefined and remove this case
                Object.keys(attributes).filter(
                  (key) =>
                    !nonWritable.includes(key) &&
                    !attributes[key].private &&
                    ![
                      // many of these are included in nonWritable, but we'll list them again to be safe and since we're removing this code in v5 anyway
                      // Strapi user schema fields
                      'confirmed',
                      'blocked',
                      'confirmationToken',
                      'resetPasswordToken',
                      'provider',
                      'id',
                      'role',
                      // other Strapi fields that might be added
                      'createdAt',
                      'updatedAt',
                      'createdBy',
                      'updatedBy',
                      'publishedAt', // d&p
                      'strapi_reviewWorkflows_stage', // review workflows
                    ].includes(key)
                )
          )
        );
    
        const params = {
          ..._.pick(ctx.request.body, allowedKeys),
          provider: 'local',
        };
    
        await validateRegisterBody(params);

        let role;
        role = await strapi.query('plugin::users-permissions.role').findOne({
            where: {
                name: params.role
            }
        })

        if(!role){
            role = await strapi.query('plugin::users-permissions.role').findOne({
                where:{
                    type:settings.default_role
                }
            })
        }

    
        const { email, username, provider } = params;
    
        const identifierFilter = {
          $or: [
            { email: email.toLowerCase() },
            { username: email.toLowerCase() },
            { username },
            { email: username },
          ],
        };
    
        const conflictingUserCount = await strapi.query('plugin::users-permissions.user').count({
          where: { ...identifierFilter, provider },
        });
    
        if (conflictingUserCount > 0) {
          throw new ApplicationError('Email or Username are already taken');
        }
    
        if (settings.unique_email) {
          const conflictingUserCount = await strapi.query('plugin::users-permissions.user').count({
            where: { ...identifierFilter },
          });
    
          if (conflictingUserCount > 0) {
            throw new ApplicationError('Email or Username are already taken');
          }
        }
    
    
    // YOU WOULD DO SOME LOGIC HERE AND YOU CAN PASS IT TO THE newUser object
    
    
        const newUser = {
          ...params,
          role: role.id,
          email: email.toLowerCase(),
          username,
          confirmed: !settings.email_confirmation,
        };
    
        const user = await getService('user').add(newUser);
    
        const sanitizedUser = await sanitizeUser(user, ctx);
    
        if (settings.email_confirmation) {
          try {
            await getService('user').sendConfirmationEmail(sanitizedUser);
          } catch (err) {
            throw new ApplicationError(err.message);
          }
    
          return ctx.send({ user: sanitizedUser });
        }
    
        const jwt = getService('jwt').issue(_.pick(user, ['id']));
    
        return ctx.send({
          jwt,
          user: sanitizedUser,
        });
    }
}