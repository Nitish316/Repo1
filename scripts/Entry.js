define([
    'jquery',
    'lobby/LobbyModel',
    'lobby/LobbyView'
], function($, LobbyModel, LobbyView){
    var streamModel = new LobbyModel();
    var streamView = new LobbyView({model: streamModel, el: $('#container')});

});