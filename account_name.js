custom_plugins.concrete.last =
custom_plugins.concrete.account_name = class extends window.custom_plugins.Plugin {

    constructor() {
        super();

        super.addListener(function () {
            //if(!Application.getIsShowingMain()) return;
            //console.info(this);
            //console.info(arguments);
            $(document.createElement('div'))
                .text(__babas[0].identity.props.name + " // "+ __babas[0].identity.props.email)
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
};