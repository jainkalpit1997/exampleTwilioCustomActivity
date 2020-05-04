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
                    $('#accountSID').val('AC85bca8d32b953e66c4f89c777c4260ba');
                }

                if (key === 'authToken') {
                    $('#authToken').val('073b55596ed71d67d6d3360e520eaf00');
                }

                if (key === 'messagingService') {
                    $('#messagingService').val('MG13d9d0e5aff49c7d55e454a1cb5df548');
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
        
        var accountSid ='AC85bca8d32b953e66c4f89c777c4260ba'; //$('#accountSID').val();
        var authToken = '073b55596ed71d67d6d3360e520eaf00';//$('#authToken').val();
        var messagingService ='MG13d9d0e5aff49c7d55e454a1cb5df548'; // $('#messagingService').val();
        var body = $('#messageBody').val();
        
        dataExtensionName = "{{Event."+eventDefinitionKey+".deName}}";
        payload['arguments'].execute.inArguments = [{
            "accountSid": accountSid,
            "authToken": authToken,
            "messagingService": messagingService,
            "body": body,
           "to": "{{Contact.Attribute."+dataExtensionName+".PhoneNumber}}",
        "From": "{{Contact.Attribute."+dataExtensionName+".FromPhoneNumber}}"
        }];

        payload['metaData'].isConfigured = true;
        console.log("dataExtensionName: "+ dataExtensionName);
        console.log("Payload on  SAVE function: "+JSON.stringify(payload));
        connection.trigger('updateActivity', payload);

    }                    
   
});
