import { Platform } from "react-native";

const constStyles = {
    TITLE_FONT_SIZE: 16,
    COMMON_PADDING: 15,

    STATE_BAR_HEIGHT: Platform.OS === 'ios' ? 17 : 24,

    STYLES_PLACE_HOLDER_TEXT_COLOR: "#b4b8c0",
    STYLES_PLACE_HOLDER_TEXT_DARK_COLOR: "#ffffffcc",
    THEME_COLOR: "#ffc515",
    DIVIDER_COLOR: '#e7e7e7',
    SPINNER_COLOR: '#ffc515',
    PICKER_CANCEL_COLOR: [ 255, 197, 21, 1 ],
    PICKER_CONFIRM_COLOR: [ 255, 197, 21, 1 ],
    PICKER_CONFIRM_COLOR_CODE: "#ffc515",
    PICKER_CANCEL_COLOR_CODE: "#ffc515",
    HOME_TAB_UNDERLAY_COLOR: '#fd9603',
    THEME_STATUS_BAR_COLOR: Platform.OS === 'ios' ? "#ffc515" : '#fd9603',
    STATUS_BAR_COLOR: Platform.OS === 'ios' ? "#ffffff" : '#fd9603',
    STATUS_BAR_CONTENT_STYLE_DARK: Platform.OS === 'ios' ? 'dark-content' : 'light-content',
    STATUS_BAR_CONTENT_STYLE_LIGHT: Platform.OS === 'ios' ? 'light-content' : 'light-content',
    ACTION_TITLE_COLOR: '#3e3c43',
    ACTION_TITLE_SIZE: '#3e3c43',
    COMMON_GREY_BG: '#f1f3f5'
};
export default constStyles;

