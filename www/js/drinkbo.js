;(function ($) {
	
	 	// Muestra / oculta el menú contextual en el centro de la pantalla
	$.fn.contextMenu = function(action, target) {
		
		return this.each(function() {
		 	var 	me = this,
		 		id = $(me).attr('id'),
			    	isMenuContext;
			
			if(id) isMenuContext = $("#" + id + "-popup");
			if (action == "close") {
				if (isMenuContext) { $(me).popup("close"); }
			}
			 else {
			 	// No ejecutar el método pupup de jqm porque no funciona
			 	// si se invoca desde eventos touchscreen (taphold,swipe, swipelef, swiperight, etc.)
			 	//$(this).popup("open");
				var btn = $('<a id="btn-menu-context" href="#menu-context" data-rel="popup" style="display:none"></a>');
						
				$("body").append(btn).promise().done(function(){});	   
				btn.click().promise().done(function(e){
					
					var caption = $(target).is('h2') ? $(target).text(): $(target).parent().find('h2').text();
					
					// Cambia las coordenas xy del contenor base del popup
					//$("#menu-context-popup").css("top",document.body.pageY);
					//$("#menu-context-popup").css("left",document.body.pageX);
						
					$(me).find("li[data-role='divider']")
						.text(caption);
						
					//console.log($(target).find('h2').text() + " " + document.body.pageX);
					$(this).remove();
					
				});
			}
		});
	};

	$.drinkbo = function(){
			
			/**
			 * 
			 * Funciones privadas
			 * 
			 * */
			
			// Inicializa los eventos para jQuery mobile
			function jqmInit(){
				
				if (dkbo){
					$(document).on('pagebeforeshow',dkbo.onPageBeforeShow);
					$(document).on('pageinit',dkbo.onPageInit);
				}else
				   throw new Error('Fatal error!');
			};
			
			// Verifica el estado de la conexión del dispositivo
			function checkConnection() {
				
				if (!cordova) return undefined;
				
				var 	networkState = navigator.connection.type,
					states = {};
					
					states[Connection.UNKNOWN]  = 'Unknown connection';
					states[Connection.ETHERNET] = 'Ethernet connection';
					states[Connection.WIFI]     = 'WiFi connection';
					states[Connection.CELL_2G]  = 'Cell 2G connection';
					states[Connection.CELL_3G]  = 'Cell 3G connection';
					states[Connection.CELL_4G]  = 'Cell 4G connection';
					states[Connection.CELL]     = 'Cell generic connection';
					states[Connection.NONE]     = 'No network connection';
				
				return states[networkState];
				
			}
			
			// Inicializa la librería cordova
			function initCordova(dkObject){
				
				// Se dispara cuando la aplicación se ejecuta en segundo plano (background)
				document.addEventListener("pause", dkObject.onPause, false);
				
				// Se dispara cuando la aplicación se reanuda desde un segundo plano (background)
				document.addEventListener("resume", dkObject.onResume, false);
				
				// Se dispara mientras que la aplicación está online y el dispositivo
				// está conectado a internet.
				document.addEventListener("online", dkObject.onOnline, false);

				// Se dispara mientras que la aplicación está online y el dispositivo
				// está desconectado de internet.
				document.addEventListener("offline", dkObject.onOffline, false);

				// Se dispara cuando el usuario pulsa sobre el botón atrás
				document.addEventListener("backbutton",dkObject.onBackButton, false);

				// Se dispara cuando el nivel de la batería es crítico
				window.addEventListener("batterycritical", dkObject.onBatteryCritical, false);
				
				// Se dispara cuando el nivel de la batería es bajo
				window.addEventListener("batterylow", dkObject.onBatteryLow, false);

				// Se dispara cuando el estado de la batería cambia			
				window.addEventListener("batterystatus", dkObject.onBatteryStatus, false);
				
				// Se dispara cuando se pulsa sobre el botón del menú
				document.addEventListener("menubutton", dkObject.onMenuButton, false);

				// Se dispara cuando se pulsa sobre el botón de búsqueda en dispositivos
				// android
				document.addEventListener("searchbutton", dkObject.onSearchButton, false);
				
				// La captura de los siguientes eventos solo está disponible para
				// dispositivos BlackBerry WebWorks (OS 5.0 and higher).
				
				// Se dispara cuando se pulsa sobre el botón de llamada.
				document.addEventListener("startcallbutton", dkObject.onStartCallButton, false);
				
				// Se dispara cuando se pulsa el botón de finalización de llamada
				document.addEventListener("endcallbutton", dkObject.onEndCallButton, false);
				
				// Se dispara cuando se pulsa sobre el botón de bajar el volumen
				document.addEventListener("volumedownbutton", dkObject.onVolumeDownButton, false);

				// Se dispara cuando se pulsa sobre el botón de subir el volumen
				document.addEventListener("volumeupbutton", dkObject.onVolumeUpButton, false);

			}
			
			/**
			 * 
			 * Funciones públicas
			 * 
			 * */
			
			dkbo = {
				
				options: {
					platform:undefined,
					cordovaPath:"cordova.js",
					cordovaPluginPath:"cordova_plugins.js"
				},
				
				// Inicializa la aplicación
				init: function(opt){
					
					dkbo.options = $.extend(dkbo.options,opt);
										
					$.extend( $.event.special.swipe , {
				
						durationThreshold: 999, 			// Valor por defecto es 1000
						scrollSupressionThreshold: 10, 	// Valor por defecto es 10
						horizontalDistanceThreshold: 30, 	// Valor por defecto es 30
						verticalDistanceThreshold: 75		// Valor por defecto es 75
					});
				  	
				  	$.extend( $.event.special.tap , {
				  		tapholdThreshold: 1500			// Valor por defecto 1000
				  	});
				  	
					$.extend( $.mobile , {	
						allowCrossDomainPages: true		// Valor por defecto false
					});
					
					// Verifica la plataforma y las rutas de acceso a los ficheros JS de la
					// librería de cordova
					if (dkbo.options.platform == "cordova" && dkbo.options.cordovaPath && dkbo.options.cordovaPluginPath)
						// Se dispara cuando la libreía de cordova está completamente cargada,
						// no está relacionada con las conexiones de red, ya que cordova puede
						// trabajar en modo offline
						document.addEventListener('deviceready', dkbo.onDeviceReady, false);
							else jqmInit();
					
				},
				dataBase: $.drinkbo._dataBase,
				device: undefined,
				// Determina si se está ejecutando en un dispositivo móvil
				isMobile: function(){ 
					//$.browser.device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
					return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent); 
				},
				getPath: function(){
					
					var path = null;
					var scripts = document.getElementsByTagName('script');
					var term = 'drinkbo.js';
					for (var n = scripts.length-1; n>-1; n--) {
					        var src = scripts[n].src;
					        if (src.indexOf(term) == (src.length - term.length)) {
					            path = src.substring(0, src.length - term.length);
					            break;
					        }
					}
				   
				    return path;
					
				},
				// La interfaz cordova está preparada
				onDeviceReady: function(e){
								
					// http://docs.phonegap.com/en/3.1.0/cordova_storage_storage.md.html#Storage
					// http://html5sql.com/
					if (dkbo.options.platform=="cordova") {
						
						// La captura de eventos de cordova debe realizarse después o durante la ejecución de
						// este evento (deviceready)
						initCordova(dkbo);
						
						// Abre | inicializa la base de datos
						//dkbo.dataBase().open();
						
						if (cordova.device) dkbo.device = cordova.device; 
						
						dkbo.onPageBeforeShow();
						
						if (navigator.splashscreen) {
							alert('Splashscreen');
							navigator.splashscreen.hide();
							
							<!-- A -->		
							var socio = cargarDatos('socio');
							alert(socio);
							if(socio != '')
							{
								$('#emailLogueo').val(socio.split(';')[7]);	
								$('#passLogueo').val(socio.split(';')[0]);
								logueo();
							}else{
								$.mobile.changePage( "#pageLogueo", { transition: "slide" });
							}
						}							
					}					
				},
				onPause: function(e){
					alert("onPause");
				},
				onResume: function(e){
					alert("onResume");
				},
				onOnline: function(e){
					alert("onOnline");
				},
				onOffline: function(e){
					alert("onOffline");	
				},
				onBackButton: function(e){
					alert("onBackButton");
				},
				onBatteryCritical:function(e){
					alert("onBatteryCritical");
				},
				onBatteryLow: function(e){
					alert("onBatteryLow");
				},
				onBatteryStatus: function(e){
					alert("onBatteryStatus");
				},
				onMenuButton: function(e){
					alert("onMenuButton");
				},
				onSearchButton: function(e){
					alert("onSearchButton");
				},
				
				onStartCallButton: function(e){},
				onEndCallButton: function(e){},
				onVolumeDownButton: function(e){},
				onVolumeUpButton: function(e){},
				
				onPageBeforeShow: function(){
					dkbo.onPageInit();
				},
				onPageInit: function(){
					
					$(window).resize(function() {
						console.log('resize handler called');
					});
					
					//Es necesario eliminar dragstar, principalmente para realizar pruebas
					//de emulación de eventos gestuales básicos en dispositivos sin pantalla táctil
					$(document).on("dragstart", function() { return false;});
					
					//
					$("#panelPedido").on({ popupbeforeposition: function() {
					        var h = $( window ).height();
						       
								if(h > $("#panelPedido-popup").height()){
								 	 $( "#panelPedido" ).css( "height", h-1 );
								}else{
									  $( "#panelPedido" ).css( "height", $("#panelPedido-popup").height() );
								}	
				    		}
					});
					
					
					
					$("#popupPanel").on({ popupbeforeposition: function() {
					        var h = $( window ).height();
							if(h > $("#popupPanel-popup").height()){
								 $( "#popupPanel" ).css( "height", h-1 );
							}else{
								 $( "#popupPanel" ).css( "height", $("#popupPanel-popup").height() );
							}						       
				    	}
					});
					
					$("#panelProductos").on({ popupbeforeposition: function() {
					        var h = $( window ).height();
							var h60 = (parseInt(h)*parseInt(60))/parseInt(100);
							var h40 =(parseInt(h)*parseInt(40))/parseInt(100);						
							$( "#panelProductos-popup" ).css( "top", h40+' !important' );
							//$( "#panelProductos" ).css( "top", h-h70 );
							//if(h > $("#panelProductos-popup").height()){
							$( "#panelProductos-popup" ).css( "height", h60-1 );							
							//}else{
							//	 $( "#panelProductos" ).css( "height", $("#panelProductos-popup").height() );
							//}	
				    	}
					});
					
					$("#panelPedido2").on({ popupbeforeposition: function() {
					        var h = $( window ).height();
							var h60 = (parseInt(h)*parseInt(60))/parseInt(100);
							var h40 =(parseInt(h)*parseInt(40))/parseInt(100);						
							$( "#panelPedido2-popup" ).css( "top", h60+' !important' );
							//$( "#panelProductos" ).css( "top", h-h70 );
							//if(h > $("#panelProductos-popup").height()){
							$( "#panelPedido2-popup" ).css( "height", h40-1 );	
							$( "#panelPedido2" ).css( "height", h40-1 );						
							//}else{
							//	 $( "#panelProductos" ).css( "height", $("#panelProductos-popup").height() );
							//}	
				    	}
					});
					
					// http://api.jquerymobile.com/category/events/
					// http://www.queness.com/post/11755/11-multi-touch-and-touch-events-javascript-libraries
					
					// Inhabilita todos los eventos delegados de las páginas
					$("div[data-role='page']").off("**");
					// Inhabilita el evento virtual para captura de los eventos básicos delmousetouch
					$("div[data-role='page']").off("vclick");
					$("div[data-role='page']").on("click",function(e){
						
					});
					//console.log($("ul[data-role='listview'] >li > a")[0]);
					
					
					// Es necesario eliminar todos los eventos para la navegación entre páginas
					// utilizando $.mobile.changePage
					$("div[data-role='page']").find("ul[data-role='listview'] a").off();
					
					// Elimina elemento de la cesta de la compra (Unidad)
					$("div[data-role='content']").find("ul[data-role='listview'] a").on("swipeleft",function(e){					
						borrarArrastrar($(this).parents('li').attr('id'));						
						e.preventDefault();
						e.stopPropagation();
					});
					
					// Añade elemento a la cesta de la compra (Unidad)
					$("div[data-role='content']").find("ul[data-role='listview'] a").on("swiperight",function(e){								
						anadirArrastrar($(this).parents('li').attr('id'));								
						e.preventDefault();
						e.stopPropagation();
					});
					
					/**
					 * Captura de eventos a nivel de documento jQuery Mobile
					 * 
					 * 	pagechange:
					 * 	vmousedown:
					 * 
					 * */
					
					$(document).on('pageshow', '[data-role=page]', function () {
						console.log('pageshow');
					});
					$(document).on('pagechange', '[data-role=page]', function () {
						console.log('pagechange');
					});
					
					// Necesario para el control de operaciones globales a la aplicaciçón (windows, popups, diágolos, etc.)
					$(document).on('vmousedown', function(e){					
						// Proporciona las coordenadas xy de ratón o touch
						document.body["pageX"]=e.pageX;
						document.body["pageY"]=e.pageY;						
						// Eliminar el menú contextual
						$("#menu-context").contextMenu('close');						
					});				
					
					// Muestra el menú de acciones para el elemento seleccionado (Por defecto se dispara a los 750 milisegundo)
					$("div[data-role='content']").find("ul[data-role='listview'] a").on("taphold",function(e){						
						$("#menu-context").contextMenu('open',e.target);						
						e.preventDefault();
						e.stopPropagation();
						
					});					
					
					//Capturar eventos de click de popupPanel
					$("#popupPanel").find("button").on("click",function(e){				
						if (e.target.id == "back"){
							console.log(e.target.id);
						}						
					});					
				}			
			};
		
		return dkbo;
			
	};
}( jQuery ));


// Captura de eventos, diferencias entre bind, live, delegate, on : 
// http://www.elijahmanor.com/2012/02/differences-between-jquery-bind-vs-live.html
// jquery init event
$(document).on("mobileinit", function(){

	//alert('Inicio');
	$.drinkbo().init({
		platform: $.drinkbo().isMobile() ? "cordova" : undefined
	});
     
});
