var responseData = {
	version: "1.0",
    speech: ""
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

function ParseEventData(pEvent){

	var result = {
		action: "",
		params: []
	};

	var props = {
		'result.action':[
			'result.action',
			'request.intent.name'
		]
	};


	return result;
    
    // Get the action

	// TODO: Make recursive function to do this

    //if(typeof pEvent.result.action === "string"){
	if(pEvent.hasOwnProperty('result')){
		// Google Assistant
        result.action = pEvent.result.action;
		result.params = pEvent.result.parameters;
    }else if(pEvent.hasOwnProperty('request')){
		// Amazon Alexa
		result.action = pEvent.request.intent.name;
		//result.params = pEvent.request.intent.slots;
	}
    
    // Get the parameters
    //if(typeof pEvent.result.parameters === "object"){
    //    
    //}

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