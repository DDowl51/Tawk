import { Row, Tag } from 'antd';
import { FC } from 'react';
import { capitalize } from '../utils';

type ShortcutProps = {
  shortcut: string | string[];
};

const macKeyMap = (key: string) => {
  switch (key) {
    case 'Ctrl':
    case 'ctrl':
      return 'Control';
    case 'win':
    case 'windows':
    case 'Windows':
    case 'Win':
      return 'Option';
    case 'Alternative':
    case 'alternative':
    case 'alt':
    case 'Alt':
      return 'Command';
    default:
      return key;
  }
};

const winKeyMap = (key: string) => {
  switch (key) {
    case 'Control':
    case 'control':
      return 'Ctrl';
    case 'Opt':
    case 'opt':
    case 'option':
    case 'Option':
      return 'Win';
    case 'cmd':
    case 'Cmd':
    case 'command':
    case 'Command':
      return 'Alt';
    default:
      return key;
  }
};

const Shortcut: FC<ShortcutProps> = ({ shortcut }) => {
  let keys = Array.isArray(shortcut) ? shortcut : shortcut.split('+');
  keys = keys.map(key => capitalize(key));

  // macOS support
  const userAgent =
    typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;

  const isMac = userAgent.indexOf('Mac') !== -1;

  if (isMac) keys = keys.map(key => macKeyMap(key));
  else keys = keys.map(key => winKeyMap(key));

  return (
    <Row>
      {keys.map(key => (
        <Tag key={key} style={{ userSelect: 'none' }}>
          {key}
        </Tag>
      ))}
    </Row>
  );
};

export default Shortcut;
