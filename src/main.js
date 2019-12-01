import {createHeaderTemplate} from './components/header';
import {createFilterTemplate} from './components/filter';
import {createBoardTemplate} from './components/board';
import {createEditTaskTemplate} from './components/edit-task';
import {createTaskTemplate} from './components/task';
import {createButtonLoadMoreTemplate} from './components/button-load-more';
import {generateTasks} from './mock/task';
import {generateFilters} from './mock/filter.js';


const TASKS_COUNT = 23;
const COUNT_TASKS_AT_FIRST = 8;
const COUNT_TASKS_LOAD_MORE = 8;


const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, createHeaderTemplate());

const filters = generateFilters();
render(siteMainElement, createFilterTemplate(filters));
render(siteMainElement, createBoardTemplate());

const taskListElement = siteMainElement.querySelector(`.board__tasks`);
const tasks = generateTasks(TASKS_COUNT);

render(taskListElement, createEditTaskTemplate(tasks[0]));

// show first 7 tasks
let showingTasksCount = COUNT_TASKS_AT_FIRST;
tasks.slice(1, showingTasksCount).forEach((task) => render(taskListElement, createTaskTemplate(task)));


const boardElement = siteMainElement.querySelector(`.board`);
render(boardElement, createButtonLoadMoreTemplate());

// show more tasks
const loadMoreButton = boardElement.querySelector(`.load-more`);

loadMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount = showingTasksCount + COUNT_TASKS_LOAD_MORE;

  tasks.slice(prevTasksCount, showingTasksCount)
    .forEach((task) => render(taskListElement, createTaskTemplate(task)));

  if (showingTasksCount >= tasks.length) {
    loadMoreButton.remove();
  }
});
