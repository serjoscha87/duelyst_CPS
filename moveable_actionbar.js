custom_plugins.concrete.last =
custom_plugins.concrete.movable_actionbar = class extends window.custom_plugins.Plugin {

    constructor() {
        super();

        super.addListener(function () {
            var offset_l = 105, offset_t = 65;
            var dist = 0;
            
            var c = ccui.Class.prototype.getScene().getGameLayer().getBottomDeckLayer().children;
            
            $(document.createElement('img'))
                    .attr('src', 'plugins/img/cursor_move.png')
                    .mousedown(function(e){
                        dist=e.pageY;
                    })
                    .draggable({
                        drag: function (event, ui) {
                            if(event.shiftKey) {
                                var nuScale = (event.pageY-dist)/ (window.MODMOD || 10);
                                c[1].scale=nuScale;
                                //return false;
                                //console.info(nuScale);
                            }
                            //else {
                                c[0].visible = false; // action bar hintergrund verstecken
                                c[1].x = ui.position.left-offset_l; // left / right
                                c[1].y = ui.position.top * -1 + offset_t; // up / down
                            //}
                        }
                    })
                    .css({
                        left: offset_l,
                        top: offset_t,
                        width: '55px',
                        pointerEvents: 'auto'
                    })
                    .appendTo($('#app-game-bottom-region'));
        }, window.custom_plugins.eventHooks.SESSION_CREATED.SHOW_ACTIVE_GAME);

    }

}; 