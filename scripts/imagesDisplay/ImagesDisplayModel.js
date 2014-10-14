define([
    'backbone'
], function(Backbone){
    var ImagesDisplayModel = Backbone.Model.extend({
        defaults: {
            imageUrl1: {'url':'../ceConImages/preview/tech11.png', 'id': '11'},
            imageUrl2: {'url':'../ceConImages/tech2.png', 'id': '2'},
            imageUrl3: {'url':'../ceConImages/preview/tech6.png', 'id': '6'}
        }
    });

    return ImagesDisplayModel;
});