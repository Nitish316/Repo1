define([
    'backbone',
    'handlebars',
    'jquery',
    'EventManager',
    'router'
], function(Backbone, hb, $, EventManager, Router){
    var PageView = Backbone.View.extend({
        initialize: function(){
//            this.template = Handlebars.compile(home);
//            this.listenTo(this.model, 'change', this.render, this);
            EventManager.on('changePage', this.changePage, this);
            EventManager.on('clearFormData', this.clearFormData, this);
            EventManager.on('changeProject', this.changeProject, this);

            if(Router.currentPage){
                this.changePage(Router.currentPage);
            } else{
                this.changePage('home');
            }
            this.$el.addClass('fade');
            this.$el.addClass('fadeOut');
//            this.render();
        },
        events: {
//            'mouseenter .menuImageArea': 'showMenuToolbar',
            'click .submitButton': 'sendFormData',
            'change #projectMenuItem': 'changeProject'
        },
        changePage: function(page){
            if(page != this.currentPage){
                var self = this;
                $('.active-link').removeClass("active-link");
                this.$el.addClass('fadeOut');
                this.currentPage = page;
                require(['text!page/templates/' + page + '.html'], function(htmlPage){
                    self.template = Handlebars.compile(htmlPage);
                    $('.' + page).parent().addClass('active-link');
                    self.render();
                })
            }
        },
        changeProject: function(event, val){
            this.$el.find('.displayItem').removeClass('displayItem');
            if(!val){
                this.$el.find('#' + $('#projectMenuItem').val()).addClass('displayItem');
            } else {
                this.$el.find('#' + val).addClass('displayItem');
                try {
                    this.$el.find('#' + $('#projectMenuItem').val(val))
                } catch(e) {
                    //Unexpected region event
                }
            }
        },
        sendFormData: function(){
            $('#formError').html('</br>');
            var name = this.$el.find('#name').val(),
            email =  this.$el.find('#email').val(),
            phone =  this.$el.find('#phone').val(),
            message =  this.$el.find('#message').val(),
            url =  '/query';
            if((name && email && phone && message) == ""){
                this.showError('**Please fill all fields of the form');
                return;
            }
            var posting = $.post( url, {name: name, email: email, phone: phone, message: message});
            posting.done(function(data) {
                if(data=='valid'){
                    EventManager.trigger('clearFormData');
                } else{
//                    if(data.indexOf(''))
                }
            });

        },
        showError: function(val){
            $('#formError').html(val);
        },
        clearFormData: function(){
            this.$el.find("#name").val('');
            this.$el.find( "#email" ).val('');
            this.$el.find( "#phone" ).val('');
            this.$el.find( "#message" ).val('');
        },
        render: function(){
            var html = this.template();
            var self = this;
            this.fadeTimeout = setTimeout(function(){
                $(self.el).html(html);
                self.$el.removeClass('fadeOut');
            }, 250);
        }
    });

    return PageView;
});