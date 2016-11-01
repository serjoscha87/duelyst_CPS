(function(_switch){
	_switch &&( function(){
		/****************************************
                 ************ after duelyst.js **********
                 ****************************************/ 
                
                SDK.PlayModeFactory.playModes.sandbox.isHiddenInUI = false;
                
                var PL = new window.custom_plugins.PluginLoader;
                
                /*
                 * Load all plugins that shall be loaded
                 */
                $.ajax({
                    url: 'plugins/_plugin_list.nlsv',
                    async: false, // !
                    context: PL,
                    success: function (script) {
                        this.loadPlugins(script.trim().split(/\n/).map(function(e) {return 'plugins/' + e}));
                    }
                });
                
                /*
                 * Generic stuff for use in all plugins
                 */
                PL.addPlugin((new window.custom_plugins.Plugin)
                    .addListener(function(){
                        window.Application = window.EventBus.getInstance()._events.show_codex[0].ctx;
                        window.custom_plugins.plugin_events.application_created.apply(this, arguments); // trigger custom event that can also be hooked
                    }, window.custom_plugins.eventHooks.SESSION_CREATED)
                    .addListener(function(){
                        if(window.Application.getIsShowingMain())
                            window.custom_plugins.plugin_events.after_show_main_menu.apply(this, arguments);
                    }, window.custom_plugins.eventHooks.c_APPLICATION_CREATED.FX_RESET)
                    .addListener(function(){
                        if (this.currentView.ui && this.currentView.ui.hasOwnProperty('$decks'))
                            window.custom_plugins.plugin_events.show_deck_selection.apply(this, arguments);
                    }, window.custom_plugins.eventHooks.SESSION_CREATED.CONTENT_REGION_CHANGE)
                );
                
                function createHook(func_path, sub_hooks) {
                    var path = func_path.split(':');
                    var func = path.pop();
                    path = eval(path[0]);
                    var orig_func = path[func];

                    if(!path[func].already_hooked) {
                        //console.info("create hook for: "+func_path);
                        path[func] = function(){ // override original with out custom stuff
                            //console.info("HOOK FROM: " + func_path );
                            var ret = orig_func.apply(this, arguments);

                            if(sub_hooks)
                                createHooks(sub_hooks);

                            try {
                                var cbs = PL.getCallbacksByRegisteredEvent(func_path);
                                if(cbs)
                                    cbs.forEach( c => c.apply(this, arguments) ); // notify registered plugins matching handlers about the current hooked event
                            }
                            catch(e){ console.error(e); }

                            return ret;
                        };
                        path[func].already_hooked=true;
                    }
                }

                try {
                    var createHooks = function (hookMap) {
                        for(var label in hookMap){ // iterate over all elems in the current map level
                            var currLevelDownwardsData = hookMap[label];

                            if(currLevelDownwardsData.p) // check if the current iteration's element got a func to be hooked
                                createHook(currLevelDownwardsData.p, currLevelDownwardsData);
                        }
                        return arguments.callee;
                    }(window.custom_plugins.eventHooks);
                } catch(e){console.error(e);}
                
                // expose functions for plugins that need hooks they create their self
                window.custom_plugins.hooking = {createHooks : createHooks, createHook : createHook};
            
        // ------------------------------------- 
	}()) || !_switch &&( function(){
		/****************************************
                 ************ after vendor.js **********
                 ****************************************/ 
                
                window.custom_plugins.plugin_events = { // custom events that are triggered by the plugin system its self
                    application_created : function(){},
                    after_show_main_menu : function(){},
                    show_deck_selection : function(){}
                };
                
                // load "lib" stuff for this collab plugin system
                [
                    "plugins/lib/EventHooks.config.js",
                    "plugins/lib/PluginBase.class.js",
                    "plugins/lib/PluginLoader.class.js",
                    // hm, we still need this
                    "plugins_after_vendor.js"
                    //
                ].forEach(function(path) {
                    $.ajax({
                        url: path,
                        dataType: "script",
                        async: false
                    });             
                });
		
	}());
}(((window.custom_plugins || (window.custom_plugins={_switch:0})), window.custom_plugins._switch++)));