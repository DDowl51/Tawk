import { Result, theme } from 'antd';

const NotFound = () => {
  const { token } = theme.useToken();

  return (
    <Result
      status='404'
      title='404'
      subTitle='Sorry, the page you visited does not exist.'
      style={{ backgroundColor: token.colorBgBase, height: '100vh' }}
    />
  );
};

export default NotFound;
