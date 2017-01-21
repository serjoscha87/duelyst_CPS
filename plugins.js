(function(_switch){
	_switch &&( function(){
      /****************************************
       ************ after duelyst.js **********
       ****************************************/
      SDK.PlayModeFactory.playModes.sandbox.isHiddenInUI = false;

      var PL = custom_plugins.PluginLoader.getInstance();
      
      /*
       * BÄM!!
       * window.process.NativeModule._cache.fs.exports.readdir('./resources/app/src/plugins',function(a,b,c){console.info(b);});
       */

      /*
       * Load all plugins that shall be loaded
       */
      $.ajax({
         url: 'plugins/_plugin_list.nlsv',
         async: false, // !
         context: PL,
         success: function (script) {
            this.loadPlugins(script.trim().split(/\n/).map(function (e) {
               return 'plugins/' + e
            }));
         }
      });

      /*
       * Generic stuff for use in all plugins
       */
      PL.addPlugin((new window.custom_plugins.Plugin)
         .addListener(function () {
            window.Application = window.EventBus.getInstance()._events.show_codex[0].ctx;
            window.custom_plugins.plugin_events.application_created.apply(this, arguments); // trigger custom event that can also be hooked
         }, window.custom_plugins.eventHooks.SESSION_CREATED)
         .addListener(function () {
            if (window.Application.getIsShowingMain())
               window.custom_plugins.plugin_events.after_show_main_menu.apply(this, arguments);
         }, window.custom_plugins.eventHooks.c_APPLICATION_CREATED.FX_RESET)
         /*.addListener(function(){
          if (this.currentView.ui && this.currentView.ui.hasOwnProperty('$decks'))
          window.custom_plugins.plugin_events.show_deck_selection.apply(this, arguments);
          }, window.custom_plugins.eventHooks.SESSION_CREATED.CONTENT_REGION_CHANGE)*/
      );

      window.custom_plugins.hooking.createHooks(window.custom_plugins.eventHooks);
            
   // ------------------------------------- 
   }()) || !_switch &&( function(){
      /****************************************
       ************ after vendor.js **********
       ****************************************/

      window.custom_plugins.plugin_events = { // custom events that are triggered by the plugin system its self
         application_created: function () {},
         after_show_main_menu: function () {}
         //show_deck_selection : function(){}
      };

      // load "lib" stuff for this collab plugin system
      [
         "plugins/lib/EventHooks.config.js",
         "plugins/lib/PluginBase.class.js",
         "plugins/lib/PluginLoader.class.js",
           "plugins/lib/hooking.funcs.js",
      ].forEach(function (path) {
         $.ajax({
            url: path,
            dataType: "script",
            async: false
         });
      });

      custom_plugins.loadedStylesheets = [];
      custom_plugins.loadStylesheet = function(sheetPath) {
         if(custom_plugins.loadedStylesheets.indexOf(sheetPath)===-1) {
            $.get(sheetPath, function(res){
               $('head').append(res);
            },'html');
            custom_plugins.loadedStylesheets.push(sheetPath);
            return true;
         }
         else
            return false;
      };

      var PL = custom_plugins.PluginLoader.getInstance();

	  // !!!!!!!!! TODO
      var _toExpose = { // internal stuff that is to be exposed
         //       ID                               :     label
         //------------------------------------------------------------------------------
         /*
          * cc.Class.extend
          */
          'TTdhSFPDv8OMf0Rtw4TCsMOyEnPCkg=='       : 'battlelog'              // 1096@duelyst.js => battlelog behavior and logic
         //,'GcOaQ8O6wpktw5DDvsOXXADCnsOJw7nDpVs='   : 'FXCompositeLayer'       // 1099@duelyst.js => much control over view elements that is needed when wanting to hook into match start ui actions
		 ,'wqccwqp1w7FTCMOgw592RFzDtcONw6Mn'   : 'FXCompositeLayer'       // 1099@duelyst.js => much control over view elements that is needed when wanting to hook into match start ui actions
         //,'acOGGsKzdsKATsO4DsOxCmt5w6sowrM='       : 'FXCompositeLayer_ScreenTransitions' // 1101@duelyst.js => gaunlet stuff
         /*
          * Backbone.Marionette.CompositeView
          */
         , 'ZVPCiS7ClmrDtsOvw6LDjcOsw57CjBbDsGo='  : 'DeckselectionView'      // 886@duelyst.js => ?
         /*
          * Backbone.Marionette.LayoutView 
          */
         , 'wrXCn0URwoVWwpUkPRjDk8KoKMOmw7ch'      : 'LayoutView'             // ?@duelyst.js => ?
         /*
          * Backbone.Model
          */
         , 'TsK9KjZKRmHDusOawqDDn8O+LMKYwq0D'      : 'CardsModel'             // ?@duelyst.js => stuff about card models 
         
      };
	  
      var toExpose = { // note: this is not a definition of extracted functions! this is more some kind of partitial object signature definition for identification... the more entries, the more wahrscheinlich we will match the right object for our desire
          'battlelog' : ["getBattleLogButton","getBattleLogNodes","getBattleLogNodesInUse","getBattleLogX","getBattleLogY","getBattleLogBottom","getBattleLogTop","getIsValidEntry","collapse","expand","toggle"],
          'FXCompositeLayer' : ["whenStartTurnShown","showEndTurn","_cleanupShowingEndTurn","afterShowEndTurn","showStartTurn","_cleanupShowingStartTurn","afterShowStartTurn"],
          //'DeckselectionView' : [],
          'appPlay_LayoutView' : ["id","template","regions","animateIn","animateOut","onShow","onCancel","showPlayMode"], // (note: there are multiple objects inheriting from layout view... just saying)
          //'CardsModel' : [] // TODO! WE SEEM TO ALREADY NEED THIS!
          
      }
      // -- new version of toExpose var

      // create hooks for internal system function calls in order to expose internal game data structures
      var sys_hooks = [
								//'module.exports.prototype:constructor',
								//'ClassManager:getNewInstanceId',
         'cc.Class:extend',
         'Backbone.Model:extend', // for cards model and so on
         'Backbone.Marionette.LayoutView:extend',
         'Backbone.Marionette.CompositeView:extend' // currently used for the DeckselectionView
      ];
      sys_hooks.forEach(sys_func_to_hook=>custom_plugins.hooking.createHook(sys_func_to_hook, null));

      // prepare internal Plugin obj / def storage structs
      window.custom_plugins.exposedInsts = {};
      window.custom_plugins.exposed = {};

      // add a Plugin that oberves the hooked sys functions for calls to a constructor within
      PL.addPlugin(new class SysHook extends window.custom_plugins.Plugin {
         constructor() {
            super();

            /*function genTableId(tableObject) {
               return AWS.util.base64.encode(AWS.util.crypto.md5(JSON.stringify(Object.keys(tableObject))));
            }*/

            var _plugin = this; // for usage within the addListener method; same as "super"

            var sysHookHandler = function () { // used as universal handler for 'cc.Class:extend' and all other listeners
               var t = this;
               var ret = arguments[0];
               var _args = arguments[1]; // this is what originally was "arguments"
               var inst = _args[0];

               /*var tableHash = genTableId(inst);

               false && (function (t) { // dev func to find table ID
                  if(inst.showStartTurn)
                     console.info(tableHash);
               }(t));*/
               
               var clear_key = null;
               var should_expose = false;
               var iterational_match = null;
               for(var label in toExpose) {
                  //should_expose = Object.keys(inst).filter(x => toExpose[label].indexOf(x)>-1).length > 0; // WORKS
                  iterational_match = Object.keys(inst).filter(x => toExpose[label].indexOf(x)>-1).length >= toExpose[label].length;
                  if(iterational_match){
                     if(should_expose) {
                        //clear_key = label;
                        //break;
                        console.error("FOUND MORE THEN ONE MATCHING OBJECTS FOR ONE SINGLE DEFINITION! This is critical and may not happen! Please fix this!");
                        //should_expose = false;
                        //break;
                     }
                     should_expose = true;
                     clear_key = label;
                  }
               }
               
               /*if(clear_key==="LayoutView_FOO") {
                  console.info(inst);
               }*/

               //if (toExpose[tableHash] && false) {
               if (should_expose) {
                  //var clear_key = toExpose[tableHash]; // like for example 'battlelog' and so on
                  /*if(custom_plugins.exposedInsts[clear_key] != null)
                     custom_plugins.exposedInsts[clear_key].push(ret);
                  else*/
                     custom_plugins.exposedInsts[clear_key] = ret; // this is always done
                     //custom_plugins.exposedInsts[clear_key] = [ret]; // this is always done

                  // constructor hooking func which is called by condition
                  var create_matching_constructor_hook = function (ctor_name='ctor') {
                     //console.info("createing hook for ",ctor_name, '@', clear_key);
                     var hookstr = `window.custom_plugins.exposedInsts.${clear_key}.prototype:${ctor_name}`;
                     window.custom_plugins.hooking.createHook(hookstr, null);
                     _plugin.addListener(function () {
                        (custom_plugins.exposed[clear_key] || (custom_plugins.exposed[clear_key] = {}))[ctor_name] = this;
                     }, hookstr);
                  };

                  // check if there is any constructor to be hooked
                  if (ret.prototype.ctor)
                     create_matching_constructor_hook('ctor');
                  if (ret.prototype.constructor)
                     create_matching_constructor_hook('constructor');
               }
            }; // End of func "sysHookHandler"
         
            // add listeners for cc.Class:extend and so on dynamically in order to create the ctor hooks and just expose data
            sys_hooks.forEach(sys_func_to_hook => _plugin.addListener(sysHookHandler, sys_func_to_hook));
            
            // TEST
            /*_plugin.addListener(function(){
               //if(arguments[0]===1116)
                  //console.info(arguments);
                  console.info(this);
            }, 'module.exports.prototype:constructor');*/
            
         } // -constructor
      } // End Plugin def
     ); 
   // ------------------	
   }());
}(((window.custom_plugins || (window.custom_plugins={_switch:0, CPS:{VERSION:'2.0'}})), window.custom_plugins._switch++)));