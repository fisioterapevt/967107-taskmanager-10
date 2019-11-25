import {createHeaderTemplate} from './components/header';
import {createFilterTemplate} from './components/filter';
import {createBoardTemplate} from './components/board';
import {createEditTaskTemplate} from './components/edit-task';
import {createTaskTemplate} from './components/task';
import {createButtonLoadMoreTemplate} from './components/button-load-more';


const TASK_COUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, createHeaderTemplate());
render(siteMainElement, createFilterTemplate());
render(siteMainElement, createBoardTemplate());

const taskListElement = siteMainElement.querySelector(`.board__tasks`);
render(taskListElement, createEditTaskTemplate());
render(taskListElement, createTaskTemplate());

new Array(TASK_COUNT)
  .fill(``)
  .forEach(() => render(taskListElement, createTaskTemplate()));

const boardElement = siteMainElement.querySelector(`.board`);
render(boardElement, createButtonLoadMoreTemplate());
