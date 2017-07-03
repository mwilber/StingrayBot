var http = require('http');

var responseData = {
	version: "1.0",
    speech: "",
	stayalive: false
};

var props = {
        userid: [
            'session.user.userId',
        ],
		type: [
			'request.type',
		],
		offset: [
			'request.offsetInMilliseconds',
		],
		action:[
			'result.action',
			'request.intent.name'
		],
		params:[
			'result.parameters',
			'request.intent.slots'
		]
	};

// Some sample actions
var actions = {
    'Welcome':function(){
        responseData.speech = "Welcome to Stingray Bot. A boiler plate voice assistant. For more information, say, HELP";
		responseData.stayalive = true;
	},
	'TwoPlus':function(pParams){
		// This is supposed to be a string concatenation, because fish can't do math.
        responseData.speech = "I know I know. It's "+pParams.first.toString()+pParams.second.toString();
    },
    'AMAZON.CancelIntent':function(){
		actions['Cancel']();
	},
	'AMAZON.StopIntent':function(){
		actions['Cancel']();
	},
	'AMAZON.HelpIntent':function(){
	    actions['Help']();
	},
	'Cancel':function(){
	    responseData.speech = "";
	},
	'Help':function(){
		responseData.speech = "This is where I tell you about all my commands. For now, let's try some math. Say, add two plus two";
	    responseData.stayalive = true;
	},
	'Default':function(){
		responseData.speech = "I'm sorry. I don't understand that command.";
	}
};

////////////////////////////////////////////////////////////////////
// Main
////////////////////////////////////////////////////////////////////

exports.handler = function(event, context) {

	 responseData = {
		version: "1.0",
		speech: "",
		stayalive: false
	};

	requestData = ParseEventData(event);
	
	if(requestData.type === "LaunchRequest"){
        actions['Welcome']();
    }else if(requestData.type === "IntentRequest"){
        try{
            actions[requestData.action](requestData.params);
        }catch(e){
			console.log(e);
			actions['Default']();
		}
    }
	
	context.succeed(buildResponse(responseData));
	// Use this during debugging to output how the request data is getting parsed
	//context.succeed(requestData);

};

////////////////////////////////////////////////////////////////////
// Request Handlers
////////////////////////////////////////////////////////////////////

function SeekProperty(pObject, pQuery){
	
	if(pObject.hasOwnProperty(pQuery[0])){
		if(pQuery.length == 1){
			// return the property
			return pObject[pQuery[0]];
		}else{
			// digg deeper
			return SeekProperty(pObject[pQuery[0]], pQuery.slice(1));
		}
	}else{
		return false;
	}
}

// Convert object to simple {name: value} pairs
function NormalizeObject(pObject, pKey, pVal){
	var result = {};
	for( var idx in pObject ){
		var lkey = idx;
		var lval = "";
		if( typeof pObject[idx] === "object"){
			if( pKey !== "" && pObject[idx].hasOwnProperty(pKey) ) lkey = pObject[idx][pKey];
			if( pVal !== "" && pObject[idx].hasOwnProperty(pVal) ){
				lval = pObject[idx][pVal];
			}
		}else{
			lval = pObject[idx];
		}
		result[lkey] = lval;
	}
	return result;
}

function ParseEventData(pEvent){

	var result = {};

	for(var prop in props){
		//console.log(prop);
		for( var path in props[prop]){
			var query = props[prop][path].split('.');
			var value = SeekProperty(pEvent, query);
			if( value !== false ){
				result[prop] = value;
				if(prop == 'params'){
					// Amazon returns 'slots' as an array of objects with properties 'name' and 'value'
					result[prop] = NormalizeObject(result[prop], 'name', 'value');
				}
				break;
			}
		}
	}

	return result;
}

////////////////////////////////////////////////////////////////////
// Response Handlers
////////////////////////////////////////////////////////////////////

function buildResponse(pData) {
    
    var response = {
    version: pData.version,
    //sessionAttributes: sessionAttributes,
    speech: pData.speech,
        "response": {
            outputSpeech: {
    			type: "PlainText",
    			ssml: "<speak>"+pData.speech+"</speak>",
    			text: pData.speech
    		},
    		shouldEndSession: true,
      }
    };
    if( responseData.stayalive === true){
        response.response['shouldEndSession'] = false;
    }
    return response;
    
}