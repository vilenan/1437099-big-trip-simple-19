import dayjs from 'dayjs';
import {FilterType} from './const.js';

const DATE_FORMAT = 'DD/MM/YY HH:mm';
const SHORT_DATE_FORMAT = 'HH:mm';

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function formattingShortDate(date) {
  return date ? dayjs(date).format(SHORT_DATE_FORMAT) : '';
}

function formattingFullDate(date) {
  return date ? dayjs(date).format(DATE_FORMAT) : '';
}
function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function generateId() {
  let id = 0;
  function addId() {
    id++;
    return id;
  }
  return addId;
}

const isFutureTask = (dateFrom, dateTo) => dayjs().isBefore(dayjs(dateFrom)) || dayjs().isSame(dayjs(dateFrom), 'day') || (dayjs().isAfter(dayjs(dateFrom)) && dayjs().isBefore(dayjs(dateTo)));

const filters = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFutureTask(point.dateFrom, point.dateTo)),
};

function generateFilter(points) {
  return Object.entries(filters).map(
    ([filterName, filteredPoints]) => ({
      name: filterName,
      count: filteredPoints(points).length,
    }),
  );
}

export { getRandomArrayElement, generateId, formattingShortDate, getRandomNumber, formattingFullDate, generateFilter };
