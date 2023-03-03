import { ConfigProvider } from 'antd';
import 'dayjs/locale/zh-cn';
import { useSelector } from 'react-redux';
import { darkTheme, lightTheme } from './config';
import Router from './routes';
import { selectSettings } from './store/settings/settings.slice';

const App = () => {
  const { theme } = useSelector(selectSettings);

  return (
    <ConfigProvider theme={theme.mode === 'dark' ? darkTheme : lightTheme}>
      <Router />
    </ConfigProvider>
  );
};
export default App;
