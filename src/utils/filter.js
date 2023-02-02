import dayjs from 'dayjs';
import {FilterType} from '../const.js';

const isFutureTask = (dateFrom, dateTo) => dayjs().isBefore(dayjs(dateFrom)) || dayjs().isSame(dayjs(dateFrom), 'day') || (dayjs().isAfter(dayjs(dateFrom)) && dayjs().isBefore(dayjs(dateTo)));

const filters = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFutureTask(point.dateFrom, point.dateTo)),
};

export {filters};
