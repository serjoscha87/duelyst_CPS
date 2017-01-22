window.custom_plugins.PluginLoader = class {

   /**
    * Class Attributes:
    * plugins
    * plugins_by_events
    * callbacks_by_events
    */

   constructor() {
      this.plugins = []; // conctrete objects
      this.plugins_by_events = [];
      this.callbacks_by_events = [];
   }

   static getInstance() {
      if (!window.custom_plugins.PluginLoader.instance)
         window.custom_plugins.PluginLoader.instance = new window.custom_plugins.PluginLoader;
      return window.custom_plugins.PluginLoader.instance;
   }

   loadPlugin(plugin_path) {
      $.ajax({
         url: plugin_path,
         dataType: "script",
         async: false,
         context: this
      });
   }

   loadPlugins(plugin_paths_array) {
      for (var i in plugin_paths_array)
         this.loadPlugin(plugin_paths_array[i]);
   }

   addPlugin(plugin_inst) {
      if (typeof plugin_inst === typeof (() => {})) // this enables us to add Plugin class Definition instead of an instance. This will auto-instance a definition so.
         plugin_inst = new plugin_inst;

      if (!(plugin_inst instanceof window.custom_plugins.Plugin))
         throw new Error("THE OBJECT YOU ARE TRYING TO ADD DOES INHERIT FROM window.custom_plugins.Plugin!");

      // store the complete plugin object
      this.plugins.push(plugin_inst);

      this.doRefreshStructures(); // initially refresh ALL internal structures

      // Plugins will notify us when a new listener is attached to them.
      // In case the listener is added AFTER the Plugin object is added to the loader, we need to refresh out internal structures in order to keep everything running
      var t = this;
      plugin_inst.listenerAdded = function (ev_type) { // implementation of a method that is predefined by the Plugin Base class
         t.doRefreshStructures(plugin_inst, ev_type); // tell to refresh a specific part of the structure
      };
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

   getPluginByName(plugin_name) {
      for (var i in this.plugins) {
         var plugin_inst = this.plugins[i];
         if (plugin_inst.getName() === plugin_name)
            return plugin_inst;
      }
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

   /*
    * This function updates internal data structures:
    *   this.plugins_by_events
    *   this.callbacks_by_events
    *   
    * When given a concrete Plugin with a specific event type, only this exact structures is updated
    */
   doRefreshStructures(plugin_inst, ev_type) {
      let plugins = []; // this is initialized as array for the fitst case in the following if branch (when *no* complete refresh is needed)
      if (plugin_inst && ev_type) {
         for (var i in plugin_inst.getListenersFor(ev_type)) {
            // update callbacks_by_events
            var current_listener = plugin_inst.getListenersFor(ev_type)[i];
            if (this.callbacks_by_events.indexOf(current_listener) === -1) {
               if (typeof this.callbacks_by_events[ev_type] !== typeof [])
                  this.callbacks_by_events[ev_type] = [];
               this.callbacks_by_events[ev_type].push(current_listener);
            }
            // update plugins_by_events
            if (this.plugins_by_events.indexOf(plugin_inst) === -1) {
               if (typeof this.plugins_by_events[ev_type] !== typeof [])
                  this.plugins_by_events[ev_type] = [];
               this.plugins_by_events[ev_type].push(plugin_inst);
            }
         }
      } else {
         // preperation for refreshing everything
         plugins = this.plugins;
         this.plugins_by_events = [];
         this.callbacks_by_events = [];
      }
      
      // in case of just updating plugins will have a length of 0 and therefor this loop won't run 
      for (var i in plugins) {
         var plugin_inst = this.plugins[i];
         for (var ev_type in plugin_inst.getAllListeners()) {
            //console.info(ev_type);
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
   }

};