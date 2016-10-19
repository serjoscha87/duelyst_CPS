custom_plugins.concrete.last =
custom_plugins.concrete.turn_notifier = class extends window.custom_plugins.Plugin {

    constructor() {
        super();

        super.addListener(function () {
            if (this.getMyPlayer().isCurrentPlayer) { // this.getIsMyTurn() -> better
                if (!document.hasFocus()) {
                    if (Notification.permission !== "granted")
                        Notification.requestPermission();
                    else {
                        var notification = new Notification('Duelyst', {
                            icon: 'https://duelyst.com/favicon.ico',
                            body: "Psssst! Your turn just started!",
                        });
                    }
                }
            }
        }, window.custom_plugins.eventHooks.SESSION_CREATED.SHOW_START_TURN);
    }

};