import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export const dateTo = (dateStr: string) => dayjs().to(dayjs(dateStr));
