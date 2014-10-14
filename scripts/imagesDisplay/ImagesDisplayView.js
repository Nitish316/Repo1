define([
    'backbone',
    'text!imagesDisplay/imagesDisplay.html',
    'handlebars',
    'jquery',
    'EventManager',
    'page/PageView'
], function(Backbone, templateHtml, hb, $, EventManager, PageView){
    var ImagesDisplayView = Backbone.View.extend({
        initialize: function(){
            this.template = Handlebars.compile(templateHtml);
            this.render();
        },
        events: {
            'click .displayImage': 'showGallery'
        },
        showGallery: function(e){
            EventManager.trigger('openGallery', e.target.attributes.imageid.value);
        },
        render: function(){
            // Get data from model. Create html from template.  Attach to dom.
            var data = {
                imageUrl1: this.model.get('imageUrl1').url,
                imageId1: this.model.get('imageUrl1').id,
                imageUrl2: this.model.get('imageUrl2').url,
                imageId2: this.model.get('imageUrl2').id,
                imageUrl3: this.model.get('imageUrl3').url,
                imageId3: this.model.get('imageUrl3').id
            };
            var html = this.template(data);
            $(this.el).html(html);
        }
    });

    return ImagesDisplayView;
});