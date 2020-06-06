var request = require('request');
var irc = require('irc');
var CronJob = require('cron').CronJob;
var fs = require('fs');

var config = require('./config.json');
//var secrets = require('./database.json');


var client = new irc.Client(config.bot.server, config.bot.name, {
    userName: config.bot.username,
    realName: config.bot.realname,
    channels: config.bot.channels,
    debug: true,
    port: config.bot.port
});

client.addListener('registered', function () {
    client.say('nickserv', 'identify ' + config.bot.password);
    client.part("#trivia","Su bot de los secretos esta aquí ;)");
})

client.addListener('error', function (message) {
    console.log('error: ', message);
});

var job = new CronJob(
    '0 */1 * * * *',
    function () {
        decirSecreto();
    },
    null,
    false,
    'America/Havana'
);

job.start();
var jobLobby = new CronJob(
    '0 */45 * * * *',
    function () {
        client.say('#lobby','Tenemos un canal, en el cual, cada determinado tiempo el bot dice un secreto, puede ser muy bueno o puede ser muy malo, hay de distintos temas si desea unirse al canal escriba el comando /join #secretos cada 25 minutos, el bot les estará entregando un secreto y los usuarios podrán debatirlo  ');
    },
    null,
    false,
    'America/Havana'
);
jobLobby.start();
function decirSecreto() {
    fs.readFile('secretos.txt', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        data = data.toString('utf8');
        data = data.split('\n');
        console.log(data);
        var aleatorio = Math.round(Math.random() * data.length);
        client.say('#secretos',data[aleatorio]);
    });
}