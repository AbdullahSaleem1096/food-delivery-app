import type { Schema, Struct } from '@strapi/strapi';

export interface AddressAddress extends Struct.ComponentSchema {
  collectionName: 'components_address_addresses';
  info: {
    displayName: 'address-info';
    icon: 'car';
  };
  attributes: {
    city: Schema.Attribute.Enumeration<
      ['Lahore', 'Faisalabad', 'Islamabad', 'Multan', 'Peshawar', 'Karachi']
    > &
      Schema.Attribute.Required;
    street: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContactContactInfo extends Struct.ComponentSchema {
  collectionName: 'components_contact_contact_infos';
  info: {
    displayName: 'contact-info';
    icon: 'phone';
  };
  attributes: {
    email: Schema.Attribute.Email;
    phone: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'address.address': AddressAddress;
      'contact.contact-info': ContactContactInfo;
    }
  }
}
