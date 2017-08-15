import creditcardutils from "creditcardutils";
import I18n from "../I18n";
import Keys from "../configs/Keys";

const CreditCardUtil = {
    calcCreditCardType: function ( sText ) {
        const formatCardNo = creditcardutils.formatCardNumber( sText );
        const parseCardType = creditcardutils.parseCardType( formatCardNo );


        if ( parseCardType === 'visa' ) {
            return 'V';
        } else if ( parseCardType === 'mastercard' ) {
            return 'M';
        } else {
            return '';
        }
    },

    calcCreditCardIcon: function ( cardType ) {
        if ( cardType === 'V' ) {
            //noinspection JSCheckFunctionSignatures
            return require( '../imgs/credit_card_visa.png' );
        } else if ( cardType === 'M' ) {
            //noinspection JSCheckFunctionSignatures
            return require( '../imgs/credit_card_master.png' );
        } else {
            //noinspection JSCheckFunctionSignatures
            return require( '../imgs/credit_card.png' );
        }
    },

    calcCreditCardLogo: function ( cardType ) {
        const height = 30;
        if ( cardType === 'V' ) {
            //noinspection JSCheckFunctionSignatures
            return {
                resource: require( '../imgs/ic_visa.png' ),
                width: height / 81 * 250,
                height: height,
            };
        } else if ( cardType === 'M' ) {
            //noinspection JSCheckFunctionSignatures
            return {
                resource: require( '../imgs/ic_master_card.png' ),
                width: height / 81 * 135,
                height: height,
            };
        } else {
            //noinspection JSCheckFunctionSignatures
            return {
                resource: require( '../imgs/credit_card.png' ),
                width: height / 256 * 256,
                height: height,
            };
        }
    },

    calcCreditCardTitle: function ( sText ) {
        const formatCardNo = creditcardutils.formatCardNumber( sText );
        const parseCardType = creditcardutils.parseCardType( formatCardNo );

        if ( parseCardType === 'visa' ) {
            return I18n.t( Keys.visa_title );
        } else if ( parseCardType === 'mastercard' ) {
            return I18n.t( Keys.master_card_title );
        } else {
            return I18n.t( Keys.credit_card_title );
        }
    },

    validateCardNumber: function ( text ) {
        let formatCardNo = this.formatCreditCardNoWithoutSpace( text );

        formatCardNo = creditcardutils.formatCardNumber( formatCardNo );
        //
        // return creditcardutils.validateCardNumber( formatCardNo );

        return (this.formatCreditCardNoWithoutSpace( formatCardNo ).length === 16);
    },

    validateCardExpiry: function ( text ) {
        if ( !text ) {
            return false;
        }

        const parseCardExpiry = creditcardutils.parseCardExpiry( text );
        if ( !parseCardExpiry || !parseCardExpiry.month || !parseCardExpiry.year ) {
            return false;
        }

        return creditcardutils.validateCardExpiry( '' + parseCardExpiry.month, '' + parseCardExpiry.year );
    },

    validateCardCVC: function ( text ) {
        return creditcardutils.validateCardCVC( text );
    },

    formatCreditCardNoLastFour: function ( text ) {
        const formatCardNo = this.formatCreditCardNoWithoutSpace( text );

        if ( formatCardNo.length >= 4 ) {
            return formatCardNo.substr( formatCardNo.length - 4, 4 );
        }

        return formatCardNo;
    },

    formatCreditCardNoWithoutSpace: function ( text ) {
        const formatCardNo = creditcardutils.formatCardNumber( text );

        let cardNo = '';
        for ( let index = 0; index < formatCardNo.length; index++ ) {
            if ( formatCardNo[ index ] >= '0' && formatCardNo[ index ] <= '9' ) {
                cardNo += formatCardNo[ index ];
            }
        }

        return cardNo;
    },


    formatCreditCardNoWithSpace: function ( text ) {
        const formatCardNo = this.formatCreditCardNoWithoutSpace( text );

        let cardNo = '';
        let currentIndex = 0;
        for ( let index = 0; index < formatCardNo.length; index++ ) {
            if ( formatCardNo[ index ] >= '0' && formatCardNo[ index ] <= '9' ) {
                cardNo += formatCardNo[ index ];

                if ( (currentIndex + 1) % 4 === 0 ) {
                    cardNo += ' ';
                }

                currentIndex++;
            }
        }

        return cardNo;
    },

    formatCreditCardNoWithEncryptionAndSpace: function ( text ) {
        const lastFour = this.formatCreditCardNoLastFour( text );

        return '**** **** **** ' + lastFour;
    },

    formatExpiryDate: function ( text ) {
        if ( !this.validateCardExpiry( text ) ) {
            return creditcardutils.formatCardExpiry( text );
        } else {
            const parseCardExpiry = creditcardutils.parseCardExpiry( text );
            return this.addZero( '' + parseCardExpiry.month, 2 ) + ' / ' + this.addZero( ('' + parseCardExpiry.year).substr( 2, 2 ), 2 );
        }
    },

    formatExpiryDateWithYYYYMM: function ( text ) {
        if ( !this.validateCardExpiry( text ) ) {
            return '';
        } else {
            const parseCardExpiry = creditcardutils.parseCardExpiry( text );
            return '' + parseCardExpiry.year + this.addZero( '' + parseCardExpiry.month, 2 );
        }
    },

    addZero: function ( str, length ) {
        return new Array( length - str.length + 1 ).join( "0" ) + str;
    }

};
export default CreditCardUtil;