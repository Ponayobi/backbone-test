var app = app || {};

(function () {
  const userList = [
    {
      name: 'Alice', phone: '89998880001', order: 1, isEdit: false,
    },
    {
      name: 'Bob', phone: '89998880002', order: 2, isEdit: false,
    },
    {
      name: 'John', phone: '89998880003', order: 3, isEdit: false,
    },
    {
      name: 'Frank', phone: '89998880004', order: 4, isEdit: false,
    },
    {
      name: 'Riki', phone: '89998880005', order: 5, isEdit: false,
    },
  ];

  const UserList = Backbone.Collection.extend({
    model: app.User,
    localStorage: new Backbone.LocalStorage('alar-user'),
    nextOrder: function () {
      return this.length ? this.last().get('order') + 1 : 1;
    },
    comparator: 'order',
    url: '/api/rest/user-list',
    fetch: function() {
      this.set(userList); // fake request
    }
  });

  app.UserList = new UserList();
})();


