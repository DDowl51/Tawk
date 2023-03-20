import { useCallback } from 'react';
import toast, { Renderable, ToastOptions } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { selectSettings } from 'store/settings/settings.slice';

const useNotification = () => {
  const {
    notification: { enabled, position, duration },
  } = useSelector(selectSettings);

  const notify = useCallback(
    (
      message: Renderable,
      type: 'success' | 'error' | 'blank',
      icon?: Renderable
    ) => {
      if (!enabled) return;

      const config: ToastOptions = {
        position,
        duration,
      };
      if (icon) config.icon = icon;

      switch (type) {
        case 'success':
          toast.success(message, config);
          break;
        case 'error':
          toast.error(message, config);
          break;
        case 'blank':
        default:
          toast(message, config);
      }
    },
    [duration, enabled, position]
  );

  return { notify };
};

export default useNotification;
