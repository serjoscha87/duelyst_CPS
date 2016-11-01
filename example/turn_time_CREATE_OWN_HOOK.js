custom_plugins.concrete.last = 
custom_plugins.concrete.turn_time = class extends window.custom_plugins.Plugin {

    constructor() {
        super();
        
        //var addon_specific_hook = 'SDK.GameSession.getInstance():setTurnTimeRemaining';
        var addon_specific_hook = 'SDK.GameSession.getInstance().__proto__:setTurnTimeRemaining';
        super.addListener(function(time_left){
            $('.submit-turn').find('div').eq(1).text("turn ("+time_left+"s)");
        }, addon_specific_hook);
        
        super.addListener(function(){
            window.custom_plugins.hooking.createHook(addon_specific_hook, null);
        //}, window.custom_plugins.eventHooks.c_APPLICATION_CREATED.START_GAME);
        //}, window.custom_plugins.eventHooks.SESSION_CREATED);
        }, window.custom_plugins.eventHooks.c_APPLICATION_CREATED);
        
    }

};