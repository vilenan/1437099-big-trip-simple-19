import FilterView from './view/filter-view.js';
import ListPresenter from './presenter/list-presenter.js';
import {render} from './render.js';

const siteHeader = document.querySelector('.page-header');
const filters = siteHeader.querySelector('.trip-controls__filters');
const siteMain = document.querySelector('.page-main');
const eventsContainer = siteMain.querySelector('.trip-events');
const listPresenter = new ListPresenter({listContainer:eventsContainer});

render(new FilterView(), filters);
listPresenter.init();


