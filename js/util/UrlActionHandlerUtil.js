import { webDomain } from "../env";
import url from "url";
import UrlActionType from "./UrlActionType";
import { getStore } from "../setup";


const UrlActionHandlerUtil = (function () {
    let scheme = webDomain + '/';
    return {
        genMemberUrl: function ( id ) {
            const urlObj = url.parse( scheme );

            urlObj.query = {
                action: UrlActionType.ACTION_USER,
                recomid: id,
                page_dir: 'register'
            };

            const urlStr = url.format( urlObj );

            console.log( 'genMemberUrl = ' + urlStr );

            return urlStr;
        },

        genInviteUrl: function ( id ) {
            const urlObj = url.parse( scheme + 'ref.html' );

            urlObj.query = {
                recomid: id,
            };

            const urlStr = url.format( urlObj );

            console.log( 'genInviteUrl = ' + urlStr );

            return urlStr;
        },

        genShopUrl: function ( id ) {
            const urlObj = url.parse( scheme );

            urlObj.query = {
                action: UrlActionType.ACTION_SHOP,
                recomid: id,
                shopid: id,
                page_dir: 'register'
            };

            const urlStr = url.format( urlObj );

            console.log( 'genShopUrl = ' + urlStr );

            return urlStr;
        },

        genGoodsUrl: function ( id, shopId ) {
            const urlObj = url.parse( scheme );

            urlObj.query = {
                action: UrlActionType.ACTION_GOODS,
                recomid: shopId,
                goodid: id,
                shopid: shopId,
                page_dir: 'register'
            };

            const urlStr = url.format( urlObj );

            console.log( 'genGoodsUrl = ' + urlStr );

            return urlStr;
        },

        genQRPaymentUrl: function ( id, currency ) {
            const urlObj = url.parse( scheme );

            const create_time = new Date().getTime() / 1000;

            urlObj.query = {
                action: UrlActionType.ACTION_QR_PAYMENT,
                pay: 'now',
                receiver: id,
                receiver_amount: '',
                currency: currency,
                create_time: create_time,
                other_info: '',
                page_dir: 'wallet'
            };

            const urlStr = url.format( urlObj );

            console.log( 'genQRPaymentUrl = ' + urlStr );

            return urlStr;
        },

        genPaymentUrl: function ( id, currency, amount ) {
            const urlObj = url.parse( scheme );

            const create_time = new Date().getTime() / 1000;

            urlObj.query = {
                action: UrlActionType.ACTION_PAYMENT,
                pay: 'now',
                receiver: id,
                receiver_amount: amount,
                currency: currency,
                create_time: create_time,
                other_info: '',
                page_dir: 'wallet'
            };

            const urlStr = url.format( urlObj );

            console.log( 'genPaymentUrl = ' + urlStr );

            return urlStr;
        },

        genUserPrivacy: function () {
            const scheme1 = webDomain + '/page.php';

            const urlObj = url.parse( scheme1 );

            const store = getStore();

            urlObj.query = {
                action: 'member',
                header: 'no'
            };

            return url.format( urlObj );
        },

        genOpenShopPrivacy: function () {
            const scheme1 = webDomain + '/page-agreement-1.html';

            const urlObj = url.parse( scheme1 );

            const store = getStore();

            urlObj.query = {
                header: 'no'
            };

            return url.format( urlObj );
        },

        genAddCardPrivacy: function () {
            const scheme1 = webDomain + '/page.php';

            const urlObj = url.parse( scheme1 );

            const store = getStore();

            urlObj.query = {
                action: 'member',
                header: 'no'
            };

            return url.format( urlObj );
        },

        genAbout: function () {
            const scheme1 = webDomain + '/page-aboutus-1.html';

            const urlObj = url.parse( scheme1 );

            const store = getStore();

            urlObj.query = {
                header: 'no'
            };

            return url.format( urlObj );
        },


        parse: function ( data ) {
            const urlObj = url.parse( data, true );

            if ( urlObj === null || urlObj === undefined ) {
                return null;
            }

            if ( urlObj.protocol + '//' + urlObj.hostname + urlObj.pathname !== scheme ) {
                return null;
            }

            return urlObj.query;
        }
    }

})();

export default UrlActionHandlerUtil;