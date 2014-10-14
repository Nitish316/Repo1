define(['jquery',
    'text!images.json',
    'router'], function ($, imagesJSON, router) {
    return{
        headerImagesCount: 0,
        headerSequence: [],
        imagesJson:$.parseJSON(imagesJSON),
        imageLoaded: [],

        getRandomHeaderImage:function () {
            var images = this.imagesJson.header;
            if(this.headerSequence.length == 0 || this.headerImagesCount == images.length){
                this.refreshSequence(images);
                this.headerImagesCount = 0;
            }
            if(!this.headerSequence[this.headerImagesCount]){
                debugger;
            }
            return this.headerSequence[this.headerImagesCount++];
        },
        refreshSequence: function(images){
            while(this.headerSequence.length <= images.length - 1){
                var rand = this.getRandomNumber(0, images.length);
                var isImageAdded = false;
                while(!isImageAdded) {
                    var image = images[rand - 1];
                    if(image){
                        if(this.headerSequence.indexOf(image) == -1) {
                            this.headerSequence.push(image);
                        }
                        isImageAdded = true;
                    } else{
                        rand++;
                        if(rand == images.length) {
                            rand = 0;
                        }
                    }
                }
            }
        },
        navigate: function(url){
            var location = (window.location || document.location || location)
            location.href = url
        },
        getRandomNumber:function (first, last) {
            return Math.floor((Math.random() * (last - first) + 1) + first);
        },
        preLoadImages: function(path){
            if(!path) path = '';
            var images = this.imagesJson.header;
            var self = this;
            for(var i=0; i<images.length;i++){
                var image = new Image();
                image.src = "ceConImages" + "/" + path + images[i];
                image.position = i;
//                    var position = SessionDataModel.imageLoaded.length;
                this.imageLoaded.push(false);

                image.onload = function(event){
                    self.imageLoaded[event.currentTarget.position] = true;
                }
            }
            this.waitToLoadImage(0);
        },
        waitToLoadImage: function(postion){
            var self = this;
            setTimeout(function(){
                if(self.imageLoaded[postion]){
                    if(postion < (self.imageLoaded.length - 1)){
                        self.waitToLoadImage(postion + 1);
                    }
                } else{
                    self.waitToLoadImage(postion);
                }
            }, 300);
        }
    }
})