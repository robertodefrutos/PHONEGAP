
var app = {
	
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
    	
		app.isAndroid = (device.platform == "Android");
		app.receivedEvent('deviceready');
		
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    	
		if (id=="deviceready"){
			//http://docs.phonegap.com/en/3.1.0/cordova_storage_storage.md.html#Storage
			//var db = window.openDatabase("drinkbbo", "1.0", "Drinkbo CC", 1000000);
			//$.drinkbo.init();
			
			
		    	if (this.isAndroid) {
		       		//cordova.exec(function(winParam) {alert(winParam);}, function(e) {alert(e);}, "ActivityPlugin", null, ["com.drinkbo.MainViewActivity"]);
		       		//navigator.activityPlugin.Execute("com.drinkbo.MainActivity","echo");
	   		}
		   
		    	try{
		    		$.drinkbo().init();
		     	}catch(e){ alert(e);}
		}
		
    }
};

