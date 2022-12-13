import {render} from '../render.js';
import PointsListView from '../view/points-list-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import AddNewPointView from '../view/add-new-point-view.js';
import PointEditView from '../view/point-edit-view.js';

export default class ListPresenter{
  listComponent = new PointsListView();
  constructor({listContainer}) {
    this.listContainer = listContainer;
  }

  init(){
    render(this.listComponent, this.listContainer);
    render(new SortView(), this.listComponent.getElement());
    render(new PointEditView(), this.listComponent.getElement());
    for(let i = 0; i < 3; i++) {
      render(new PointView(), this.listComponent.getElement());
    }
    render(new AddNewPointView(), this.listComponent.getElement());
  }
}
