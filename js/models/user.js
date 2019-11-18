var app = app || {};

(function () {
  app.User = Backbone.Model.extend({
    defaults: {
      name: '',
      phone: '',
      isEdit: false,
    },
  });
})();
