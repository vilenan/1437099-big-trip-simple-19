import {render, remove} from '../framework/render.js';
import PointsListView from '../view/points-list-view.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import {SortType, UpdateType, UserAction} from '../const.js';
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
    this.#currentSortType = SortType.DATE_UP;
    this.#renderBoard();
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortChange: this.#handleSortChange,
      currentSort: this.#currentSortType,
    });
    render(this.#sortComponent, this.#listComponent.element);
  }

  #renderBoard() {
    render(this.#listComponent, this.#pointsContainer);

    const points = this.points;
    if (points.length === 0) {
      render(this.#emptyListComponent, this.#pointsContainer);
      return;
    }

    this.#renderSort();
    this.#renderPoints();
  }

  #renderPoints() {
    const destinations = this.destinations;
    this.points.forEach((point) => {
      this.#renderPoint(point, destinations);
    });
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

  #clearBoard({resetSortType = false} = {}) {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#emptyListComponent);

    if(resetSortType) {
      this.#currentSortType = SortType.DATE_UP;
    }
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortChange = (sortType) => {
    if(this.#currentSortType === sortType) {
      return;
    }
    this.#clearBoard();
    this.#currentSortType = sortType;
    this.#renderPoints();
  };

  handleFilterChange = (filter) => {
    this.#clearBoard();
    this.points = filter;
    this.#renderPoints();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType){
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType){
      case UserAction.UPDATE_TASK:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_TASK:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this.#pointsModel.deletePoint(updateType, update);
    }
  };
}
