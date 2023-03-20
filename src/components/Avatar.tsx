import { FC } from 'react';
import { Avatar as AntAvatar, Badge, AvatarProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const Avatar: FC<AvatarProps & { online?: boolean }> = ({
  online,
  size = 48,
  ...props
}) => {
  return (
    <Badge
      dot
      offset={[((size as number) / 48) * -18, ((size as number) / 48) * 40]}
      color='green'
      showZero={false}
      count={online ? 1 : 0}
      style={{ width: 8, height: 8 }}
    >
      <AntAvatar
        icon={<UserOutlined />}
        size={size || 48}
        src={props.src}
        alt={props.alt}
        {...props}
      />
    </Badge>
  );
};

export default Avatar;
