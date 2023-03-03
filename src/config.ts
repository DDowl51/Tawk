import { ThemeConfig, theme } from 'antd';

const basicTheme: ThemeConfig = {
  token: {
    colorPrimary: '#339af0',
    fontFamily: 'Manrope, Public Sans, sans-serif',
    fontWeightStrong: 700,
  },
};

export const lightTheme: ThemeConfig = {
  ...basicTheme,
  algorithm: theme.defaultAlgorithm,
  components: {
    Typography: {
      colorText: '#343a40',
    },
  },
};

export const darkTheme: ThemeConfig = {
  ...basicTheme,
  algorithm: theme.darkAlgorithm,
  components: {
    Typography: {
      colorText: '#e9ecef',
    },
  },
};
