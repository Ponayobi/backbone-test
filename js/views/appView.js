var app = app || {};

(function () {
  app.AppView = Backbone.View.extend({
    el: '.app',

    events: {
      'click #add-user': 'createUser',
    },

    initialize: function () {
      this.$userList = document.getElementById('user-list');

      this.listenTo(app.UserList, 'add', this.addOne);
      this.listenTo(app.UserList, 'all', this.render);
      this.listenTo(app.UserList, 'editUser', this.editOne);

      const newUserView = new app.UserItemView();
      document.getElementById('user-create').appendChild(newUserView.render().el);

      app.UserList.fetch({ ajaxSync: true });
    },

    addOne: function (user) {
      const view = new app.UserItemView({ model: user });
      this.$userList.appendChild(view.render().el);
    },

    editOne: function(user) {
      console.log(user, 'edit');
    },
  });
})();
