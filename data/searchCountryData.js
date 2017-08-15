import searchCountryData from "./search_country_data.json";
import I18n from "../js/I18n";

for ( let index = 0; index < searchCountryData.length; index++ ) {
    searchCountryData[ index ].name = I18n.t( 'country.' + searchCountryData[ index ].code + '.value' );
}

export default searchCountryData;