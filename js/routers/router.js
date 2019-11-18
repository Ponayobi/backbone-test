var app = app || {};

(function () {
  const Router = Backbone.Router.extend({});
  app.Router = new Router();

  Backbone.history.start();
})();
