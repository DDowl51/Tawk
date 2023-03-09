import { ConfigProvider } from 'antd';
import useMessage from 'antd/es/message/useMessage';

import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import { SetSnackbar } from 'store/ui/ui.action';
import { selectUI } from 'store/ui/ui.slice';
import { darkTheme, lightTheme } from './config';
import Router from './routes';
import { selectSettings } from './store/settings/settings.slice';

const App = () => {
  const { theme } = useSelector(selectSettings);
  const dispatch = useDispatch<AppDispatch>();

  const themeConfig = useMemo(
    () => (theme.mode === 'dark' ? darkTheme : lightTheme),
    [theme.mode]
  );

  const { snackbar } = useSelector(selectUI);
  const [messageApi, contextHolder] = useMessage();

  useEffect(() => {
    if (snackbar.open) {
      messageApi[snackbar.type](snackbar.message);
      dispatch(SetSnackbar(false));
    }
  }, [snackbar.open, snackbar.message, snackbar.type, messageApi, dispatch]);

  return (
    <ConfigProvider theme={themeConfig(theme.colorPrimary)} locale={zhCN}>
      <Router />
      {contextHolder}
    </ConfigProvider>
  );
};
export default App;
