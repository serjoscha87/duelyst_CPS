custom_plugins.PluginLoader.getInstance().addPlugin(
   class AccountInfo extends custom_plugins.Plugin {   
       constructor() {
           super();
            this.VERSION = "1.0";
            super.addListener(function () {
            //if(!Application.getIsShowingMain()) return;
            //console.info(this);
            //console.info(arguments);
            $(document.createElement('div'))
                .text(Session.email + ' / ' + Session.username)
                //.click(function (e) {})
                .addClass('badge')
                .data('placement', 'top')
                //.attr('title', 'Account created: '+AWS.util.date.from(__babas[0].identity.props.created_at))
                .attr('title', 'Account created: TODO')
                .css({
                    position: 'absolute',
                    bottom: '2px',
                    right: '5px',
                    pointerEvents: 'auto'
                })
                .appendTo($('.utility-bottom'))
                .tooltip();
        }, window.custom_plugins.eventHooks.c_APPLICATION_CREATED.AFTER_SHOW_MAIN_MENU);
      }
   }
);