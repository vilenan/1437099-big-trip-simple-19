import {POINT_TYPE, CITIES, PHOTO, DESCRIPTION, OFFER_TITLE} from '../const.js';
import {getRandomArrayElement, generateId, getRandomNumber} from '../utils.js';

const getId = generateId();

function getPictureSrc(){
  return `${PHOTO}+${Math.random()}`;
}

function getPicture(){
  const pictures = {};
  pictures.src = getPictureSrc();
  pictures.description = getRandomArrayElement(DESCRIPTION);
  return pictures;
}

function getDestinationDescription(){
  const phrase = [];
  const phraseLength = Math.random() * 5;
  for(let i = 0; i < phraseLength; i++){
    phrase.push(getRandomArrayElement(DESCRIPTION));
  }
  return `${phrase.join('. ')}.`;
}

function getRandomMockDestination(){
  const id = getId();
  return {
    id,
    description: getDestinationDescription(),
    name: getRandomArrayElement(CITIES),
    pictures: Array.from({length: 4}, getPicture),
  };
}

function getMockOffer(){
  const id = getId();
  return {
    id,
    title: OFFER_TITLE[id],
    price: getRandomNumber(30, 120)
  };
}

const getOffersArray = Array.from({length: OFFER_TITLE.length - 1}, getMockOffer);

const offersByType = [
  {
    type: 'taxi',
    offers: getOffersArray.slice(2, 5),
  },
  {
    type: 'bus',
    offers: getOffersArray,
  },
  {
    type: 'train',
    offers: getOffersArray.slice(3),
  },
  {
    type: 'ship',
    offers: getOffersArray.slice(5),
  },
  {
    type: 'drive',
    offers: getOffersArray,
  },
  {
    type: 'flight',
    offers: getOffersArray.slice(2),
  },
  {
    type: 'check-in',
    offers: getOffersArray,
  },
  {
    type:  'sightseeing',
    offers: getOffersArray.slice(1, 4),
  },
  {
    type:  'restaurant',
    offers: getOffersArray,
  },
];

function getRandomMockPoint(){
  const id = getId();
  return {
    id,
    basePrice: getRandomNumber(100, 1200),
    dateFrom: new Date('2019-07-10T22:55:56.845Z'),
    dateTo: new Date('2019-07-11T11:22:13.375Z'),
    destination: getRandomMockDestination(),
    type: getRandomArrayElement(POINT_TYPE),
    offers: [getOffersArray[1].id, getOffersArray[2].id]
  };
}

export {getRandomMockPoint, offersByType, getOffersArray};
