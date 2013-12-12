/**
 * 
 * Control y acceso a la base de datos SqlLite (drinkbo)
 * http://developer.android.com/reference/android/database/sqlite/SQLiteDatabase.html
 * http://docs.phonegap.com/en/3.1.0/cordova_storage_storage.md.html
 * http://www.sqlite.org/lang.html
 * 
 * */

;(function ($) {
	
	// Funciones privadas
	$.drinkbo._dataBase = function(){
	
		var default_options = {
	 				// Nombre sin la extensión
	 				dataBaseame:	"drinkbo",
	 				version: "1.0",
	 				dislplayName: "Drinkbo CC",
	 				size: 200000
		};
		
		// Crear la base de datos
		function createDataBase(tx){
			
			if (!tx) return false;
			
			// CTRL - Control de actualizaciones
			// Atributos de la tabla:
			// 	actualiza 	: Indica el número de versión de actualización.
			// 	fecha 		: La última fecha en la que actualizó los datos.
			//
			tx.executeSql(
			'CREATE TABLE IF NOT EXISTS CTRL ( \
			 	actualiza INTEGER NOT NULL, \
			 	fecha TEXT NOT NULL \
			 )'
		 	);
		 	
		 	// Insertar el primer registro en la tabla de control
		 	tx.executeSql('INSERT INTO CTRL (actualiza, fecha) VALUES (1, "' + (new Date) +'")');
		 	
		 	// Productos
			tx.executeSql(
			'CREATE TABLE IF NOT EXISTS PRODUCTOS ( \
				id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, \
			 	ean TEXT, marca TEXT NOT NULL, \
			 	precio INTEGER NOT NULL, \
			 	imagepath TEXT \
			 )'
		 	);
		 	
		 	/*
		 	"	BEGIN; \
				INSERT INTO fields VALUES ('field1'); \
				COMMIT; \ 
			"
			*/
			
			tx.executeSql('INSERT INTO CTRL (ean, precio) VALUES ("45000030300030", 24.5);
		 	
		 	
		};
		
		// Verifica que el esquema esté creado y gestiona el control
		// de actualizaciones de datos (normalmente datos del usuario, productos y precios)
		function checkModelCTRL(tx){
			
			// Guarda el contexto de la transacción activa
			if (db && db.context && tx) db.tx = tx;
			
			// Solo procesa transacciones si el contexto de la db está creado
			if (db.tx){
				
				// Ejecuta la consulta y devuelve el dataSet
				db.tx.executeSql('SELECT * FROM CTRL',[], function(tx, dataSet){
					
					var len = dataSet.rows.length;
					
			        	console.log("CTRL table: " + len + " rows found.");
			        	
			        
			     	for (var i=0; i<len; i++){
						console.log("Row = " + i + " actualiza = " + dataSet.rows.item(i).actualiza + " fecha =  " + dataSet.rows.item(i).fecha);
					}
						
				},
				// 
				function(err){
					
					// Intenta crear el esquema de la base de datos
				  	if(err.message==undefined) createDataBase(db.tx);
				  		else db.onError(err);
					
				});
			}
			
		}
		
		var db = {
		 	
		 	options: default_options,
	 		context: undefined,
	 		tx: undefined,
	 		open: function(/*dataBaseName, version, dislplayName, size | or options */){
	 			
	 			// Las opciones por defecto deben estar definidas
	 			if (!options) db.options = default_options;
	 			var options = db.options;
	 			
	 			// El primer parámetro es un objeto que debe contener opciones
	 			if (arguments.length == 1 && ($.type === "object"))
	 				$.extend( options , arguments[0]);
	 				
	 			if (arguments.length == 1 && ($.type === "string")) options.dataBaseame = arguments[0];
	 			if (arguments.length == 2) {
	 				if (arguments[0] === "string") options.dataBaseame = arguments[0];
	 				if (arguments[1] === "string") options.version = arguments[1];	
	 			}
	 			if (arguments.length == 3) {
	 				
	 				if (arguments[0] === "string") options.dataBaseame = arguments[0];
	 				if (arguments[1] === "string") options.version = arguments[1];
	 				if (arguments[2] === "string") options.dislplayName = arguments[2];	
	 			}
	 			if (arguments.length == 4) {
	 				
	 				if (arguments[0] === "string") options.dataBaseame = arguments[0];
	 				if (arguments[1] === "string") options.version = arguments[1];
	 				if (arguments[2] === "string") options.dislplayName = arguments[2];
	 				if (arguments[3] === "number") options.size = arguments[3];	
	 			}
	 			
	 			// Siempre que la base de datos no esté abierta
	 			if (!db.context){
	 			
		 			// Abre la base de datos con las opciones especificadas
		 			db.context = (window.openDatabase) ? window.openDatabase(
		 						options.dataBaseame,
		 						options.version,
		 						options.dislplayName,
		 						options.size): undefined;
		 			
		 			// Verificar que la base de datos existe y está creado el esquema del modelo de datos
		 			
		 			if (db.context) {
		 				db.context.transaction(checkModelCTRL, db.onError, db.onSuccess);
		 			}
	 			}
	 		},
	 		onError: function(err){
	 			return false;
	 		},
	 		onSuccess: function(){
	 			return true;
	 		}
	 	};
		
		 	
	 	return db;
		
	};
	
})( jQuery );
