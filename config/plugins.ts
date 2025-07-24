import { register } from "module";

export default ({env}) => ({
    "user-permissions":{
        config:{
            register:{
                allowedFeilds:["orders","reviews","address","restaurant","role"],
            },
            update:{
                allowedFeilds:["orders","reviews","address","role"],
            }
        }
    }
});