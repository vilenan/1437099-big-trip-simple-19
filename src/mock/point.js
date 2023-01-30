import {CITIES, DESCRIPTION, OFFER_TITLE, PHOTO, POINT_TYPE} from './const.js';
import {getRandomArrayElement, getRandomNumber} from '../utils.js';
import {nanoid} from 'nanoid';

const POINT_COUNT = 4;

function getPictureSrc() {
  return `${PHOTO}${Math.random()}`;
}

function getPicture() {
  return {
    src: getPictureSrc(),
    description: getRandomArrayElement(DESCRIPTION)
  };
}

function getDestinationDescription() {
  const phrase = [];
  const phraseLength = Math.random() * 5;
  for(let i = 0; i < phraseLength; i++) {
    phrase.push(getRandomArrayElement(DESCRIPTION));
  }
  return `${phrase.join('. ')}.`;
}

const destinationsArray = CITIES.map((city, index) => ({
  id : index,
  description: getDestinationDescription(),
  name: city,
  pictures: Array.from({length: 4}, getPicture),
}));

const getOffersArray = OFFER_TITLE.map((title, index) => ({
  id: index,
  title: title,
  price: getRandomNumber(30, 120)
}));

const offersByType = POINT_TYPE.map((type) => ({
  type:type,
  offers: getOffersArray.slice(getRandomNumber(0, getOffersArray.length + 1)),
}));

function getOffersByType(type, arr = offersByType) {
  return arr.find((offer) => (offer.type === type));
}

function getOffersIdByType(type, arr = offersByType) {
  const offersForType = getOffersByType(type, arr);
  return offersForType.offers.map((offer) => (offer.id));
}

function getRandomMockPoint() {
  const pointType = getRandomArrayElement(POINT_TYPE);
  return {
    id: nanoid(),
    basePrice: getRandomNumber(100, 1200),
    dateFrom: new Date(2021, getRandomNumber(1, 12), getRandomNumber(1, 30), getRandomNumber(0, 24), 24, 0),
    dateTo: new Date(getRandomNumber(2022, 2023), getRandomNumber(1, 12), getRandomNumber(1, 30), getRandomNumber(0, 24), 24, 0),
    destination: getRandomArrayElement(destinationsArray),
    type: pointType,
    offers: getOffersIdByType(pointType, offersByType).slice(getRandomNumber(0, getOffersIdByType.length + 1)),
  };
}

function getRandomMockPoints() {
  return Array.from({length: POINT_COUNT}, getRandomMockPoint);
}

export {getRandomMockPoints, offersByType, getOffersArray, POINT_TYPE, destinationsArray, getOffersByType};
