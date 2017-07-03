# StingrayBot

An exmaple nodejs script that handles requests and responses for both Amazon Echo and Google Home from the same instance. This script was written for an AWS Lambda function but should work in any nodejs environment.

## Currently Supports
- Custom intents 
    - *example intents for Startup "Welcome" and instructions "Help" must be set up in your skill interaction model.
- Support for intent parameters (example action "TwoPlus")
- Amazon required intents


## Instructions
First follow directions to set up an Amazon Alexa skill [https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-lambda-function]. Additionally follow the directions here [https://www.raizlabs.com/dev/2017/01/build-ai-assistant-api-ai-amazon-lambda/] to set up Google Assistant service with an AWS Lambda function

Within index.js, all response actions are stored within the actions object. Property names correspond to to the intent request coming from the voice assistant. For example, to use the sample action "Welcome", set up a custom intent called "Welcome" in the Alexa skill interaction model or api.ai agent editor. StingrayBot comes with several built-in responses. The sample action "TwoPlus" uses custom parameters "first" and "second" which are set up in the interaction model and stored in requestData.params within the script e.g. requestData.params.first. Note: the TwoPlus action adds incorrectly on purpose, it's an in-joke because fish can't do math :).

More to come...