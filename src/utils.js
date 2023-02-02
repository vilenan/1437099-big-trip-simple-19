import dayjs from 'dayjs';

const DATE_FORMAT = 'DD/MM/YY HH:mm';
const SHORT_DATE_FORMAT = 'HH:mm';
const DAY_DATE_FORMAT = 'MMM D';

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function formattingShortDate(date) {
  return date ? dayjs(date).format(SHORT_DATE_FORMAT) : '';
}

function formattingFullDate(date) {
  return date ? dayjs(date).format(DATE_FORMAT) : '';
}

function formattingDayDate(date) {
  return date ? dayjs(date).format(DAY_DATE_FORMAT) : '';
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

function sortPointsPriceDown(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

function sortPointsDateUp(pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(pointB.dateFrom);
}

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

export { updateItem, getRandomArrayElement, generateId, formattingShortDate, getRandomNumber, formattingFullDate, formattingDayDate, sortPointsPriceDown, sortPointsDateUp };

