import dayjs from 'dayjs';

const DATE_FORMAT = 'DD/MM/YY HH:mm';
const SHORT_DATE_FORMAT = 'HH:mm';
const DAY_DATE_FORMAT = 'MMM D';

function formattingShortDate(date) {
  return date ? dayjs(date).format(SHORT_DATE_FORMAT) : '';
}

function formattingFullDate(date) {
  return date ? dayjs(date).format(DATE_FORMAT) : '';
}

function formattingDayDate(date) {
  return date ? dayjs(date).format(DAY_DATE_FORMAT) : '';
}

function sortPointsPriceDown(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

function sortPointsDateUp(pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(pointB.dateFrom);
}

function getOffersByType(type, arr) {
  return arr.find((offer) => (offer.type === type));
}

export { formattingShortDate, formattingFullDate, formattingDayDate, sortPointsPriceDown, sortPointsDateUp, getOffersByType, };

