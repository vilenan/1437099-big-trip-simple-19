import { render } from '../framework/render.js';
import PointsListView from '../view/points-list-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import AddNewPointView from '../view/add-new-point-view.js';
import EmptyListView from '../view/empty-list-view.js';

export default class ListPresenter {
  #listComponent = new PointsListView();

  #listContainer = null;
  #pointsModel = null;
  #listPoints = [];

  constructor({listContainer, pointsModel}) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#listPoints = [...this.#pointsModel.points];

    if (this.#listPoints.length === 0) {
      render(new EmptyListView(), this.#listContainer);
    } else {
      render(this.#listComponent, this.#listContainer);
      render(new SortView(), this.#listComponent.element);
      this.#listPoints.forEach((point) => {
        this.#renderPoint(point);
      });
    }
  }

  #renderPoint(point) {
    const pointComponent = new PointView({point});
    const addNewPointComponent = new AddNewPointView({point});

    const replaceCardToForm = () => {
      this.#listComponent.element.replaceChild(addNewPointComponent.element, pointComponent.element);
    };

    const replaceFormTOCard = () => {
      this.#listComponent.element.replaceChild(pointComponent.element, addNewPointComponent.element );
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        replaceFormTOCard();
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      replaceCardToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    });

    addNewPointComponent.element.querySelector('form').addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormTOCard();
      document.removeEventListener('keydown', escKeyDownHandler);
    });

    render(pointComponent, this.#listComponent.element);
  }
}
