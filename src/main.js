import BoardComponent from './components/board';
import BoardController from './controllers/board.js';
import HeaderComponent from './components/header';
import FilterComponent from './components/filter';
import {generateTasks} from './mock/task';
import {generateFilters} from './mock/filter.js';
import {render, RenderPosition} from './utils/elements';

const TASKS_COUNT = 23;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, new HeaderComponent(), RenderPosition.BEFOREEND);

const filters = generateFilters();
render(siteMainElement, new FilterComponent(filters), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);

const tasks = generateTasks(TASKS_COUNT);

const boardController = new BoardController(boardComponent);

boardController.render(tasks);

