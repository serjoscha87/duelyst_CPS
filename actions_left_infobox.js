custom_plugins.PluginLoader.getInstance().addPlugin(
   class ActionsLeftInfobox extends custom_plugins.Plugin {
      constructor() {
         super();
         this.VERSION = "1.2";
         this.URL = "http://duelyst.r4nd0m.org/page/duelyst_plugins/actions-left-info";
         super.addListener(this.prepare, window.custom_plugins.eventHooks.SESSION_CREATED); 
         super.addListener(this.infuse_dom, window.custom_plugins.eventHooks.SESSION_CREATED.SHOW_ACTIVE_GAME); 
         super.addListener(this.update_data, window.custom_plugins.eventHooks.SESSION_CREATED.END_STEP); 
         super.addListener(this.toggle_box, window.custom_plugins.eventHooks.SESSION_CREATED.SHOW_START_TURN); 
      }

      toggle_box() { // triggered with SHOW_START_TURN
         this.getIsMyTurn() ? $('#plugin_ali_box').show() : $('#plugin_ali_box').hide();
      }

      prepare() { // triggered with SESSION_CREATED
         custom_plugins.loadStylesheet('plugins/boxes-1.0.css.html');
      }

      infuse_dom() { // triggered with SHOW_ACTIVE_GAME
         $(document.createElement('div'))
                 .addClass('ingame_infobox')
                 .attr('id', 'plugin_ali_box')
                 .draggable()
                 .appendTo($("#app-game-right-region"));
      }
    
      update_data(){ // triggered with END_STEP

         /*
          * TODO gosh.. beautify this for the sake of all devs... ever..
          */

         if(!this.getMyPlayer().isCurrentPlayer)
             return;

         var internal_gs = this; // GameSession

         var mana_remaining = this.getMyPlayer().getRemainingMana();

         var can_play_any_card = false;
         var cachedCards = this.getMyPlayer().deck._private.cachedCardsInHandExcludingMissing;
         for(var card in cachedCards)
                 if(cachedCards[card].manaCost <= mana_remaining)
                         can_play_any_card = true;

         var did_replace = false;
         for(var step in internal_gs.currentTurn.steps)
                 if(internal_gs.currentTurn.steps[step].action.type === "ReplaceCardFromHandAction")
                         did_replace = true;
         if (!did_replace && this.getMyPlayer().deck.hand.filter(function(e){return typeof e==='number';}).length === 0) did_replace = true;

         /*var played_signature = true;
         if(this.getMyPlayer().getSignatureCards().length !== 0 && mana_remaining >=1) { // was even able to play signature this turn?
                 played_signature = false;
                 for(var step in internal_gs.currentTurn.steps) // did play signature?
                         if(internal_gs.currentTurn.steps[step].action.type === "PlaySignatureCardAction")
                                 played_signature = true;
         }*/
         var can_play_signature = internal_gs.getMyPlayer().signatureCardActive && mana_remaining > 0;

         // generate string with info of minions that can still attack
         var info_container = $(document.createElement('div'));
         var unit_actions_left_string = '<b style="text-decoration: underline;">Move/Attack with:</b>';
         info_container.append(unit_actions_left_string);

         var units_on_board = internal_gs.board.getCards();
         var actions_left=0;
         for(var unit in units_on_board) {
             if(units_on_board[unit].ownerId === ProfileManager.instance.profile.id)
                 if( // \|/ multiline conditions
                     !units_on_board[unit].getIsExhausted() // not exhausted
                             && // AND
                     // (enemy minions in meele range OR could move around OR is ranged minion)
                     (internal_gs.board.getEnemyEntitiesAroundEntity(internal_gs.board.getCards()[unit]).length!==0 || units_on_board[unit].getCanMove() || units_on_board[unit].isRanged() ) 
                             && // AND
                     !units_on_board[unit].getIsBattlePet() // minion is not a battlepet
                 ) {
                         $(document.createElement('div'))
                             .text(units_on_board[unit].name)
                             .data({x:units_on_board[unit].position.x,y:units_on_board[unit].position.y})
                             .on('mouseenter',function(){
                                     var x = $(this).data('x');
                                     var y = $(this).data('y');
                                     //custom_plugins.exposed.FXCompositeLayer.showInstructionalArrowForEntityNode(custom_plugins.exposed.FXCompositeLayer.getEntityNodeAtBoardPosition(x,y));
                                     custom_plugins.exposed.FXCompositeLayer.ctor.showInstructionalArrowForEntityNode(custom_plugins.exposed.FXCompositeLayer.ctor.getEntityNodeAtBoardPosition(x,y));
                             })
                             .appendTo(info_container);
                         //unit_actions_left_string += '<div data-unitid='+unit+'>'+units_on_board[unit].name+"</div>";
                         actions_left++;
                 }
         }
         !actions_left && (info_container.append("<br/>&mdash;"));

         // print out stuff
         $('#plugin_ali_box').html(
             '<b style="text-decoration: underline;">Actions left:</b><br/>' +
             (can_play_any_card ? "* Play a card<br/>":'') +
             (!did_replace ? '* Replace<br/>':'') +
             (can_play_signature ? '* Bloodborn Spell<br/>':'') +
                     ( (!can_play_any_card && did_replace && !can_play_signature) ? "&mdash;<br/>":'' ) //+ // only a indicator dash
             //unit_actions_left_string + 
             //( (!can_play_any_card && did_replace && played_signature && actions_left===0) ? '<br/><b style="color:green">No action left</b>':'') //; NO S!
         );

         info_container.appendTo($('#plugin_ali_box'));

         (!can_play_any_card && did_replace && !can_play_signature && actions_left===0) && (info_container.append('<br/><b style="color:green">No action left</b>'));

        } // end of update_data
   } // end of class def
);