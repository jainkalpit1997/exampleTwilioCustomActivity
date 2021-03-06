define([
    'postmonger'
], function(
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};
    var eventDefinitionKey;
    var dataExtensionName;
    $(window).ready(onRender);
    
    window.addEventListener("click", function(event) {
        console.log('This is from onclick');
    });

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    
    connection.on('clickedNext', save);
    //connection.on('clickedBack', onClickedBack);
    //connection.on('gotoStep', onGotoStep);
    connection.on('requestedInteraction', function(interaction) { Console.log('Inside interaction');
                                                       console.log(JSON.stringify(interaction));         
                                                                });
    connection.on('initActivityRunningHover', function(payload) { Console.log('Inside hover'); });
    connection.on('requestedTriggerEventDefinition',
                                function(eventDefinitionModel) {
                                                     if(eventDefinitionModel){
       
                                                 eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
                                                  console.log(">>>Event Definition Key " + eventDefinitionKey);
                                                   /*If you want to see all*/
                                                console.log('>>>Request Trigger', 
                                                JSON.stringify(eventDefinitionModel));
                                                 }

                                });
    connection.on('requestedSchema', function (data) {
   // save schema
        console.log('*** Schema ***', JSON.stringify(data['schema']));
    });
    
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        console.log('Inside render');
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        connection.trigger('requestedInteraction');
        connection.trigger('initActivityRunningHover');
         connection.trigger('requestTriggerEventDefinition');
        connection.trigger('requestSchema');
    }

  function initialize(data) {
        console.log("Initializing data data: "+ JSON.stringify(data));
        if (data) {
            payload = data;
        }    

        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
         );
         console.log('hasInArguments'+ hasInArguments);
        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};
        
        console.log('Has In arguments: '+JSON.stringify(inArguments));

        $.each(inArguments, function (index, inArgument) {
         
            $.each(inArgument, function (key, val) {
            console.log('Has In arguments: '+key+'  '+val);

                if (key === 'accountSid') {
                    $('#accountSID').val('Your_Account_SID');
                }

                if (key === 'authToken') {
                    $('#authToken').val('Your_Auth_Token');
                }

                if (key === 'messagingService') {
                    $('#messagingService').val('Your_Messaging_Service_SID');
                }
                
                if (key === 'dataExtension'){
                    $('#dataExtension').val(val);
                }

                if (key === 'body') {
                    $('#messageBody').val(val);
                }
            })
        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });

    }

    function onGetTokens (tokens) {
        // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
        console.log("Tokens function: "+JSON.stringify(tokens));
        //authTokens = tokens;
    }

    function onGetEndpoints (endpoints) {
        // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
        console.log("Get End Points function: "+JSON.stringify(endpoints));
    }

    function save() {
        
        var accountSid ='Your_Account_SID'; //$('#accountSID').val();
        var authToken = 'Your_Auth_Token';//$('#authToken').val();
        var messagingService ='Your_Messaging_Service_SID'; // $('#messagingService').val();
        var body = $('#messageBody').val();
        dataExtensionName = $('#dataExtension').val();
        payload['arguments'].execute.inArguments = [{
            "accountSid": accountSid,
            "authToken": authToken,
            
            "messagingService": messagingService,
            "body": body,
           "to": "{{Contact.Attribute."+dataExtensionName+".PhoneNumber}}"
       
        }];

        payload['metaData'].isConfigured = true;
        console.log("dataExtensionName: "+ dataExtensionName);
        console.log("Payload on  SAVE function: "+JSON.stringify(payload));
        connection.trigger('updateActivity', payload);

    }                    
   
});
