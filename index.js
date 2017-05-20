var requestData = {
  action: "",
  params: []
};

var responseData = {
    speech: ""
};

var actions = {
    'TestIntent':function(){
        responseData.speech = "I am stingray bot. Input your data.";
    },
    'FoodIntent':function(){
        responseData.speech = "Tuna tuna tuna tuna";
    },
    'TwoPlus':function(){
        responseData.speech = "I know I know. It's "+requestData.params.first.toString()+requestData.params.second.toString();
    },
	'Help':function(){
		responseData.speech = "I'm confused. Try asking me about my favorite food. Or aske me a math question, I can add numbers.";
	}
};


exports.handler = function(event, context) {

    ParseEventData(event);

    try{
		actions[requestData.action]();
	}catch(e){
		actions['Help']();
	}
	
    context.succeed(responseData);
	//context.succeed(requestData);
};

function ParseEventData(pEvent){
    
    // Get the action

	// TODO: Make recursive function to do this

    //if(typeof pEvent.result.action === "string"){
	if(pEvent.hasOwnProperty('result')){
		// Google Assistant
        requestData.action = pEvent.result.action;
		requestData.params = pEvent.result.parameters;
    }else if(pEvent.hasOwnProperty('request')){
		// Amazon Alexa
		requestData.action = pEvent.request.intent.name;
		//requestData.params = pEvent.request.intent.slots;
	}
    
    // Get the parameters
    //if(typeof pEvent.result.parameters === "object"){
    //    
    //}
    
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    
    var objResponse = speechletResponse;
    
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        speech: objResponse.outputSpeech.text,
        response: objResponse
    };
}