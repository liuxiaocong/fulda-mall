import sortingFieldData from "./sorting_field_data.json";
import I18n from "../js/I18n";

for ( let index = 0; index < sortingFieldData.length; index++ ) {
    sortingFieldData[ index ].name = I18n.t( '' + sortingFieldData[ index ].code, { scope: 'sorting_field_data.child' } );
}

export default sortingFieldData;