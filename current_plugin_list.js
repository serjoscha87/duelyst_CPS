custom_plugins.PluginLoader.getInstance().addPlugin(
   class CPSnPluginInfo extends window.custom_plugins.Plugin {
      constructor() {
         super();
         this.VERSION = "1.0";
         var t = this;
         super.addListener(function () {
            
            $.getJSON('http://duelyst.r4nd0m.org/versions.json', function(res){
                  let omit_from_list = ['SysHook', '_BasePlugin'];
                  let cp = window.custom_plugins.PluginLoader.getInstance().getPlugins();
                  let plugins_string="<b>Currently loaded CPS Plugins:</b><hr/>";
                  let version_eval = 0;
                  let version_eval_coloring = {0:'green', '-1':'red', 1:'orange'};
                  for (var i in cp) {
                     let plugin = cp[i];
                     let plugin_name = plugin.getName();
                     if(omit_from_list.indexOf(plugin_name) === -1) {
                        version_eval = t.versionCompare(plugin.VERSION, res.plugins[plugin_name]);
                        plugins_string += '<a style="font-weight:bold; color: '+(plugin.URL?'darkblue':'black')+'; cursor: pointer;" target="_blank" href="'+(plugin.URL||'javascript:;')+'">'+plugin_name+'</a>: <b style="color:'+version_eval_coloring[version_eval]+'">'+plugin.VERSION+"</b><br/>";
                     }
                  }
                  version_eval = t.versionCompare(window.custom_plugins.CPS.VERSION,res.CPS);
                  plugins_string += '<hr/><b><u>CPS Version:</u></b> <span style="color:'+version_eval_coloring[version_eval]+';">' + window.custom_plugins.CPS.VERSION + '</span>';
                  if(version_eval !== 0)
                     plugins_string += "<br/>There is a new CPS Version!";
                  
                  $(document.createElement('div'))
                      .html(plugins_string)
                      //.click(function (e) {})
                      .css({
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          pointerEvents: 'auto',
                          backgroundColor: 'rgba(255,255,255,0.7)',
                          borderRadius: '4px',
                          padding: '10px',
                          fontSize : '11px'
                      })
                      .appendTo($('.utility-top'));            
            });

        }, window.custom_plugins.eventHooks.c_APPLICATION_CREATED.AFTER_SHOW_MAIN_MENU);
         

      } // -- constructor
      
      /*
      * copied from http://stackoverflow.com/questions/6832596/how-to-compare-software-version-number-using-js-only-number
      * test with: custom_plugins.PluginLoader.instance.getPluginByName("PluginList").__proto__.versionCompare()
      */
      versionCompare(v1, v2, options) {
          var lexicographical = options && options.lexicographical,
              zeroExtend = options && options.zeroExtend,
              v1parts = v1.split('.'),
              v2parts = v2.split('.');

          function isValidPart(x) {
              return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
          }

          if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
              return NaN;
          }

          if (zeroExtend) {
              while (v1parts.length < v2parts.length) v1parts.push("0");
              while (v2parts.length < v1parts.length) v2parts.push("0");
          }

          if (!lexicographical) {
              v1parts = v1parts.map(Number);
              v2parts = v2parts.map(Number);
          }

          for (var i = 0; i < v1parts.length; ++i) {
              if (v2parts.length == i) {
                  return 1;
              }

              if (v1parts[i] == v2parts[i]) {
                  continue;
              }
              else if (v1parts[i] > v2parts[i]) {
                  return 1;
              }
              else {
                  return -1;
              }
          }

          if (v1parts.length != v2parts.length) {
              return -1;
          }

          return 0;
      }
      
      
   }
);