var fs = require('fs');
var client, core;

// Automatically greet new users

var greeting =
{
    list: [],

    load_log: function()
    {
        try
        {
            var data = fs.readFileSync('logs/greeting.log', 'utf8');
            greeting.list = JSON.parse(data);
        }
        catch(error)
        {
            console.log("/!\\ Error Reading Logfile /!\\", error);
        }
    },

    save_log: function()
    {
        try
        {
            fs.writeFileSync('logs/greeting.log', JSON.stringify(greeting.list));
        }
        catch(error)
        {
            console.log("/!\\ Error Saving Logfile /!\\", error);
        }
    },

    events: ['message'],

    message: function(from, to, message)
    {
        console.log(from, to, message);

        // Save list of greeted users into file
        greeting.save_log();
    },

    bind: function()
    {
        for(var i = 0, l = burn.events.length; i < l; i++)
        {
            var event = burn.events[i];
            client.addListener(event, burn[event]);
        }
    },

    unbind: function()
    {
        for(var i = 0, l = burn.events.length; i < l; i++)
        {
            var event = burn.events[i];
            client.removeListener(event, burn[event]);
        }
    }
};

module.exports =
{
    load: function(_client, _core)
    {
        // Read list of greeted users from saved file
        greeting.load_log();
        
        client = _client;
        core = _core;

        burn.bind();
    },
    
    unload: function(_client, _core)
    {
        // Save list of greeted users into file
        greeting.save_log();
        
        burn.unbind();
        delete client, core, burn, crypto;
    }
}


