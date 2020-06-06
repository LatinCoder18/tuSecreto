var request = require('request');
var irc = require('irc');
const TelegramBot = require('node-telegram-bot-api');
var CronJob = require('cron').CronJob;
var fs = require('fs');

var config = require('./config.json');
//var secrets = require('./database.json');
const token = '629645239:AAEjxhsWgTz4W22BECAmI8dhtl64WNre7z8';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

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
    '0 */2 * * * *',
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
var jobAPP = new CronJob(
    '0 */50 * * * *',
    function () {
        client.say('#lobby',' Tenemos nuestra propia aplicación  en la PlayStore puede descargarla del siguiente link y valorarnos de 5 estrellas para que mas usuarios la vean. https://play.google.com/store/apps/details?id=org.segured.irc  o de lo contrario puede buscarla por el nombre de Segured-Chat en la Play Store');
    },
    null,
    false,
    'America/Havana'
);
jobAPP.start();

var job = new CronJob(
    '0 */45 * * * *',
    function () {
        console.log('Hola');

    },
    null,
    false,
    'America/Havana'
);
job.start();

    
 
function decirSecreto() {
    fs.readFile('secreto.txt', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        data = data.toString('utf8');
        data = data.split('\n');
        console.log(data);
        var aleatorio = Math.round(Math.random() * data.length);
        
        client.say('#secretos',data[aleatorio]);
        bot.sendPhoto('-1001215282688',"secreto.png",{caption : data[aleatorio]} );

    });
}