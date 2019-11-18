var app = app || {};

(function () {
  app.UserItemView = Backbone.View.extend({

    template: _.template(document.getElementById('user-item-template').innerText),

    events: {
      'click .user--edit': 'editUser',
      'click .user--submit': 'submitUser',
      'click .user--remove': 'removeUser',
      'click .user--cancel': 'cancelUser',
    },

    initialize: function () {
      this.hasModel = !!this.model;

      if (this.hasModel) {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
      }
    },

    render: function () {
      if (!this.model) {
        this.$el.html(this.template({ isEdit: false, hasModel: this.hasModel, phone: '', name: '' }));
        return this;
      }
      // Backbone LocalStorage is adding `id` attribute instantly after
      // creating a model.  This causes our TodoView to render twice. Once
      // after creating a model and once on `id` change.  We want to
      // filter out the second redundant render, which is caused by this
      // `id` change.  It's known Backbone LocalStorage bug, therefore
      // we've to create a workaround.
      // https://github.com/tastejs/todomvc/issues/469
      if (this.model.changed.id !== undefined) {
        return;
      }

      this.$el.html(this.template({...this.model.toJSON(), hasModel: this.hasModel }));
      return this;
    },

    // простите, трогаю backbone первый раз - понимаю что флагам не место в модели =(
    resetEditFlags: function () {
      app.UserList.forEach(function(model) {
        model.save({ isEdit: false });
      });
    },

    editUser: function () {
      this.resetEditFlags();
      this.model.save({ isEdit: true });
      this.$el.addClass('editing');
    },

    cancelUser: function () {
      this.model.set('isEdit', false);
    },

    removeUser: function () {
      this.model.destroy({
        ajaxSync: true  // Pushes back to the server
      });
    },

    validateUserName: function(name) {
      return /^(?!\s*$).+/.test(name);
    },

    validateUserPhone: function(phone) {
      return /^((\+7|7|8)+([0-9]){10})$/.test(phone);
    },

    submitUser: function () {
      const inputName = this.el.getElementsByClassName('user--name')[0];
      const inputPhone = this.el.getElementsByClassName('user--phone')[0];

      inputName.classList.remove('error');
      inputPhone.classList.remove('error');
      const name = inputName.value;
      const phone = inputPhone.value;


      const isValidName = this.validateUserName(name);
      const isValidPhone = this.validateUserPhone(phone);

      if (!isValidName) {
        inputName.classList.add('error');
        return;
      }

      if (!isValidPhone) {
        inputPhone.classList.add('error');
        return;
      }

      const newUser = {
        isEdit: false,
        name,
        phone,
      };

      if (!this.hasModel) {
        newUser.order = app.UserList.nextOrder();
        app.UserList.create(newUser, {
          ajaxSync: true  // Pushes back to the server
        });
        inputName.value = '';
        inputPhone.value = '';
        return;
      }

      const { order, ...oldUser } = this.model.toJSON();
      newUser.order = order;

      if (_.isEqual(oldUser, newUser)) {
        delete newUser.name;
        delete newUser.phone;
      }


      this.model.save(newUser, {
        ajaxSync: true  // Pushes back to the server
      });
    },
  });
})();
