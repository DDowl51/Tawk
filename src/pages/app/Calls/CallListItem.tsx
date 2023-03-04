import { Button, Row, Space, theme, Typography } from 'antd';
import Icon from '@ant-design/icons';
import { ArrowDownLeft, ArrowUpRight, Phone } from 'phosphor-react';
import { FC } from 'react';
import { CallLogType } from '../../../data';
import Avatar from '../../../components/Avatar';

type CallListItemProps = {
  item: CallLogType;
};

const CallListItem: FC<CallListItemProps> = ({ item }) => {
  const { token } = theme.useToken();

  return (
    <Row
      wrap={false}
      style={{
        backgroundColor: token.colorBgContainer,
        padding: 12,
        borderRadius: 8,
      }}
      justify='space-between'
      align='middle'
    >
      <Row align='middle' style={{ gap: 8 }}>
        <Avatar online={item.online} src={item.img} alt={item.name} />
        <Space direction='vertical' size={2}>
          <Typography.Text style={{ fontWeight: 'bold', lineHeight: 1 }}>
            {item.name}
          </Typography.Text>
          <Row>
            <Icon
              component={() =>
                item.incoming ? (
                  <ArrowDownLeft
                    color={item.missed ? token.colorError : token.colorSuccess}
                    size={16}
                  />
                ) : (
                  <ArrowUpRight
                    color={item.missed ? token.colorError : token.colorSuccess}
                    size={16}
                  />
                )
              }
            />
            <Typography.Text
              type='secondary'
              style={{ fontWeight: 'bold', fontSize: 12, lineHeight: 1 }}
            >
              {item.time}
            </Typography.Text>
          </Row>
        </Space>
      </Row>

      <Row>
        <Button
          shape='circle'
          size='large'
          type='text'
          icon={<Icon component={() => <Phone color={token.colorSuccess} />} />}
        />
      </Row>
    </Row>
  );
};

export default CallListItem;
