/*
 * fixed config: for functions listed below a internal hook will be autocreated.
 * The keys can be used to add custom hooks using own plugins
 */
window.custom_plugins.eventHooks = {
    SESSION_CREATED : {
        p : 'SDK.GameSession:create',
        SHOW_ACTIVE_GAME : {p:'custom_plugins.exposedInsts.FXCompositeLayer.prototype:showActiveGame'}, // Those could even be but beside session_created...
        SHOW_START_TURN : {p:'custom_plugins.exposedInsts.FXCompositeLayer.prototype:showStartTurn'},
        
        END_STEP : {p: 'SDK.GameSession.getInstance().__proto__:_endStep'},
    },
    c_APPLICATION_CREATED : {
        p:'custom_plugins.plugin_events:application_created',
        START_GAME : {p:'Application:_startGame'},
        SET_TURN_TIME : {p:'SDK.GameSession.getInstance().__proto__:setTurnTimeRemaining'}
    }
};