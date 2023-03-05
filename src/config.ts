import { ThemeConfig, theme } from 'antd';
import findTextColor from './utils/findTextColor';

const basicTheme = (primaryColor: string): ThemeConfig => ({
  token: {
    colorPrimary: primaryColor,
    fontFamily: 'Manrope, Public Sans, sans-serif',
    fontWeightStrong: 700,
  },
});

export const lightTheme = (primaryColor: string): ThemeConfig => ({
  ...basicTheme(primaryColor),
  algorithm: theme.defaultAlgorithm,
  components: {
    Typography: {
      colorText: '#343a40',
    },
  },
});

export const darkTheme = (primaryColor: string): ThemeConfig => ({
  ...basicTheme(primaryColor),
  algorithm: theme.darkAlgorithm,
  components: {
    Typography: {
      colorText: '#e9ecef',
    },
  },
});
