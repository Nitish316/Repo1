define(['backbone',
    'EventManager'], function(Backbone, EventManager) {
    // Defining the application router, you can attach sub routers here.
    var Router = Backbone.Router.extend({
        currentPage:'home',
        routes: {
            '': 'index',
            'home': 'returnToHome',
            'about': 'aboutUs',
            'services': 'services',
            'projects': 'projects',
            'contact': 'contactUs',
            'awards': 'awards',
            'gallery': 'openGallery',
            'career': 'career'
        },
        index: function() {
            console.log('Route received');
        },
        returnToHome: function(){
            console.log('Return to home')
            this.currentPage = 'home';
            EventManager.trigger('changePage', 'home');
            if(!$('.page-collection.home').hasClass('active-link')){
                $('.page-collection.active-link').removeClass('active-link');
                $('.page-collection.home').addClass('active-link')
            }
        },
        services: function(){
            this.currentPage = 'services';
            EventManager.trigger('changePage', 'services');

            if(!$('.page-collection.services').hasClass('active-link')){
                $('.page-collection.active-link').removeClass('active-link');
                $('.page-collection.services').addClass('active-link')
            }
        },
        aboutUs: function(){
            console.log('About Us')
            this.currentPage = 'about';
            EventManager.trigger('changePage', 'about');
            if(!$('.page-collection.about').hasClass('active-link')){
                $('.page-collection.active-link').removeClass('active-link');
                $('.page-collection.about').addClass('active-link')
            }
        },
        projects: function(){
            console.log('projects')
            this.currentPage = 'projects';
            EventManager.trigger('changePage', 'projects');
            if(!$('.page-collection.projects').hasClass('active-link')){
                $('.page-collection.active-link').removeClass('active-link');
                $('.page-collection.projects').addClass('active-link')
            }
        },
        awards: function(){
            this.currentPage = 'awards';
            EventManager.trigger('changePage', 'awards');
            if(!$('.page-collection.awards').hasClass('active-link')){
                $('.page-collection.active-link').removeClass('active-link');
                $('.page-collection.awards').addClass('active-link')
            }
        },
        contactUs: function(){
            console.log('contactUs')
            this.currentPage = 'contactUs';
            EventManager.trigger('changePage', 'contactUs');
            if(!$('.page-collection.contact').hasClass('active-link')){
                $('.page-collection.active-link').removeClass('active-link');
                $('.page-collection.contact').addClass('active-link')
            }
        },
        career: function(){
            console.log('career')
            this.currentPage = 'career';
            EventManager.trigger('changePage', 'career');
            if(!$('.page-collection.career').hasClass('active-link')){
                $('.page-collection.active-link').removeClass('active-link');
                $('.page-collection.career').addClass('active-link')
            }
        },
        openGallery: function(){
            this.currentPage = 'gallery';
            EventManager.trigger('openGallery');
        }

    });

    var appRouter = new Router();
    Backbone.history.start();
    return appRouter;
});