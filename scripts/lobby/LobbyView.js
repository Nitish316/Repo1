define([
    'backbone',
    'text!lobby/lobby.html',
    'handlebars',
    'jquery',
    'EventManager',
    'page/PageView',
    'imagesDisplay/ImagesDisplayView',
    'imagesDisplay/ImagesDisplayModel',
    'gallery/GalleryView',
    'Utility'
], function(Backbone, templateHtml, hb, $, EventManager, PageView, ImagesDisplayView, ImagesDisplayModel, GalleryView, Utility){
    var PanelView = Backbone.View.extend({
        initialize: function(){
            this.template = Handlebars.compile(templateHtml);
            this.listenTo(this.model, 'change', this.render, this);
            this.render();
            this.pageView = new PageView({el: $('#page')});
            this.imagesDisplayModel = new ImagesDisplayModel();
            this.imagesDisplayView = new ImagesDisplayView({el: $('.imagesDisplay'), model: this.imagesDisplayModel});
            this.galleryView = new GalleryView({el: $('.gallery')});
            this.topNavMouseEnter = false;
            Utility.preLoadImages('header/');
            this.initImagesRotation();
        },
        events: {
            'click .upperNav li': 'setActive',
            'mouseover #topNav li': 'addAnimation',
            'mouseenter #topNav li': 'addAnimation',
            'mouseover .projects': 'showDropdown',
            'mouseover #projectsDropdown': 'showDropdown',
            'mouseout .projects': 'hideDropdown',
            'mouseout #projectsDropdown': 'hideDropdown',
            'click .projectsDropdown li': 'showProject',
            'click .galleryNav': 'openGallery'
        },
        setActive: function(e) {
            $('.active-link').removeClass("active-link");
            var target = $(e.target);
            if(target.has('span').length == 0) {
                target = target.parent().parent();
            } else if(target.has('div').length == 0) {
                target = target.parent();
            }
            Utility.navigate(target.find('div')[0].attributes.href.value);
            target.addClass('active-link');
        },
        initImagesRotation: function(){
            var el = this.$el.find('.header-image');
            var self = this;
            $(el).addClass('transitions');
            setInterval(function(){
                var image = Utility.getRandomHeaderImage();
                $(el).addClass("fadeOut");
                $(el).css('background', 'url(ceConImages/header/' + image + ') no-repeat');
                clearTimeout(self.rotationTimeout);
                self.rotationTimeout = setTimeout(function(){
                    $(el).removeClass("fadeOut");
                }, 150);
            }, 5000);
        },
        addAnimation: function(e){
            var self = this;
            var el = e.target;
            if($(el).parent().hasClass('page-collection')){
                el = $(el).parent();
            } else if($(el).find('.page-collection').length != 0){
                el = $(el).find('.page-collection');
//                el = el[el.length - 1];
            }
            if(!el){
                return;
            }
            $(el).addClass('pulse');
            this.animationExitTimeout = setTimeout(function(){
                $(el).removeClass('pulse');
                clearTimeout(self.animationExitTimeout);
            }, 600);
        },
        enableAnimation: function(e){
            var self = this;
            this.currentTarget;
            if(this.$el.find('.page-collection').find(e.target) != undefined){
                if(this.currentTarget != e.target || !this.topNavMouseEnter){
                    this.currentTarget = e.target;
                    self.addAnimation(e.target);
                }
                this.topNavMouseEnter = true;
            }
        },
        disableAnimation: function(){
            this.topNavMouseEnter = false;
            this.$el.find('.page-collection').off('mouseenter');
        },
        checkForAnimation: function(e){
            console.log(e)
        },
        render: function(){
            // Get data from model. Create html from template.  Attach to dom.
            var data = {
                title: this.model.get('title')
            };
            var html = this.template(this.model.toJSON());
            var self = this;
            $(this.el).html(html);
            this.$el.find('.page-collection').addClass('animated');
        },
        showToolbar: function(e, el, type){
            if(el.hasClass('highlightedCanvas') || !el.children()[0]){
                return;
            }
            var self = this;
            $(el).css('border','6px solid')
            $(el).css('border-color','sienna')
            $(el).addClass('highlightedCanvas');
            EventManager.trigger('showToolbar', type, el);

            $(document).on('keydown', function(e){
                if(e.keyCode == '27'){
                    self.hideToolbar(e, el, type);
                }
            })
            $('.canvasContainer').on('mousedown', function(e){
                self.hideToolbar(e, el, type);
            })
        },
        hideToolbar: function(e, el, type){
            if(!el.hasClass('highlightedCanvas') || ($(e.target).attr('class') && $(e.target).attr('class').indexOf('toolsOverlay') != -1) || $('.toolsOverlay').find(e.target).length != 0){
                return;
            }
            $(el).removeClass('highlightedCanvas');
            $(el).css('border','')

            $(document).off('keydown');
            EventManager.trigger('hideToolbar', type);
        },
        showDropdown: function(){
            this.dropdownEnter = true;
            var self = this;
            setTimeout(function () {
                if(self.dropdownEnter){
                    $('.dropdown').addClass('show');
                }
            }, 100)
        },
        hideDropdown: function(){
            var self = this;
            self.dropdownEnter = false;
            setTimeout(function () {
                if(!self.dropdownEnter){
                    $('.dropdown').removeClass('show');
                }
            }, 250)
        },
        showProject: function(event){
            EventManager.trigger('changeProject', event, event.target.id);
            Utility.navigate('#projects');
        },
        openGallery: function(){
            EventManager.trigger('openGallery');
        }
    });

    return PanelView;
});