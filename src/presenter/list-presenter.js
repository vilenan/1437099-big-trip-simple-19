import {render} from '../render.js';
import PointsListView from '../view/points-list-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import AddNewPointView from '../view/add-new-point-view.js';
import PointEditView from '../view/point-edit-view.js';

export default class ListPresenter{
  listComponent = new PointsListView();
  constructor({listContainer, pointsModel}) {
    this.listContainer = listContainer;
    this.pointsModel = pointsModel;
  }

  init(){
    //временное решение, уберем после прокачки модели.
    //копируем все данные модели в презентер
    this.listPoints = [...this.pointsModel.getPoints()];
    render(this.listComponent, this.listContainer);
    render(new SortView(), this.listComponent.getElement());
    render(new PointEditView(), this.listComponent.getElement());
    for (let i = 1; i < this.listPoints.length; i++) {
      render(new PointView({point: this.listPoints[i]}), this.listComponent.getElement());
    }
    render(new AddNewPointView({point: this.listPoints[0]}), this.listComponent.getElement());
  }
}
