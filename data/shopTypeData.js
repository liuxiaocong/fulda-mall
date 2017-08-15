import shopTypeData from "./shop_type_data.json";
import I18n from "../js/I18n";

for ( let index = 0; index < shopTypeData.length; index++ ) {
    shopTypeData[ index ].name = I18n.t( '' + shopTypeData[ index ].code, { scope: 'shop_type_data.child' } );
}

export default shopTypeData;