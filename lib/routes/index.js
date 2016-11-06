Router.route('/', {
        waitOn: function () {
            // return one handle, a function, or an array
            return [Meteor.subscribe('donemodels'), Meteor.subscribe('images')];
        },
        action: function () {
            this.render('indextmpl');
        }
    }
)