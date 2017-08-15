import countryDataJson from "./country_data";
import I18n from "../js/I18n";

const countryDataMap = {};

for ( let index = 0; index < countryDataJson.length; index++ ) {
    countryDataJson[ index ].name = I18n.t( 'country.' + countryDataJson[ index ].CountryISOCode + '.value' );
    countryDataJson[ index ].currency_name = I18n.t( 'country.' + countryDataJson[ index ].CountryISOCode + '.currency_name' );

    const sort = I18n.t( 'country.' + countryDataJson[ index ].CountryISOCode + '.sort' );
    countryDataJson[ index ].sort = sort ? sort.toUpperCase() : countryDataJson[ index ].name.toUpperCase();

    countryDataMap[ countryDataJson[ index ].CountryISOCode ] = countryDataJson[ index ];
}

export default countryDataMap;