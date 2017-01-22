window.custom_plugins.hooking = {

   createHook: function (func_path, sub_hooks, post_hook = false) { // default: pre hook
      var path = func_path.split(':');
      var func = path.pop();
      path = eval(path[0]);
      var orig_func = path[func];

      if (!path[func].already_hooked) {
         //console.info("create hook for: "+func_path);
         path[func] = function () { // override original with out custom stuff
            //console.info("HOOK FROM: " + func_path );
            if (!post_hook) // same as if(post_hook===false)
               var ret = orig_func.apply(this, arguments);

            if (sub_hooks)
               custom_plugins.hooking.createHooks(sub_hooks);

            try {
               var cbs = custom_plugins.PluginLoader.getInstance().getCallbacksByRegisteredEvent(func_path);
               if (cbs) {
                  //cbs.forEach(c => c.apply(this, arguments)); // notify registered plugins matching handlers about the current hooked event
                  //cbs.forEach(c => c.apply(ret, arguments)); 
                  if (!post_hook)
                     cbs.forEach(c => c.call(this, ret, arguments));
                  else
                     cbs.forEach(c => c.call(this, null, arguments));
               }
            } catch (e) {
               console.error("was trying to ADDRESS hook >>", func_path, '<<');
               //console.error(cbs);
               console.error("ACCORDING MSG FROM createHook func:", e);
            }

            if (!post_hook)
               return ret;
            else
               return orig_func.apply(this, arguments);
         };
         path[func].already_hooked = true;
      }
   },

   createHooks: function (hookMap) {
      for (var label in hookMap) { // iterate over all elems in the current map level
         var currLevelDownwardsData = hookMap[label];

         try {
            if (currLevelDownwardsData.p) // check if the current iteration's element got a func to be hooked
               custom_plugins.hooking.createHook(currLevelDownwardsData.p, currLevelDownwardsData);
         } catch (e) {
            console.error("createHook_S_: FAILED AT CREATING HOOK:", currLevelDownwardsData.p);
            console.error("MSG:", e);
         }
      }
      return arguments.callee;
   }
};