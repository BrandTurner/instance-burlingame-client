var Sendqueue = new function(){
    
    var QUEUE_NAME = "api-queue",
        self = this;
    
    this.send = function(endpoint, data, shouldSendAll){
        $.ajax(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem("api-authorization")
            },
            data: data,
            success: function(result){
                console.log(result);
                if(shouldSendAll !== false)
                    self.sendAll();
            },
            error: function(){
                self.push(endpoint, data);
            }
        });
    }
    
    this.push = function(endpoint, data){
        var currentQueue = localStorage.getItem(QUEUE_NAME);
        if(currentQueue)
            currentQueue = JSON.parse(currentQueue);
        else
            currentQueue = [];
        currentQueue.push({
            endpoint: endpoint,
            data: data
        });
        localStorage.setItem(QUEUE_NAME, JSON.stringify(currentQueue));
    }
    
    this.sendAll = function(){
        
        var currentQueue = localStorage.getItem(QUEUE_NAME);
        
        if(!currentQueue)
            return;
        
        currentQueue = JSON.parse(currentQueue);
        
        if(currentQueue.length == 0)
            return;
        
        localStorage.setItem(QUEUE_NAME, JSON.stringify([]));
        
        $.each(currentQueue, function(i, item){
            self.send(item.endpoint, item.data, false);
        });
        
    }

};

module.exports = Sendqueue;