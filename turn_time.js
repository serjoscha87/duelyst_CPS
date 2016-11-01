custom_plugins.concrete.last = 
custom_plugins.concrete.turn_time = class extends window.custom_plugins.Plugin {

    constructor() {
        super();
        
        super.addListener(function(time_left){
            $('.submit-turn').find('div').eq(1).text("turn ("+time_left+"s)");
        }, window.custom_plugins.eventHooks.c_APPLICATION_CREATED.SET_TURN_TIME);
        
    }

};