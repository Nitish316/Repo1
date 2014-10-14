define([
    'backbone'
], function(Backbone){
    var PlayerModel = Backbone.Model.extend({
        defaults: {
            title: 'CE CON \n ENGG',
            headerImage: 'tech8.jpg',
            appData: {}
        }
    });

    return PlayerModel;
});