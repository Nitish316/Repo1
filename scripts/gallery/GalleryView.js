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
            EventManager.on('openGallery', this.openGallery, this);
            this.template = Handlebars.compile(template);
            var self = this;
//            this.listenTo(this.model, 'change', this.render, this);
            this.galleryImages = $.parseJSON(galleryImages);
            this.currentImageId = 1;
            this.render();
            this.renderImage();
            this.$el.find('.galleryImg').addClass('quick-transitions');
            if(router.currentPage === 'gallery'){
                this.openGallery();
            }
            this.$el.find('#leftArrow').click(function(){
                self.showPrevImage();
            });
            this.$el.find('#rightArrow').click(function(){
                self.showNextImage()
            });
        },
        events: {
            'click .closeButton': 'closeGallery',
//            'click #leftArrow': 'showPrevImage',
//            'click #rightArrow': 'showNextImage'
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
        showNextImage: _.debounce(function(){
                if(this.currentImageId == this.galleryImages.images.length){
                    this.currentImageId = 1;
                } else{
                    this.currentImageId++;
                }
                this.fadeAwayImage('left');
            }, 300),
        showPrevImage: _.debounce(function () {
                if(this.currentImageId <= 1){
                    this.currentImageId = this.galleryImages.images.length;
                } else{
                    this.currentImageId--;
                }
                this.fadeAwayImage('right');
            }, 300),
        fadeAwayImage: function(direction){
            var self = this;
            var center = this.$el.find('.galleryImg.centerImg').first();
            var right = this.$el.find('.galleryImg.rightImg').first();
            var left = this.$el.find('.galleryImg.leftImg').first();
            center.addClass('fadeOut');
            if(direction == 'left') {
                left.addClass('fadeOut');
                center.removeClass('centerImg').addClass('leftImg');
                setTimeout(function() {
                    right.removeClass('rightImg').addClass('centerImg');
                    left.removeClass('leftImg').addClass('rightImg');
                    self.renderImage('right');
                    left.removeClass('fadeOut');
                }, 120);
            } else{
                right.addClass('fadeOut');
                center.removeClass('centerImg').addClass('rightImg');
                setTimeout(function() {
                    left.removeClass('leftImg').addClass('centerImg');
                    right.removeClass('rightImg').addClass('leftImg');
                    self.renderImage('left');
                    right.removeClass('fadeOut');
                }, 120);
            }
        },
        setMarginForAlignment: function (elem) {
            var margin = (($(elem).parent().width() - (this.$el.find('.arrow').width()*2)) - $(elem).width())/2;
            $(elem).css('margin-left', margin + 'px');
        },
        renderImage: function(direction){
            var galleryImg = this.$el.find('.galleryImg.centerImg').first();
            var galleryImgLeft = this.$el.find('.galleryImg.leftImg').first();
            var galleryImgRight = this.$el.find('.galleryImg.rightImg').first();
            var self = this;
            if(galleryImg[0] && !galleryImg[0].src){
//                $(galleryImg[0]).css('visibility', 'none');
                galleryImg[0].src = '../ceConImages/' + this.galleryImages.images[this.currentImageId - 1].image;
//                galleryImg[0].onload = function(){
//                    $(this).css('visibility', 'visible');
//                    this.onload = null;
//                }
            }
//            galleryImg[0].onload = function(e){
//                self.setMarginForAlignment(galleryImg);
//                galleryImg[0].onload = null;
//            }
            if(galleryImg.hasClass('fadeOut')) {
                galleryImg.removeClass('fadeOut');
            }
            if(this.currentImageId > 1) {
//                $(galleryImgLeft[0]).css('visibility', 'none');
                galleryImgLeft[0].src = '../ceConImages/' + this.galleryImages.images[this.currentImageId - 2].image;
//                galleryImgLeft[0].onload = function(){
//                    $(this).css('visibility', 'visible');
//                    this.onload = null;
//                }
            }
            if(this.currentImageId < (this.galleryImages.images.length - 1)){
//                $(galleryImgRight[0]).css('visibility', 'none');
                galleryImgRight[0].src = '../ceConImages/' + this.galleryImages.images[this.currentImageId].image;
//                galleryImgRight[0].onload = function(){
//                    $(this).css('visibility', 'visible');
//                    this.onload = null;
//                }
            }
        },
        //TODO: Fix gallery alignment issue on reload
        setScrollTop: function(){
            var self = this;
            this.scrollCount = 0;
            var keys = [32,33,34,35,36,37, 38, 39, 40];
            console.log("TOp: " + self.$el.css('top').split('px')[0]);
            $(window).scrollTop(self.$el.css('top').split('px')[0]);
            $(window).scroll(function(e){
                self.scrollCount++;
                if(self.scrollCount < 120){
                    $(window).scrollTop(self.$el.css('top').split('px')[0]);
                }
            })
            if (window.addEventListener) {
                self.scrollCount++;
                if(self.scrollCount < 120){
                    window.addEventListener('DOMMouseScroll', this.preventDefault, false);
                }
            }
            window.onmousewheel = document.onmousewheel = function(e){
                self.scrollCount++;
                if(self.scrollCount < 120){
                    self.preventDefault(e);
                }
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