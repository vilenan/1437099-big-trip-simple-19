import dayjs from 'dayjs';
// const DATE_FORMAT = 'DD/MM/YY HH:mm';
const SHORT_DATE_FORMAT = 'HH:mm';
// function formattingDate(date){
//   return date ? dayjs(date).format(DATE_FORMAT) : '';
// }

function getRandomNumber(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function formattingShortDate(date){
  return date ? dayjs(date).format(SHORT_DATE_FORMAT) : '';
}
function getRandomArrayElement(items){
  return items[Math.floor(Math.random() * items.length)];
}

function generateId(){
  let id = 0;
  function addId(){
    id++;
    return id;
  }
  return addId;
}

export {getRandomArrayElement, generateId, formattingShortDate, getRandomNumber};
