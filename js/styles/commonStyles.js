/**
 * @class StylesCommon
 * @desc 通用样式
 */
import React, { StyleSheet } from "react-native";
import constStyles from "./constStyles";
import Util from "../util/Util";
const commonStyles = StyleSheet.create(
    {
        wrapper: {
            flex: 1
        },
        commonBG: {
            backgroundColor: '#f1f3f5'
        },
        paddingCommon: {
            paddingTop: 20,
            paddingBottom: 20,
            paddingLeft: 28,
            paddingRight: 28
        },
        mgt_normal: {
            marginTop: 20
        },
        mgb_normal: {
            marginBottom: 20
        },
        mgl_normal: {
            marginLeft: 28
        },
        mgr_normal: {
            marginRight: 28
        },
        pdt_normal: {
            paddingTop: 20
        },
        pdb_normal: {
            paddingBottom: 20
        },
        pdl_normal: {
            paddingLeft: 28
        },
        pdr_normal: {
            paddingRight: 28
        },

        justAlignCenter: {
            alignItems: 'center',
            justifyContent: 'center'
        },
        modalBoxStyle: {
            justifyContent: 'center',
            alignItems: 'center',
            height: 100,
            width: 100,
            backgroundColor: 'rgba(0, 0, 0, 0)'
        },
        inputTextGroupStyle: {
            backgroundColor: '#f1f6f8',
            borderRadius: 5,
            borderColor: '#e7e7e7',
            borderWidth: Util.getDpFromPx( 1 )
        },
        inputTextGroupDarkStyle: {
            backgroundColor: '#ffffff33',
            borderRadius: 5,
            borderColor: '#ffffffb2',
            borderWidth: 1
        },
        inputTextGroupItemStyle: {
            height: 48,
            paddingLeft: 10,
            paddingRight: 10
        },
        errorTipStyle: {
            fontSize: 12,
            color: '#e72545',
            textAlign: 'center',
            marginTop: 20,
            marginBottom: 10,
        },
        emptyTipStyle: {
            color: '#b4b8c0',
            fontSize: 16,
            alignSelf: 'center'
        },
        buttonContainerStyle: {
            paddingLeft: 10,
            paddingRight: 10,
            height: 44,
            overflow: 'hidden',
            borderRadius: 5,
            backgroundColor: constStyles.THEME_COLOR,
            alignItems: 'center',
            justifyContent: 'center',
        },
        buttonContainerDisabledStyle: {
            paddingLeft: 10,
            paddingRight: 10,
            height: 44,
            overflow: 'hidden',
            borderRadius: 5,
            backgroundColor: '#e7e7e7',
            alignItems: 'center',
            justifyContent: 'center'
        },
        buttonContentStyle: {
            fontSize: 16,
            color: 'white'
        },
        commonTextColorStyle: {
            color: '#3e3c43'
        },
        commonTextColorDarkStyle: {
            color: 'white'
        },
        commonIntervalStyle: {
            height: Util.getDpFromPx( 1 ),
            backgroundColor: '#e7e7e7'
        },
        commonIntervalDarkStyle: {
            height: 1,
            backgroundColor: '#7f7f7f'
        },
        commonTextInputStyle: {},
        commonTextInputDarkStyle: {
            color: 'white'
        },
        arrow: {
            width: 8,
            height: 13,
            marginLeft: 15
        },

        commonTips: {
            backgroundColor: '#fffcf2',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 10,
            paddingBottom: 10
        },
        commonTipsText: {
            textAlign: 'center',
            color: '#ffc515',
            fontSize: 14,
            paddingLeft: 28,
            paddingRight: 28,
        },

        commonBorderTop: {
            borderTopWidth: Util.getDpFromPx( 1 ),
            borderTopColor: '#e7e7e7',
        },

        commonBorderBottom: {
            borderBottomWidth: Util.getDpFromPx( 1 ),
            borderBottomColor: '#e7e7e7',
        },

        top_info: {
            paddingTop: 20,
            height: 60,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: constStyles.DIVIDER_COLOR
        },
        top_info_title: {
            flexGrow: 1,
            textAlign: 'center',
            fontSize: 16
        },
        top_info_left_btn: {
            marginLeft: 15,
            color: constStyles.THEME_COLOR,
            fontSize: 14
        },
        top_info_right_btn: {
            marginRight: 15,
            color: constStyles.THEME_COLOR,
            fontSize: 14
        },
        top_tip: {
            marginTop: 10
        },

        commonInput: {
            height: 40,
            backgroundColor: '#f1f6f8',
            borderRadius: 5,
            borderWidth: 1,
            paddingLeft: 14,
            paddingRight: 14,
            borderColor: constStyles.DIVIDER_COLOR
        },

        text_h5: {
            color: '#3e3c43',
            fontSize: 14
        }
    }
);
export default commonStyles;
