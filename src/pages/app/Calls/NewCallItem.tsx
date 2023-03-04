import { Button, Row, Space, theme, Typography } from 'antd';
import { FC } from 'react';
import Icon from '@ant-design/icons';

import { MemberType } from '../../../data';
import Avatar from '../../../components/Avatar';
import { Phone, VideoCamera } from 'phosphor-react';

type NewCallItemProps = {
  item: MemberType;
};

const NewCallItem: FC<NewCallItemProps> = ({ item }) => {
  const { token } = theme.useToken();

  return (
    <Row
      wrap={false}
      style={{
        backgroundColor: token.colorBgContainer,
        padding: 12,
        borderRadius: 12,
        border: `1px solid ${token.colorBorderSecondary}`,
      }}
      justify='space-between'
      align='middle'
    >
      <Row justify='space-between' align='middle' style={{ gap: 8 }}>
        <Avatar online={item.online} src={item.img} alt={item.name} />
        <Typography.Text style={{ fontWeight: 'bold', lineHeight: 1 }}>
          {item.name}
        </Typography.Text>
      </Row>

      <Row>
        <Button
          size='large'
          shape='circle'
          type='text'
          icon={<Icon component={() => <Phone color={token.colorSuccess} />} />}
        />
        <Button
          size='large'
          shape='circle'
          type='text'
          icon={
            <Icon
              component={() => <VideoCamera color={token.colorSuccess} />}
            />
          }
        />
      </Row>
    </Row>
  );
};

export default NewCallItem;
