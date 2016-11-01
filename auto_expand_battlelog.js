custom_plugins.concrete.last = 
custom_plugins.concrete.auto_expand_battlelog = class extends window.custom_plugins.Plugin {

    constructor() {
        super();
        
        super.addListener(function(){
            window.custom_plugins.exposed.battlelog.toggle(this);
        }, window.custom_plugins.eventHooks.SESSION_CREATED.SHOW_ACTIVE_GAME); 
        
    }

};