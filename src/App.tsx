import { ConfigProvider } from 'antd';

import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import { useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { darkTheme, lightTheme } from './config';
import Router from './routes';
import { selectSettings } from './store/settings/settings.slice';

const App = () => {
  const { theme } = useSelector(selectSettings);

  const themeConfig = useMemo(
    () => (theme.mode === 'dark' ? darkTheme : lightTheme),
    [theme.mode]
  );

  return (
    <ConfigProvider theme={themeConfig(theme.colorPrimary)} locale={zhCN}>
      <Router />
      <Toaster reverseOrder />
    </ConfigProvider>
  );
};
export default App;
