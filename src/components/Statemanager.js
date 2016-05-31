var jQuery = require('jquery');
var $ = jQuery;

var Statemanager = new function(){
    
    var results = {};

    this.get = function(context, stateDataName, url){
        
        if(results[stateDataName]){
            var state = {};
            state[stateDataName] = results[stateDataName];
            context.setState(state);
            return state[stateDataName];
        }
        
        var authorization = localStorage.getItem("api-authorization");
        
        if(!authorization){
            window.location = 'auth.php';
            return;
        }
        
        $.ajax(url, {

            headers: {
                'Authorization': authorization
            },

            success: function(data, textStatus, jqXHR){

                var result = {
                        data: data,
                        synced_on: (new Date()).toISOString()
                    },
                    state = {};

                state[stateDataName] = result;
                state[stateDataName].type = 'live';
                
                results[stateDataName] = state[stateDataName];
                localStorage.setItem("state-"+stateDataName, JSON.stringify(result));
                context.setState(state);
            },

            error: function(jqXHR, textStatus, errorThrown){
                switch(errorThrown){
                    case 'Unauthorized':
                        window.location = 'auth.php';
                        break;
                    default:
                        var state = {},
                            storedResult = localStorage.getItem("state-"+stateDataName);
                        if(storedResult){
                            storedResult = JSON.parse(storedResult);
                            state[stateDataName] = storedResult;
                            state[stateDataName].type = 'cache';
                            results[stateDataName] = state[stateDataName];
                            context.setState(state);
                        }else{
                            state[stateDataName] = {type: null}
                            context.setState(state);
                        }
                        console.log(storedResult);
                        console.log(jqXHR, textStatus, errorThrown)
                }
            }
        });
        
        return null;


    }

};

module.exports = Statemanager;