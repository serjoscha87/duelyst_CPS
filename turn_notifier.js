custom_plugins.PluginLoader.getInstance().addPlugin(
   class TurnNotifier extends custom_plugins.Plugin {
      constructor() {
         super();
         this.VERSION = "1.1";
         this.URL = "http://duelyst.r4nd0m.org/page/duelyst_plugins/turn-notifier";
         super.addListener(function () {
            if (this.getIsMyTurn()) {
               if (!document.hasFocus()) {
                  if (Notification.permission !== "granted")
                     Notification.requestPermission();
                  else {
                     new Notification('Duelyst', {
                        icon: 'https://duelyst.com/favicon.ico',
                        body: "Psssst! Your turn just started!",
                     });
                  }
               }
            }
         }, window.custom_plugins.eventHooks.SESSION_CREATED.SHOW_START_TURN);
      }
   }
);