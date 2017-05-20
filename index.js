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
    }
};


exports.handler = function(event, context) {
    ParseEventData(event);
    actions[requestData.action]();
    context.succeed(responseData);
};

function ParseEventData(pEvent){
    
    // Get the action
    if(typeof pEvent.result.action === "string"){
        requestData.action = pEvent.result.action;
    }
    
    // Get the parameters
    if(typeof pEvent.result.parameters === "object"){
        requestData.params = pEvent.result.parameters;
    }
    
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