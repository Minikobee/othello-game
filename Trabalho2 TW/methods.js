const file = require('fs');
const crypto = require('crypto');
const headers = require("./headers.js").headers;

var account = [];
var rooms = [];



class Game {
    constructor(gameId) {
        this.gameId = gameId;
        this.p1 = "";
        this.p2 = "";
        this.board = [
            [ 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 1, 2, 0, 0, 0],
            [ 0, 0, 0, 2, 1, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 0],
          ];
    }
    //GameId
    getGameId() {
        return this.gameId;
    }
    //player1 
    getPlayer1() {
        return this.p1;
    }
    setPlayer1(nick) {
        this.p1 = nick;
    }
    //Player 2
    getPlayer2() {
        return this.p2;
    }
    setPlayer2(nick) {
        this.p2 = nick;
    }
}


if (file.existsSync("accounts.json")) {
    preencheraccount();
}

function preencheraccount() {
    let data = file.readFileSync("accounts.json");
    if (data.length === 0)
        return;
    let parsedData = JSON.parse(data.toString())["users"];
    for (let i = 0; i < parsedData.length; i++) {
        account.push(parsedData[i]);
    }


}

module.exports.methodPost = function (pathname, request, query, response) {
    switch (pathname) {
        case '/register':
            register(query.nick, query.pass, response);
            break;
        case '/join':
            join(query.group, query.nick, query.pass, response);
            break;
        case '/leave':
            leave(query.game, query.nick, query.pass, response);
            break;
        case '/ranking':
            ranking(response);
            break;
        case '/notify':
            notify(query.game, query.nick, query.pass, query.move, response)
            break;
        default:
            response.writeHead(404, headers.plain);
            response.end();
            break;
    }
}

//register
function register(nick, pass, response) {
    if (nick === null || nick === undefined) {
        response.writeHead(400, headers.plain);
        response.write(JSON.stringify({ error: 'username undefined' }));
        response.end();
        return;
    }
    if (pass === null || pass === undefined) {
        response.writeHead(400, headers.plain);
        response.write(JSON.stringify({ error: 'password undefined' }));
        response.end();
        return;
    }
    if (nick === "" || pass === "") {
        response.writeHead(400, headers.plain);
        response.write(JSON.stringify({ error: 'username and password cant be empty' }));
        response.end();
        return;
    }
    const hash = crypto.createHash('md5').update(pass).digest('hex');

    for (let i = 0; i < account.length; i++) {
        if (nick === account[i].nick && hash === account[i].pass) {
            response.writeHead(200, headers.plain);
            response.write(JSON.stringify({}));
            response.end();
            return;
        }
        if (nick === account[i].nick && hash !== account[i].pass) {
            response.writeHead(401, headers.plain);
            response.write(JSON.stringify({ error: 'password doenst match' }));
            response.end();
            return;
        }
    }
    let newuser = {
        nick: nick,
        pass: hash,
        victories: 0,
        games: 0
    };
    addaccount(newuser);
    response.writeHead(200, headers.plain);
    response.write(JSON.stringify({}));
    response.end();
}

function addaccount(newuser) {
    account.push(newuser);
    let data = {
        users: account
    };
    file.writeFileSync("accounts.json", JSON.stringify(data));
}

//ranking
function ranking(response) {
    insertionsort();
    var ranking = [];
    for (let i = 0; i < account.length; i++) {
        if (i == 10)
            break;
        let ranke = {
            nick: account[i].nick,
            games: account[i].games,
            victories: account[i].victories
        };
        ranking.push(ranke);
    }
    rank = { ranking: ranking };
    response.writeHead(200, headers.plain);
    response.write(JSON.stringify(rank));
    response.end();

}

function insertionsort() {
    for (let i = 1; i < account.length; i++) {
        let key = account[i];
        let j = i - 1;
        while (j >= 0 && account[j].victories < key.victories) {
            account[j + 1] = account[j];
            j = j - 1;
        }
        account[j + 1] = key;
    }

}

//join
function join(group, nick, pass, response) {

    if (nick === null || nick === undefined) {
        response.writeHead(400, headers.plain);
        response.write(JSON.stringify({ error: "User is undefined" }));
        response.end();
        return;
    }
    if (pass === null || pass === undefined) {
        response.writeHead(400, headers.plain);
        response.write(JSON.stringify({ error: "Password is undefined" }));
        response.end();
        return;
    }
    if (group === null || group === undefined) {
        response.writeHead(400, headers.plain);
        response.write(JSON.stringify({ error: "Game is undefined" }));
        response.end();
        return;
    }
    if (nick === "" || pass === "") {
        let answer = JSON.stringify({ error: "User and Password can't be empty" });
        response.writeHead(401, headers.plain);
        response.write(answer);
        response.end();
        return;
    }

    let json;

    if (rooms.length === 0) {
        var hashgame = crypto.createHash('md5').update(group).digest('hex');
        var gam = new Game(hashgame);
        gam.setPlayer1(nick);
        rooms.push(gam);
        json = {
            game: hashgame,
            color: "dark"
        }
        console.log(gam);
    }
    else{
        rooms.forEach(gam => {
            if (gam.getPlayer1() != "" || gam.getPlayer2() == "") {
                    if(gam.getPlayer1() == nick){
                        response.writeHead(400, headers.plain);
                        response.write(JSON.stringify({ error: "users cant be the same" }));
                        response.end();
                        return;
                    }
                gam.setPlayer2(nick);
                json = {
                    game: gam.getGameId(),
                    color: "light"
                }
                console.log(gam);
                return;
            }
        });
    }
    response.writeHead(200, headers.plain);
    response.write(JSON.stringify(json));
    response.end();
    return;
}


function leave(game,nick,pass,response){


    if (nick === null || nick === undefined) {
        response.writeHead(400, headers.plain);
        response.write(JSON.stringify({ error: "User is undefined" }));
        response.end();
        return;
    }
    if (pass === null || pass === undefined) {
        response.writeHead(400, headers.plain);
        response.write(JSON.stringify({ error: "Password is undefined" }));
        response.end();
        return;
    }
    if (game === null || game === undefined) {
        response.writeHead(400, headers.plain);
        response.write(JSON.stringify({ error: "Game is undefined" }));
        response.end();
        return;
    }
    if (nick === "" || pass === "") {
        let answer = JSON.stringify({ error: "User and Password can't be empty" });
        response.writeHead(401, headers.plain);
        response.write(answer);
        response.end();
        return;
    }


    rooms.forEach(gam => {
        if(gam.getGameId()=== game){
            //gam.remove();
            gam.setPlayer1("");
            gam.setPlayer2("");
            rooms = [];
        }
        console.log(gam);
        //console.log(rooms.length);
        response.writeHead(200, headers.plain);
        response.write(JSON.stringify({}));
        response.end();
    });
}
