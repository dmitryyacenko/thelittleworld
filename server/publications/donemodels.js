Meteor.publish('donemodels', function(){
    return Donemodels.find();
})