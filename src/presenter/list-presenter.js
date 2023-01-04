import { render } from '../framework/render.js';
import PointsListView from '../view/points-list-view.js';
import SortView from '../view/sort-view.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';


export default class ListPresenter {
  #listComponent = new PointsListView();
  #sortComponent = new SortView();
  #emptyListComponent = new EmptyListView();
  #pointsContainer = null;
  #pointsModel = null;
  #listPoints = [];
  #pointPresenters = new Map();

  constructor({pointsContainer, pointsModel}) {
    this.#pointsContainer = pointsContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#listPoints = [...this.#pointsModel.points];

    if (this.#listPoints.length === 0) {
      this.#renderEmptyList();
    } else {
      this.#renderPointsList();
      this.#renderSort();
      this.#listPoints.forEach((point) => {
        this.#renderPoint(point);
      });
    }
  }

  #renderPointsList(){
    render(this.#listComponent, this.#pointsContainer);
  }

  #renderSort() {
    render(this.#sortComponent, this.#listComponent.element);
  }

  #renderEmptyList(){
    render(this.#emptyListComponent, this.#pointsContainer);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({listComponent: this.#listComponent.element, onModeChange: this.#handleModeChange});
    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #handleModeChange = ()=> {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
