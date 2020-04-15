define([
    'postmonger'
], function(
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var payload = {};
    $(window).ready(onRender);
    
    $(window).onclick(onClick);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);

    connection.on('clickedNext', save);
    //connection.on('clickedBack', onClickedBack);
    //connection.on('gotoStep', onGotoStep);
    
    function onClick(){
        console.log('This is from onclick');
    }

    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
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

        payload['arguments'].execute.inArguments = [{
            "accountSid": accountSid,
            "authToken": authToken,
            "messagingService": messagingService,
            "body": body,
            "to": "{{Contact.Attribute.TestDataEx.PhoneNumber}}",
            "From": "{{Contact.Attribute.TestDataEx.FromPhoneNumber}}"
        }];

        payload['metaData'].isConfigured = true;
        
        console.log("Payload on SAVE function: "+JSON.stringify(payload));
        connection.trigger('updateActivity', payload);

    }                    

});
