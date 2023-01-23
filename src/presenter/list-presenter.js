import {render} from '../framework/render.js';
import PointsListView from '../view/points-list-view.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import {SortType} from '../const.js';
import {sortPointsDateUp, sortPointsPriceDown} from '../utils.js';


export default class ListPresenter {
  #listComponent = new PointsListView();
  #sortComponent = null;
  #emptyListComponent = new EmptyListView();
  #pointsContainer = null;
  #pointsModel = null;
  #pointPresenters = new Map();
  #currentSortType = null;

  constructor({pointsContainer, pointsModel}) {
    this.#pointsContainer = pointsContainer;
    this.#pointsModel = pointsModel;
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.DATE_UP:
        return [...this.#pointsModel.points].sort(sortPointsDateUp);
      case SortType.PRICE_DOWN:
        return [...this.#pointsModel.points].sort(sortPointsPriceDown);
    }
    return this.#pointsModel.points;
  }

  set points(updatePoints) {
    this.#pointsModel.points = updatePoints;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  init() {
    if (this.points.length === 0) {
      this.#renderEmptyList();
    } else {
      this.#renderPointsList();
      this.#currentSortType = SortType.DATE_UP;
      this.#renderSort();
      this.#renderPoints();
    }
  }

  #renderPointsList(){
    render(this.#listComponent, this.#pointsContainer);
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortChange: this.#handleSortChange,
      currentSort: this.#currentSortType,
    });
    render(this.#sortComponent, this.#listComponent.element);
  }

  #renderEmptyList(){
    render(this.#emptyListComponent, this.#pointsContainer);
  }

  #renderPoint(point, destinations) {
    const pointPresenter = new PointPresenter({
      listComponent: this.#listComponent.element,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handleViewAction,
    });
    pointPresenter.init(point, destinations);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    const destinations = this.destinations;
    this.points.forEach((point) => {
      this.#renderPoint(point, destinations);
    });
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortChange = (sortType) => {
    if(this.#currentSortType === sortType) {
      return;
    }
    this.#clearPointList();
    this.#currentSortType = sortType;
    this.#renderPoints();
  };

  handleFilterChange = (filter) => {
    this.#clearPointList();
    this.points = filter;
    this.#renderPoints();
  };

  // #handlePointChange = (updatedPoint) => {
  //   this.points = updateItem(this.points, updatedPoint);
  //   this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  // };

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
  };

  #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);
  };
}
