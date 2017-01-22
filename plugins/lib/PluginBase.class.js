/**
 * Interface, do not instance
 */
window.custom_plugins.Plugin = class _BasePlugin {

   /**
    * Class Attributes:
    * listernes
    */

   constructor() {
      this.listeners = [];
   }

   /*
    * Note: If listeners are registered AFTER the Plugin was added to the PluginLoader, you need to tell the PluginLoader to refresh its internal datastructure!
    */
   addListener(handler, ev_type) {

      if(Array.isArray(ev_type)) { // if a array of events is given: register one and the same handler to different events
         for(var i in ev_type)
            this.addListener(handler,ev_type[i]);
         
         return this;
      }

      ev_type = this._getEvType(ev_type);

      if (!this.listeners[ev_type])
         this.listeners[ev_type] = [];
   
      this.listeners[ev_type].push(handler);
      
      this.listenerAdded(ev_type); // in another "place" that there has been added a listener (if there is some other place that cares). Formally this method will be implemented by the PluginLoader

      return this; // chaining rocks
   }
   
   /*
    * This interface method can be implemented by another class that wants to be notified when a listener is added to a concrete Plugin
    */
   listenerAdded(ev_type){}

   getAllListeners() {
      return this.listeners;
   }

   getListenersFor(ev_type) {
      return this.listeners[this._getEvType(ev_type)];
   }

   notifyAll(ev_type) {
      this.listeners[this._getEvType(ev_type)].forEach(a => a());
   }

   /*
    * NOTE: In order for this to work Plugins MUST be defined this way:
    * custom_plugins.concrete.does_not_matter = class ANY_UNIQUE_PLUGIN_NAME extends window.custom_plugins.Plugin { ...
    * and NOT this way:
    * custom_plugins.concrete.does_not_matter = class extends window.custom_plugins.Plugin { ...
    */
   getName() {
      return this.constructor.name;
   }

   /*
    * Utility
    */
   _getEvType(ev_type) { 
      if (typeof ev_type === typeof {})
         return ev_type.p;
      else if (typeof ev_type === typeof "")
         return ev_type;
      else
         return ev_type; // leave everything else untouched
   }

};