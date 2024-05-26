import 'core-js/stable'; // polyfilling everything else
import 'regenerator-runtime/runtime'; //polyfilying async await
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationVIew from './views/paginationVIew.js';
import bookmarksView from './views/bookmarks.js';
import addRecipeView from './views/addRecipeView.js';

// if (module.hot) {
//   module.hot.accept();
// }
const controlRecipes = async function () {
  try {
    //making the Id to work
    const id = window.location.hash.slice(1);
    // Ensure you have the habbit of using GuardClause
    if (!id) return;
    /// loading Recipe
    recipeView.renderSpinner();

    // 1. update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());

    ///2. updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //3. loading recipe
    await model.loadRecipe(id);

    ///4. rendering the Recipe

    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    /// 1. Getting search Query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load search results
    await model.loadSearchResults(query);
    //3. Render results
    //all the results on the page
    // resultsView.render(model.state.search.results);

    //getting only some amount of the results
    resultsView.render(model.getSearchResultsPage());

    /// 4 Render initial Pagination buttons
    paginationVIew.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// controlSearchResults();

const controlPagination = function (goToPage) {
  //1. Render New results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2. Render New Pagination buttons
  paginationVIew.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);
  //update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1) Add/remove  bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //2) update recipe view
  recipeView.update(model.state.recipe);

  // 3)  Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe Data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render Recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // Render bookmarkview
    bookmarksView.render(model.state.bookmarks);

    //change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(' 💥💥💥', err);
    addRecipeView.renderError(err.message);
  }
};
const innit = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationVIew.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
innit();
// window.addEventListener('hashchange', controlRecipes);
// // listening on the Load Event
// window.addEventListener('load', controlRecipes);
