import { FC } from 'react';
import { Avatar as AntAvatar, Badge, AvatarProps } from 'antd';

const Avatar: FC<AvatarProps & { online?: boolean }> = ({
  online,
  ...props
}) => {
  return (
    <Badge
      dot
      offset={[-6, 42]}
      color='green'
      showZero={false}
      count={online ? 1 : 0}
      style={{ width: 8, height: 8 }}
    >
      <AntAvatar
        size={props.size || 48}
        src={props.src}
        alt={props.alt}
        {...props}
      />
    </Badge>
  );
};

export default Avatar;
