/**
 * Global EventManager singleton class.
 * Derived from Backbone.Events.
 *
 * This event manager facilitates inter component communication among all the components in lobby.
 */
define([
    'backbone'
], function(Backbone){
    var EventManager = {
    };
    _.extend(EventManager, Backbone.Events);

    return EventManager;
});