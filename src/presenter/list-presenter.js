import { render } from '../framework/render.js';
import PointsListView from '../view/points-list-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
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
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        replaceFormTOCard.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView({
      point,
      onClick: () => {
        replaceCardToForm.call(this);
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const editPointComponent = new EditPointView({
      point,
      onSubmit: () => {
        replaceFormTOCard.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceCardToForm() {
      this.#listComponent.element.replaceChild(editPointComponent.element, pointComponent.element);
    }

    function replaceFormTOCard() {
      this.#listComponent.element.replaceChild(pointComponent.element, editPointComponent.element );
    }

    render(pointComponent, this.#listComponent.element);
  }
}
