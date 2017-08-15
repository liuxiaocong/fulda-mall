import React, { PropTypes } from "react";
import { BackHandler, Dimensions } from "react-native";
import { addNavigationHelpers, StackNavigator, TabNavigator } from "react-navigation";
import { connect } from "react-redux";
import TopUpByUnionPayPage from "./pages/wallet/topup/TopUpByUnionPayPage";
import CommentOrderPage from "./pages/order/userOrder/commentOrder/CommentOrderPage";
import CompleteUserInfoPage from "./pages/auth/completeInfo/CompleteUserInfoPage";
import MobileNoTopUpPage from "./pages/tools/mobileNoTopUp/MobileNoTopUpPage";
import MyToolsPage from "./pages/tools/MyToolsPage";
import WalletBalancePieChartPage from "./pages/wallet/pieChart/WalletBalancePieChartPage";
import ShopOrderPage from "./pages/order/shopOrder/ShopOrderPage";
import UserOrderPage from "./pages/order/userOrder/UserOrderPage";
import DeliverAddressSelectPage from "./pages/common/deliverAddressSelect/DeliverAddressSelectPage";
import LuckyWheelPage from "./pages/tools/luckyWheel/LuckyWheelPage";
import CommonInputAreaPage from "./pages/shop/shopOpen/commonInputArea/CommonInputAreaPage";
import MainPage from "./pages/main/MainPage";
import LoginPage from "./pages/auth/login/LoginPage";
import FindPSWDByEmailPage from "./pages/auth/findPSWD/FindPSWDByEmailPage";
import FindPSWDByPhonePage from "./pages/auth/findPSWD/FindPSWDByPhonePage";
import FindPSWDByEmailSuccessPage from "./pages/auth/findPSWD/FindPSWDByEmailSuccessPage";
import BindOldAccountPage from "./pages/auth/register/BindOldAccountPage";
import RegisterPage from "./pages/auth/register/RegisterPage";
import BindSelectPage from "./pages/auth/register/BindSelectPage";
import ScanPage from "./pages/scan/ScanPage";
import ReceiptPage from "./pages/wallet/receipt/ReceiptPage";
import TestPage from "./pages/common/TestPage";
import TopUpPage from "./pages/wallet/topup/TopUpPage";
import ReceiptSetAmountPage from "./pages/wallet/receipt/ReceiptSetAmountPage";
import SearchPage from "./pages/search/SearchPage";
import SearchShopPage from "./pages/search/SearchShopPage";
import SearchByCategoryPage from "./pages/search/SearchByCategoryPage";
import BusinessDetailPage from "./pages/shop/shopDetail/ShopDetailPage";
import SearchGoodsPage from "./pages/search/SearchGoodsPage";
import ShopDetailInfoPage from "./pages/shop/shopDetail/ShopDetailInfoPage";
import GoodsDetailPage from "./pages/goods/GoodsDetailPage";
import MyWalletPage from "./pages/wallet/MyWalletPage";
import FRCRecordPage from "./pages/wallet/FRC/FRCRecordPage";
import TransactionRecordPage from "./pages/wallet/transaction/TransactionRecordPage";
import WalletTransferPage from "./pages/wallet/transfer/WalletTransferPage";
import WalletWithdrawPage from "./pages/wallet/withdraw/WalletWithdrawPage";
import WalletWithdrawAccountSelectPage from "./pages/wallet/withdraw/accountSelect/WalletWithdrawAccountSelectPage";
import WalletWithdrawRecordPage from "./pages/wallet/withdraw/record/WalletWithdrawRecordPage";
import WalletTransferNextStepPage from "./pages/wallet/transfer/WalletTransferNextStepPage";
import WalletTransferSuccessPage from "./pages/wallet/transfer/WalletTransferSuccessPage";
import TopUpCardPage from "./pages/wallet/topupCard/TopUpCardPage";
import WalletQRPayPage from "./pages/wallet/QRPay/WalletQRPayPage";
import WalletQRPaySuccessPage from "./pages/wallet/QRPay/WalletQRPaySuccessPage";
import UserProfilePage from "./pages/user/UserProfilePage";
import ShopQRCodePage from "./pages/shop/ShopQRCodePage";
import GoodsQRCodePage from "./pages/goods/GoodsQRCodePage";
import TopUpByPayPalPage from "./pages/wallet/topup/TopUpByPayPalPage";
import TopUpAmountInputPage from "./pages/wallet/topup/TopUpAmountInputPage";
import WalletWithdrawSetAmountPage from "./pages/wallet/withdraw/WalletWithdrawSetAmountPage";
import FavoritesPage1 from "./pages/favorites/FavoritesPage1";
import LocationPickerPage1 from "./pages/common/LocationPickerPage1";
import LocationMapPages1 from "./pages/common/LocationMapPages1";
import ShopNameInputPage from "./pages/shop/shopOpen/ShopNameInputPage";
import DebugPage from "./pages/debug/DebugPage";
import DebugLoginHistoryPage from "./pages/debug/DebugLoginHistoryPage";
import CountrySelectPage from "./pages/common/countrySelect/CountrySelectPage";
import ShopAddressInputPage from "./pages/shop/shopOpen/ShopAddressInputPage";
import MyCreditCardPage from "./pages/wallet/creditCard/MyCreditCardPage";
import MyCreditCardAddPage from "./pages/wallet/creditCard/MyCreditCardAddPage";
import MyCreditCardShowPage from "./pages/wallet/creditCard/MyCreditCardShowPage";
import MyInfoPage from "./pages/me/MyInfoPage";
import SetPSWDPage from "./pages/account/setPSDW/SetPSWDPage";
import SetPayPSWDPage from "./pages/wallet/payPSWD/setPSWD/SetPayPSWDPage";
import FindPayPSWDByMobilePage from "./pages/wallet/payPSWD/findByMobile/FindPayPSWDByMobilePage";
import FindPayPSWDByEmailPage from "./pages/wallet/payPSWD/findByEmail/FindPayPSWDByEmailPage";
import SettingPage from "./pages/setting/SettingPage";
import SetNamePage from "./pages/me/setName/SetNamePage";
import SetAddressPage from "./pages/me/setAddress/SetAddressPage";
import SetGenderPage from "./pages/me/setGender/SetGenderPage";
import SetIdCardPage from "./pages/me/setIdCard/SetIdCardPage";
import SetPostcodePage from "./pages/me/setPostcode/SetPostcodePage";
import MyNameCardPage from "./pages/user/myNameCard/MyNameCardPage";
import CommonInfoSettingPage from "./pages/shop/shopOpen/commonInfoSetting/CommonInfoSettingPage";
import FindPayPSWDByEmailSuccessPage from "./pages/wallet/payPSWD/findByEmail/Success/FindPayPSWDByEmailSuccessPage";
import WebViewPage from "./pages/common/webView/WebViewPage";
import BindMobilePage from "./pages/me/bindMobile/BindMobilePage";
import BindEmailPage from "./pages/me/bindEmail/BindEmailPage";
import BindMobileSuccessPage from "./pages/me/bindMobile/Success/BindMobileSuccessPage";
import BindEmailSuccessPage from "./pages/me/bindEmail/Success/BindEmailSuccessPage";
import ShopOpenPage from "./pages/shop/shopOpen/ShopOpenPage";
import ShopSettingPage from "./pages/shop/shopSetting/ShopSettingPage";
import WaitPaidOrdersPage from "./pages/order/shopOrder/component/WaitPaidOrdersPage";
import WaitShipPage from "./pages/order/shopOrder/component/WaitShipPage";
import AlreadyShipPage from "./pages/order/shopOrder/component/AlreadyShipPage";
import ShopEditPage from "./pages/shop/shopEdit/ShopEditPage";
import ShopSettingBasicPage from "./pages/shop/shopSettingBasic/ShopSettingBasicPage";
import SetShopTypePage from "./pages/shop/shopOpen/setShopType/SetShopTypePage";
import ShopSetBusinessPage from "./pages/shop/shopEdit/setBusiness/ShopSetBusinessPage";
import ShopSetNamePage from "./pages/shop/shopEdit/setName/ShopSetNamePage";
import ShopSetIntroPage from "./pages/shop/shopEdit/setIntro/ShopSetIntroPage";
import ShopSetMobilePage from "./pages/shop/shopEdit/setMobile/ShopSetMobilePage";
import ShopSetTelephonePage from "./pages/shop/shopEdit/setTelephone/ShopSetTelephonePage";
import WithdrawAccountSettingPage from "./pages/wallet/withdraw/accountSetting/WithdrawAccountSettingPage";
import WithdrawAccountAddPage from "./pages/wallet/withdraw/accountAdd/WithdrawAccountAddPage";
import SetDeliverAddressPage from "./pages/order/deliverAddress/SetDeliverAddressPage";
import AddDeliverAddressPage from "./pages/order/deliverAddress/addDeliverAddress/AddDeliverAddressPage";
import EditDeliverAddressPage from "./pages/order/deliverAddress/editDeliverAddress/EditDeliverAddressPage";
import WithdrawAccountEditPage from "./pages/wallet/withdraw/accountEdit/WithdrawAccountEditPage";
import ShopClosePage from "./pages/shop/shopClose/ShopClosePage";
import BindWeChatPage from "./pages/shop/shopEdit/bindWeChat/BindWeChatPage";
import ShopBottomCodePage from "./pages/shop/shopBottomCode/ShopBottomCodePage";
import RecommendListPage from "./pages/recommendList/RecommendListPage";
import ShopSetAddressPage from "./pages/shop/shopEdit/setAddress/ShopSetAddressPage";
import ShopSetDiscountPage from "./pages/shop/shopEdit/setDiscount/ShopSetDiscountPage";
import CheckOutPage from "./pages/order/checkOut/CheckOutPage";


const { width } = Dimensions.get( 'window' );
const sellerOrdersPageTabCount = 3;
let TabNavigatorConfig = {
    tabBarPosition: 'top',
    swipeEnabled: true,
    tabBarOptions: {
        activeTintColor: '#000000',
        inactiveTintColor: '#b4b8c0',
        inactiveBackgroundColor: 'white',
        activeBackgroundColor: 'white',
        showIcon: false,
        indicatorStyle: {
            alignSelf: 'center',
            width: 30,
            marginLeft: (width / (sellerOrdersPageTabCount * 2)) - 15,
            borderBottomColor: '#000000',
            borderBottomWidth: 2,
        },
        labelStyle: {
            fontSize: 12,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 0
        },
        style: {
            backgroundColor: 'white',
            elevation: 0,
            marginTop: 100
        },
        tabStyle: {
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 0
        }
    },
};

const SellerOrdersPage = TabNavigator( {
    alreadyShipPage: { screen: AlreadyShipPage },
    waitPaidOrdersPage: { screen: WaitPaidOrdersPage },
    waitShipPage: { screen: WaitShipPage },
}, TabNavigatorConfig );

const routeConfiguration = {
    mainPage: { screen: MainPage },
    scanPage: { screen: ScanPage },
    receiptPage: { screen: ReceiptPage },
    topUpPage: { screen: TopUpPage },
    loginPage: { screen: LoginPage },
    findPSWDByEmailPage: { screen: FindPSWDByEmailPage },
    findPSWDByPhonePage: { screen: FindPSWDByPhonePage },
    findPSWDByEmailSuccessPage: { screen: FindPSWDByEmailSuccessPage },
    bindOldAccountPage: { screen: BindOldAccountPage },
    bindSelectPage: { screen: BindSelectPage },
    registerPage: { screen: RegisterPage },
    testPage: { screen: TestPage },
    receiptSetAmountPage: { screen: ReceiptSetAmountPage },
    searchPage: { screen: SearchPage },
    searchShopPage: { screen: SearchShopPage },
    searchByCategoryPage: { screen: SearchByCategoryPage },
    searchGoodsPage: { screen: SearchGoodsPage },
    myInfoPage: { screen: MyInfoPage },
    setPSWDPage: { screen: SetPSWDPage },
    settingPage: { screen: SettingPage },
    setNamePage: { screen: SetNamePage },
    setAddressPage: { screen: SetAddressPage },
    setGenderPage: { screen: SetGenderPage },
    setIdCardPage: { screen: SetIdCardPage },
    setPostcodePage: { screen: SetPostcodePage },
    myNameCardPage: { screen: MyNameCardPage },
    setPayPSWDPage: { screen: SetPayPSWDPage },
    findPayPSWDByMobilePage: { screen: FindPayPSWDByMobilePage },
    findPayPSWDByEmailPage: { screen: FindPayPSWDByEmailPage },
    findPayPSWDByEmailSuccessPage: { screen: FindPayPSWDByEmailSuccessPage },
    webViewPage: { screen: WebViewPage },
    shopDetailPage: { screen: BusinessDetailPage },
    shopDetailInfoPage: { screen: ShopDetailInfoPage },
    goodsDetailPage: { screen: GoodsDetailPage },
    bindMobilePage: { screen: BindMobilePage },
    bindEmailPage: { screen: BindEmailPage },
    bindMobileSuccessPage: { screen: BindMobileSuccessPage },
    bindEmailSuccessPage: { screen: BindEmailSuccessPage },
    shopOpenPage: { screen: ShopOpenPage },
    commonInfoSettingPage: { screen: CommonInfoSettingPage },
    shopSettingPage: { screen: ShopSettingPage },
    sellerOrdersPage: {
        screen: SellerOrdersPage,
        navigationOptions: {
            header: ( { state, setParams }, defaultHeader ) => ({
                ...defaultHeader,
                visible: true,
            })
        },
    },
    shopEditPage: { screen: ShopEditPage },
    shopSettingBasicPage: { screen: ShopSettingBasicPage },
    setShopTypePage: { screen: SetShopTypePage },
    shopSetNamePage: { screen: ShopSetNamePage },
    shopSetBusinessPage: { screen: ShopSetBusinessPage },
    shopSetIntroPage: { screen: ShopSetIntroPage },
    shopSetMobilePage: { screen: ShopSetMobilePage },
    shopSetTelephonePage: { screen: ShopSetTelephonePage },
    shopSetAddressPage: { screen: ShopSetAddressPage },
    withdrawAccountSettingPage: { screen: WithdrawAccountSettingPage },
    withdrawAccountAddPage: { screen: WithdrawAccountAddPage },
    setDeliverAddressPage: { screen: SetDeliverAddressPage },
    addDeliverAddressPage: { screen: AddDeliverAddressPage },
    editDeliverAddressPage: { screen: EditDeliverAddressPage },
    withdrawAccountEditPage: { screen: WithdrawAccountEditPage },
    shopClosePage: { screen: ShopClosePage },
    bindWeChatPage: { screen: BindWeChatPage },
    shopBottomCodePage: { screen: ShopBottomCodePage },
    myWalletPage: { screen: MyWalletPage },
    frcRecordPage: { screen: FRCRecordPage },
    transactionRecordPage: { screen: TransactionRecordPage },
    walletTransferPage: { screen: WalletTransferPage },
    walletWithdrawPage: { screen: WalletWithdrawPage },
    walletWithdrawAccountSelectPage: { screen: WalletWithdrawAccountSelectPage },
    walletWithdrawRecordPage: { screen: WalletWithdrawRecordPage },
    walletTransferNextStepPage: { screen: WalletTransferNextStepPage },
    walletTransferSuccessPage: { screen: WalletTransferSuccessPage },
    topUpCardPage: { screen: TopUpCardPage },
    walletQRPayPage: { screen: WalletQRPayPage },
    walletQRPaySuccessPage: { screen: WalletQRPaySuccessPage },
    userProfilePage: { screen: UserProfilePage },
    shopQRCodePage: { screen: ShopQRCodePage },
    goodsQRCodePage: { screen: GoodsQRCodePage },
    topUpByPayPalPage: { screen: TopUpByPayPalPage },
    topUpAmountInputPage: { screen: TopUpAmountInputPage },
    walletWithdrawSetAmountPage: { screen: WalletWithdrawSetAmountPage },
    favoritesPage1: { screen: FavoritesPage1 },
    locationPickerPage1: { screen: LocationPickerPage1 },
    locationMapPages1: { screen: LocationMapPages1 },
    shopNameInputPage: { screen: ShopNameInputPage },
    debugPage: { screen: DebugPage },
    debugLoginHistoryPage: { screen: DebugLoginHistoryPage },
    countrySelectPage: { screen: CountrySelectPage },
    shopAddressInputPage: { screen: ShopAddressInputPage },

    recommendListPage: { screen: RecommendListPage },
    shopSetDiscountPage: { screen: ShopSetDiscountPage },
    myCreditCardPage: { screen: MyCreditCardPage },
    myCreditCardAddPage: { screen: MyCreditCardAddPage },
    myCreditCardShowPage: { screen: MyCreditCardShowPage },
    luckyWheelPage: { screen: LuckyWheelPage },
    walletBalancePieChartPage: { screen: WalletBalancePieChartPage },
    checkOutPage: { screen: CheckOutPage },
    commonInputAreaPage: { screen: CommonInputAreaPage },
    deliverAddressSelectPage: { screen: DeliverAddressSelectPage },
    mobileNoTopUpPage: { screen: MobileNoTopUpPage },
    myToolsPage: { screen: MyToolsPage },
    shopOrderPage: { screen: ShopOrderPage },
    userOrderPage: { screen: UserOrderPage },
    completeUserInfoPage: { screen: CompleteUserInfoPage },
    topUpByUnionPayPage: { screen: TopUpByUnionPayPage },
    commentOrderPage: { screen: CommentOrderPage }
};

const stackNavigatorConfiguration = {
    headerMode: 'screen',
    initialRouteName: 'mainPage',
    initialRouteParams: {},
    navigationOptions: {
        headerStyle: {
            backgroundColor: '#fff',
            elevation: 0
        },
        headerTitleStyle: {
            color: '#3e3c43'
        },
        headerTintColor: '#3e3c43',
    },
};

export const FDMallNavigator = StackNavigator( routeConfiguration, stackNavigatorConfiguration );

// const AppWithNavigationState = ( { dispatch, nav } ) => (
//     <FDMallNavigator navigation={addNavigationHelpers( { dispatch, state: nav } )}/>
// );

class AppWithNavigationState extends React.Component {
    static shouldCloseApp( nav ) {
        return nav.index === 0;
    }

    componentDidMount() {
        BackHandler.addEventListener( 'backPress', () => {
            const { dispatch, nav } = this.props;
            if ( AppWithNavigationState.shouldCloseApp( nav ) ) {
                return false;
            }

            dispatch( {
                type: 'Navigation/BACK'
            } );

            return true;
        } )
    }

    //noinspection JSMethodCanBeStatic
    componentWillUnmount() {
        BackHandler.removeEventListener( 'backPress' )
    }

    render() {
        return (
            <FDMallNavigator navigation={addNavigationHelpers( {
                dispatch: this.props.dispatch,
                state: this.props.nav
            } )}/>
        );
    }
}

AppWithNavigationState.propTypes = {
    dispatch: PropTypes.func,
    nav: PropTypes.object,
};

const mapStateToProps = state => ({
    nav: state.nav,
});

export default connect( mapStateToProps )( AppWithNavigationState );