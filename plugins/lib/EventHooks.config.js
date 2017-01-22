/*
 * fixed config: for functions listed below a internal hook will be autocreated.
 * The keys can be used to add custom hooks using own plugins
 */
window.custom_plugins.eventHooks = {
   SESSION_CREATED: {
      p: 'SDK.GameSession:create',
      SHOW_ACTIVE_GAME: {p: 'custom_plugins.exposedInsts.FXCompositeLayer.prototype:showActiveGame'}, // Those could even be but beside session_created...
      SHOW_START_TURN: {p: 'custom_plugins.exposedInsts.FXCompositeLayer.prototype:showStartTurn'},

      END_STEP: {p: 'SDK.GameSession.getInstance().__proto__:_endStep'},
      APPLY_MODIFIER_ACTION: {p: 'SDK.ApplyModifierAction.prototype:_execute'},

      CONTENT_REGION_CHANGE: {p: 'NavigationManager.instance._contentRegion.__proto__:show'},
   },
   c_APPLICATION_CREATED: {
      p: 'custom_plugins.plugin_events:application_created',
      START_GAME: {p: 'Application:_startGame'},
      GAME_OVER: {p: 'Application:_onGameOver'},
      SET_TURN_TIME: {p: 'SDK.GameSession.getInstance().__proto__:setTurnTimeRemaining'},
      SHOW_MAIN_MENU: {p: 'Application:_showMainMenu'},
							//ON_LOGIN : {p: 'Application:onLogin'}, // does not work
      FX_RESET: {p: 'cc.Class.prototype.getScene()._fx:reset'}, // This hook is triggered with different scene changes and not only once

      AFTER_SHOW_MAIN_MENU: {p: 'custom_plugins.plugin_events:after_show_main_menu'},
							//SHOW_DECK_SELECTION : {p:'custom_plugins.plugin_events:show_deck_selection'},

      //CARDS_MODEL_INIT: {p: 'custom_plugins.exposedInsts.CardsModel.prototype:initialize'}, // TODO!!! THIS WAS ALREADY NEEDED AS EVERYTHING WAS STILL WORKING!!

      SHOW_PLAY: {p: 'custom_plugins.exposedInsts.appPlay_LayoutView.prototype:showPlayMode'},
      
							//SHOW_COLLECTION : {p:'custom_plugins.exposedInsts.DeckselectionView.prototype:showCollection'},
   }
};
