/**
 * (c) Juan Luis Iglesias
 * 
 * */

cordova.define("com.drinkbo.ActivityPlugin", function(require, exports, module) {
 
	/* 
	 * @constructor
	 */
	var cordova = require('cordova'),
	    exec = require('cordova/exec');
	
	var ActivityPlugin = function() {
		
	};
	
	ActivityPlugin.prototype.Execute = function(className,action,successCallback,errorCallback){
		/**
		 * Callback functions
		 * 
		 * successCallback(success)
		 * errorCallback(error)
		 * */
		exec(successCallback, successCallback, "ActivityPlugin", action, [className]);
	};
	/**
	 * Error callback for Activity
	 */
	ActivityPlugin.prototype._error = function(e) {
	    console.log("Error initializing ActivityPlugin: " + e);
	};
	
	var activityPlugin = new ActivityPlugin();
	
	module.exports = activityPlugin;
	
});
