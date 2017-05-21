var responseData = {
	version: "1.0",
    speech: ""
};

var props = {
		'action':[
			'result.action',
			'request.intent.name'
		],
		'params':[
			'result.parameters',
			'request.intent.slots'
		]
	};

var actions = {
    'TestIntent':function(){
        responseData.speech = "I am stingray bot. Input your data.";
    },
    'FoodIntent':function(){
        responseData.speech = "Tuna tuna tuna tuna";
    },
    'TwoPlus':function(pParams){
		// This is supposed to be a string concatenation, because fish can't do math. IT'S A JOKE.
        responseData.speech = "I know I know. It's "+pParams.first.toString()+pParams.second.toString();
    },
	'Help':function(){
		responseData.speech = "I'm confused. Try asking me about my favorite food. Or aske me a math question, I can add numbers.";
	}
};


exports.handler = function(event, context) {

    var requestData = ParseEventData(event);

    try{
		actions[requestData.action](requestData.params);
	}catch(e){
		actions['Help']();
	}
	
    //context.succeed(buildResponse(responseData));
	context.succeed(requestData);
};

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


function ParseEventData(pEvent){

	var result = {};

	for(prop in props){
		//console.log(prop);
		for(path in props[prop]){
			var query = props[prop][path].split('.');
			var value = SeekProperty(pEvent, query);
			if( value !== false ){
				result[prop] = value;
				break;
			}
		}
	}

	return result;
    
}

function buildResponse(pData) {
    
    return {
        version: pData.version,
        //sessionAttributes: sessionAttributes,
        speech: pData.speech,
        response: {
			outputSpeech: {
				type: "PlainText",
				text: pData.speech
			},
			// reprompt: {
			// 	outputSpeech: {
			// 		type: "PlainText",
			// 		text: repromptText
			// 	}
			// },
			//shouldEndSession: shouldEndSession
		}
    };
}