var fs = require('fs');
var client, core;

// Automatically greet new users

var greeting =
{
    list: {},
    timeout: false,

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
        var channel = client.chans[to];
        if(channel)
        {
            // Only greet regular users the first time they speak
            var mode = channel.users[from];

            if(mode == '' && !greeting.list[from] && !greeting.timeout)
            {
                greeting.list[from] = true;
                greeting.timeout = true;
                
                setTimeout(function()
                {
                    client.say(to, "Hi there " + from + ", welcome to #OpenKore! Feel free to ask questions about running your bot, configuration, or writing plugins.");
                }, 1000);

                setTimeout(function()
                {
                    client.say(to, "After asking your question, please be patient! Most of us have jobs and you might have to wait a couple hours for a reply.");
                }, 3000);

                // Reset timeout after 1 hour
                setTimeout(function()
                {
                    greeting.timeout = false;
                }, 1000 * 60 * 60);

                // Save list of greeted users into file
                greeting.save_log();
            }
        }
    },

    bind: function()
    {
        for(var i = 0, l = greeting.events.length; i < l; i++)
        {
            var event = greeting.events[i];
            client.addListener(event, greeting[event]);
        }
    },

    unbind: function()
    {
        for(var i = 0, l = greeting.events.length; i < l; i++)
        {
            var event = greeting.events[i];
            client.removeListener(event, greeting[event]);
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

        greeting.bind();
    },
    
    unload: function(_client, _core)
    {
        // Save list of greeted users into file
        greeting.save_log();
        
        greeting.unbind();
        delete client, core, greeting;
    }
}


