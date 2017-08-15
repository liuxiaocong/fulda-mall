/**
 * Created by xiaoconglau on 05/04/2017.
 */
import { Platform } from "react-native";

export const CHANGE_MEMBER_PASSWORD_TYPE = 0;
export const CHANGE_PAYMENT_PASSWORD_TYPE = 1;

export const FORGOT_PASSWORD_BY_MOBILE = 0;
export const FORGOT_PASSWORD_BY_EMAIL = 1;

export const APP_URL = Platform.OS.toLowerCase() === 'ios' ?
    "https://itunes.apple.com/us/app/fulda-mall/id1195796588?mt=8" :
    "https://play.google.com/store/apps/details?id=com.fulda.fuldamall&hl=en";

export const VERIFY_TOKEN_BINDMOBILE = 0;
export const VERIFY_TOKEN_FORGOTPAYPASSWORD = 1;

export const DEFAULT_WITHDRAW_ACCOUNT_TYPE = 1;

export const UPLOAD_TYPE = {
    MemberLogo: "MemberLogo",
    MemberIdPhoto: "MemberIdPhoto",
    ShopLogo: "ShopLogo",
    ShopIdPhoto: "ShopIdPhoto",
    ShopLicensePhoto: "ShopLicensePhoto",
    ShopBanner: "ShopBanner",
    ShopWx: "ShopWx"
};

export const FAV_TYPE_SHOP = 0;
export const FAV_TYPE_GOODS = 1;

export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE_START = 0;
export const DEFAULT_GOODS_COMMENT_TYPE = 1;
export const MAX_LENGTH = {
    DEFAULT: 5000,
    USER_NAME: 100,
    USER_ID_NO: 20,
    USER_POSTALCODE: 10,
    USER_ADDRESS: 50,
    EMAIL: 45,
    SHOP_OWNER_NAME: 50,
    SHOP_NAME: 100,
    SHOP_INTRO: 150,
    SHOP_BUSINESS: 70,
    SHOP_ID_NO: 20,
    SHOP_REGISTER_NO: 20,
    SHOP_POSTALCODE: 10,
    SHOP_TELEPHONE: 20,
    SHOP_MOBILE: 20,
    SHOP_DISCOUNT: 8,
    SHOP_ADDRESS: 50,
    WITHDRAW_ACCOUNT_MEMBER_NAME: 40,
    WITHDRAW_ACCOUNT_ACCOUNT_NO: 35,
    WITHDRAW_ACCOUNT_EXTRA_INFO: 40,
};

// [ New(1), Cancelled(2), Paid(3), Shipped(4), Received(5), ReturnIng(6), Returned(7), OutOfStock(8), BalanceRemained(9);]
export const ORDER_TYPE = {
    NEW: 1,
    CANCELLED: 2,
    PAID: 3,
    SHIPPED: 4,
    RECEIVED: 5,
    RETURNING: 6,
    RETURNED: 7,
    OUTOFSTOCK: 8,
    BALANCEREMAINED: 9
};

export const ORDER_UPDATE_EVENT = {
    WAIT_PAID: 1,
    WAIT_SHIP: 1 << 1,
    WAIT_CONFIRM: 1 << 2,
    WAIT_COMMENT: 1 << 3,
};

