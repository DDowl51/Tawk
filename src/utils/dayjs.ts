import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');
export const dateTo = (dateStr: string) => dayjs().to(dayjs(dateStr));
