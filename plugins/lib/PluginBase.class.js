/**
 * Interface, do not instance
 */
window.custom_plugins.Plugin = class {
    
    /**
     * Class Attributes:
     * listernes
     */
    
    constructor() {
        this.listeners = [];
    }

    addListener(handler, ev_type) {

        ev_type = this._getEvType(ev_type);
        
        if (!this.listeners[ev_type])
            this.listeners[ev_type] = [];

        this.listeners[ev_type].push(handler);

        return this; // chaining rocks
    }

    getAllListeners() {
        return this.listeners;
    }
    
    getListenersFor(ev_type) {
        return this.listeners[this._getEvType(ev_type)];
    }
    
    notifyAll(ev_type){
        this.listeners[this._getEvType(ev_type)].forEach(a=>a());
    }
    
    /*
     * Utility
     */
    _getEvType(ev_type){
        if(typeof ev_type === 'object')
            return ev_type.p;
        else
            return ev_type;
    }
	
};