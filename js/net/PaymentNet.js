/**
 *
 * @param amount
 * @param paymentMethod Paypal("paypal")
 * @param callback
 */
import { apiDomain } from "../env";
import request from "superagent";
import auth from "./auth/authRequest";
import header from "./header/headerRequest";
import parse from "./parse/fdParse";
import superagent_prefix from "superagent-prefix";
import logger from "./logger/superagent-logger";

auth( request );
header( request );
parse( request );

const prefix = superagent_prefix( apiDomain );

export function netPaymentAccountBalance( callback ) {
    request
        .post( '/payment/account-balance' )
        .query( {} )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netPaymentTransactionPointList( pageSize, pageNum, callback ) {
    request
        .post( '/payment/transaction/point/list' )
        .query( { pageSize: pageSize, pageNum: pageNum } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netPaymentTransactionPointDetail( id, callback ) {
    request
        .post( '/payment/transaction/point/' + id )
        .query()
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netPaymentTransactionMoneyList( pageSize, pageNum, callback ) {
    request
        .post( '/payment/transaction/money/list' )
        .query( { pageSize: pageSize, pageNum: pageNum } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netPaymentTransactionMoneyDetail( id, callback ) {
    request
        .post( '/payment/transaction/money/' + id )
        .query()
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netPaymentSystemCouponList( pageSize, pageNum, callback ) {
    request
        .post( '/payment/system-coupon/list' )
        .query( { pageSize: pageSize, pageNum: pageNum } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netPaymentSystemCouponApply( couponId, receiver, payPass, callback ) {
    request
        .post( '/payment/system-coupon/apply' )
        .query( { couponId: couponId, receiver: receiver, payPass: payPass } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netPaymentWithdraw( amount, withdrawAccountId, payPass, callback ) {
    request
        .post( '/payment/withdraw' )
        .query( { amount: amount, withdrawAccountId: withdrawAccountId, payPass: payPass } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netPaymentWithdrawList( pageSize, pageNum, callback ) {
    request
        .post( '/payment/withdraw/list' )
        .query( { pageSize: pageSize, pageNum: pageNum } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netPaymentTopUp( amount, paymentMethod, callback ) {
    request
        .post( '/payment/top-up' )
        .query( { amount: amount, paymentMethod: paymentMethod } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

/**
 *
 * @param toMemberId
 * @param amount
 * @param useFromMemberCurrency  [Boolean] [m] true if using sender's
 * @param payPass
 * @param callback
 */
export function netPaymentTransfer( toMemberId, amount, useFromMemberCurrency, payPass, callback ) {
    request
        .post( '/payment/transfer' )
        .query( {
            toMemberId: toMemberId,
            amount: amount,
            useFromMemberCurrency: useFromMemberCurrency,
            payPass: payPass
        } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netPaymentPayment( toMemberId, amount, payPass, callback ) {
    request
        .post( '/payment/payment' )
        .query( {
            toMemberId: toMemberId,
            amount: amount,
            payPass: payPass
        } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netPaymentOrder( orderId, amount, payPass, callback ) {
    request
        .post( '/payment/payment' )
        .query( {
            orderId: orderId,
            payPass: payPass,
            amount: amount
        } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}


export function netPaymentCreditCardList( callback ) {
    request
        .post( '/member/credit-card/list' )
        .query()
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netPaymentCreditCardCreate( cardNo, cvv, expiryDate, type, callback ) {
    request
        .post( '/member/credit-card/create' )
        .query( {
            cardNo: cardNo,
            cvv: cvv,
            expiryDate: expiryDate,
            type: type
        } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netPaymentCreditCardDelete( id, callback ) {
    request
        .post( '/member/credit-card/delete/' + id )
        .query()
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}

export function netPaymentCreditCardSetDefault( id, callback ) {
    request
        .post( '/member/credit-card/set-default' )
        .query( { id: id } )
        .use( prefix )
        .use( logger )
        .authRequest()
        .headerRequest()
        .fdParse()
        .end( callback );
}