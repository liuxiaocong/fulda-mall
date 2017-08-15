import currencyTypes from "./currency_type";
import countryDataMap from "./countryDataMap";

for ( let index = 0; index < currencyTypes.length; index++ ) {
    const country = countryDataMap[ currencyTypes[ index ].countryCode ];

    currencyTypes[ index ].name = country.currency_name;
    currencyTypes[ index ].symbol = country.symbol;
    currencyTypes[ index ].code = country.currency_code;
}

export default currencyTypes;