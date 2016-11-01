window.custom_plugins.PluginLoader = class {

    /**
     * Class Attributes:
     * plugins
     * plugins_by_events
     * callbacks_by_events
     */

    constructor() {
        this.plugins = [];
        this.plugins_by_events = [];
        this.callbacks_by_events = [];
        
        window.custom_plugins.concrete = {}; // this is where loaded plugins are stored
    }

    loadPlugin(plugin_path) {
        $.ajax({
            url: plugin_path,
            dataType: "script",
            async: false,
            context: this,
            success: function (script, textStatus, jqXHR) {
                
                var plugin_inst = new window.custom_plugins.concrete.last;
				
                this.addPlugin(plugin_inst); // note: this was modified by context parameter of this xhr
            } 
        });
    }
    
    loadPlugins(plugin_paths_array) {
        for (var i in plugin_paths_array)
            this.loadPlugin(plugin_paths_array[i]);
    }

    addPlugin(plugin_inst) {
        if(!(plugin_inst instanceof window.custom_plugins.Plugin))
            throw new Error("THE OBJECT YOU ARE TRYING TO ADD DOES INHERIT FROM window.custom_plugins.Plugin!");

        // store the complete plugin object
        this.plugins.push(plugin_inst);

        // generate/expand categorized data collections with stuff from the currently added plugin
        for (var ev_type in plugin_inst.getAllListeners()) {
            var ref = (this.plugins_by_events[ev_type] || (this.plugins_by_events[ev_type] = [])); // create ref to either a existing or new empty array
            ref.push({
                inst: plugin_inst,
                ev_type: ev_type
            });
            // same as above in short but for callbacks_by_events
            var ref = (this.callbacks_by_events[ev_type] || (this.callbacks_by_events[ev_type] = []));
            plugin_inst.getListenersFor(ev_type).forEach(l => ref.push(l));
        }
    }

    getPlugins() {
        return this.plugins;
    }

    getPluginsCategorizedByCallbacks() {
        return this.callbacks_by_events;
    }
    
    getPluginsCategorizedByEvents() {
        return this.plugins_by_events;
    }

    /**
     * Get an array filled with all concrete callback functions (by plugins) by the desired event_type
     */
    getCallbacksByRegisteredEvent(ev_type) {
        return this.callbacks_by_events[ev_type];
    }
    
    /**
     * Get an array of plugin instances that have a registered handler for the given event
     */
    getPluginsByRegisteredEvent(ev_type) {
        return this.plugins_by_events[ev_type];
    }

}