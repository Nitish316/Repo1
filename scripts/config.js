/**
 * RequireJS configuration
 * File to be loaded through 'data-main' attribute of require js include script tag.
 */
// Set the RequireJS configuration for your application.
require.config({
    //Initialize the application with the main application file.
    deps:['Entry'],
    paths:{
        // Folder alias.
        lib:'lib',
        //Libraries.
        jquery:'lib/jquery/jquery_1.9',
        underscore:'lib/underscore/underscore_1.4.3',
        backbone:'lib/backbone/Backbone_0.9.10',
        handlebarsLib: 'lib/handlebars/handlebars-1.0.0.beta.6',
        handlebars: 'lib/handlebars/handlebars',
        text: 'lib/require/text'
    },
    shim:{
        // Backbone library depends on underscore and jQuery.
        backbone:{
            deps:['underscore', 'jquery'],
            exports:'Backbone'
        },
        handlebars: {
            deps: ['jquery', 'handlebarsLib'],
            exports: 'Handlebars'
        },
        // Backbone.Marionette depends on Backbone.
        'lib/backbone/backbackbone.marionette_1.0.0':['backbone']
    }
});
