custom_plugins.concrete.last =
custom_plugins.concrete.play_quest_info = class extends window.custom_plugins.Plugin {

    constructor() {
        super();

        super.addListener(function () {
            //if(this.currentView.cid === "view1391")
                    
            var t = this;
            //console.info(t);

            // create DOM container
            var ls_t = localStorage.getItem('plugin_play_quest_info_pos_top');
            var ls_l = localStorage.getItem('plugin_play_quest_info_pos_left');
            $(document.createElement('div'))
                .addClass('quest_info nav nav-tabs deck-groups')
                .attr('id', 'plugin_play_q_info_box')
                .css({
                    position: 'absolute',
                    top : (`${ls_t}px` || '100px'),
                    left: (`${ls_l}px` || '100px'),
                    pointerEvents : 'auto',
                    cursor : 'move',
                    display:'block'
                })
                .draggable({
                    stop: function(e, ui){
                        //ui.position = {top, left} 
                        localStorage.setItem('plugin_play_quest_info_pos_top', ui.position.top); // storing objects would be cool :( 
                        localStorage.setItem('plugin_play_quest_info_pos_left', ui.position.left); // TODO use JSON.stringify 
                    }
                })
                .html(`<ul><li class="active"><a>Quests</a></li></ul>`)
                .appendTo(this.currentView.ui['$decks'].prevObject);

            // set data to the container
            var qs = QuestsManager.instance.getQuestCollection().models;
            for (var quest in qs) {
                //if ((qs[quest].attributes.quest_type_id === 500 || qs[quest].attributes.quest_type_id === 401) && $('#plugin_sqi_box').length === 0) {
                //console.info(qs[quest]);
                var q_data = SDK.QuestFactory.questForIdentifier(qs[quest].attributes.quest_type_id);
                $('#plugin_play_q_info_box').append(`
                    <div class="quest_data_group">
                        <div><b><u>${q_data.name}</u></b></div>
                        <div>${q_data.getDescription()}</div>
                        <div>${qs[quest].attributes.progress} / ${q_data.params.completionProgress}</div>
                        <div>${qs[quest].attributes.gold}g</div>
                    </div>
                `).find('>div:not(:last-child)').css('border-bottom','1px solid white');
            }
        // ----------------------------------------------------
        }, window.custom_plugins.eventHooks.c_APPLICATION_CREATED.SHOW_DECK_SELECTION);

    }

};