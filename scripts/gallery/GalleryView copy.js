define([
    'backbone',
    'handlebars',
    'jquery',
    'EventManager',
    'text!gallery/galleryImages.json',
    'text!gallery/gallery.html',
    'router'
], function(Backbone,hb, $, EventManager, galleryImages, template, router){
    var GalleryView = Backbone.View.extend({
        initialize: function(){
            this.template = Handlebars.compile(template);
//            this.listenTo(this.model, 'change', this.render, this);
            EventManager.on('openGallery', this.openGallery, this);
            this.galleryImages = $.parseJSON(galleryImages);
            this.currentImageId = 1;
            this.render();
            this.renderImage();
            this.$el.find('.galleryImg').addClass('transitions');
        },
        events: {
            'click .closeButton': 'closeGallery',
            'click #leftArrow': 'showPrevImage',
            'click #rightArrow': 'showNextImage'
        },
        closeGallery: function(){
            this.$el.find('.galleryBg').addClass('galleryBgShift');
            this.$el.addClass('fadeAndZoom');
            this.$el.addClass('hidden');
            $('.fadeBg').addClass('hidden');
            this.enableScroll();
        },
        openGallery: function(imageId){
            if(this.$el.hasClass('hidden')){
                this.$el.removeClass('hidden')
            }
            this.$el.removeClass('fadeAndZoom');
            this.setScrollTop();
            this.$el.find('.galleryBg').removeClass('galleryBgShift');
            if($('.fadeBg').hasClass('hidden')){
                $('.fadeBg').removeClass('hidden')
            }
            if(imageId){
                this.currentImageId = imageId;
                this.renderImage();
            }
        },
        showNextImage: function(){
            var self = this;
            if(this.currentImageId == this.galleryImages.images.length){
                this.currentImageId = 1;
            } else{
                this.currentImageId++;
            }
            this.fadeAwayImage('left');
            setTimeout(function() {
                self.$el.find('.galleryImg').removeClass('transitions');
                self.$el.find('.galleryImg').removeClass('shiftLeft');
                self.$el.find('.galleryImg').addClass('shiftRight');
                setTimeout(function(){
                    self.renderImage('right');
                }, 20)
            }, 200);
        },
        fadeAwayImage: function(direction){
            this.$el.find('.galleryImg').addClass('fadeOut');
            if(direction == 'left') {
                this.$el.find('.galleryImg').addClass('shiftLeft');
            } else{
                this.$el.find('.galleryImg').addClass('shiftRight');
            }
        },
        renderImage: function(direction){
            var galleryImg = this.$el.find('.galleryImg');
            galleryImg[0].src = '../ceConImages/' + this.galleryImages.images[this.currentImageId - 1].image;
            if(galleryImg.hasClass('fadeOut')) {
                galleryImg.addClass('transitions');
                if(direction == 'right') {
                    galleryImg.removeClass('shiftRight');
                } else{
                    galleryImg.removeClass('shiftLeft');
                }
                galleryImg.removeClass('fadeOut');
            }
        },
        showPrevImage: function(){
            var self = this;
            if(this.currentImageId <= 1){
                this.currentImageId = this.galleryImages.images.length;
            } else{
                this.currentImageId--;
            }
            this.fadeAwayImage('right');
            setTimeout(function() {
                self.$el.find('.galleryImg').removeClass('transitions');
                self.$el.find('.galleryImg').removeClass('shiftRight');
                self.$el.find('.galleryImg').addClass('shiftLeft');
                self.renderImage();
            }, 250);
        },
        setScrollTop: function(){
            var self = this;
            var keys = [32,33,34,35,36,37, 38, 39, 40];
            $(window).scrollTop(self.$el.css('top').split('px')[0]);
            $(window).scroll(function(e){
                $(window).scrollTop(self.$el.css('top').split('px')[0]);
            })
            if (window.addEventListener) {
                window.addEventListener('DOMMouseScroll', this.preventDefault, false);
            }
            window.onmousewheel = document.onmousewheel = function(e){
                self.preventDefault(e);
            };
            document.onkeydown = function(e){
                for (var i = keys.length; i--;) {
                    if (e.keyCode === keys[i]) {
                        self.preventDefault(e);
                        return;
                    } else if(e.keyCode == '27'){
                        self.closeGallery();
                        router.navigate('/');
                    }
                }
            };
        },
        preventDefault: function(e){
            e = e || window.event;
            if (e.preventDefault)
                e.preventDefault();
            e.returnValue = false;
        },
        enableScroll: function(){
            if (window.removeEventListener) {
                window.removeEventListener('DOMMouseScroll', this.preventDefault, false);
            }
            window.onmousewheel = document.onmousewheel = document.onkeydown = null;
            $(window).off('scroll');
        },
        render: function(){
            var html = this.template();
            this.$el.html(html);
        }
    });

    return GalleryView;
});