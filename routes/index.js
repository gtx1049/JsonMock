var express = require('express');
var router = express.Router();

var fs=require('fs');
var path = require('path');

var pwd = path.join(__dirname, 'json') + '/'; 

/* GET home page. */
router.get('/', function(req, res) {
  res.render('JsonMock', { title: 'Express' });
});

router.post('/debug', function(req, res){
	res.set({'Content-Type':'text/json','Encodeing':'utf8'}); 
	res.send(interfacetable);
});

var interfacetable = {};
//var interfaces;
var registertable = {};

router.post('/register/interface', function(req, res){
    res.set({'Content-Type':'text/json','Encodeing':'utf8'}); 

    var interfaces = req.body;
    var id = req.headers['id'];
    //console.log(id);

    interfacetable[id] = interfaces;

    var count = interfaces['count'];

    for(var i = 0; i < count; i++){
    	var item = interfaces[i.toString()];
    	var interface = item['interfaceName'];
    	var json = item['json'];

		//if(registertable[interface] == null){
			//registertable[interface] = true;

	    	router.post(interface, function(req, res){
	    		//console.log(req);
	    		res.set({'Content-Type':'text/json','Encodeing':'utf8'});

	    		url = req.url;

	    		for (var idinner in interfacetable) {
	    			
					var interfacesinner = interfacetable[idinner];
					
					var localcount = interfacesinner['count'];

		    		var localjson;
				    for(var i = 0; i < localcount; i++){
				    	var localitem = interfacesinner[i.toString()];
				    	var localinterface = localitem['interfaceName'];
				    	if(localinterface == url)
				    		localjson = localitem['json'];
				    }
				}

	    		res.send(JSON.parse(localjson))
	    	});
		//}    	
    }

    res.send({})

})


module.exports = router;
