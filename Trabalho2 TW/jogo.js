var jogador = 0;
var lado_jogador = 0;
var lado_pc = 0;
var x = 0;
var online=0;

function password() {
  var x = document.getElementById("minha_pass");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}


function onl() { // função para fechar botão online
  var x = document.getElementById('online_text');
  if (x.style.display === 'none') {
    x.style.display = 'block';
  } else {
    x.style.display = 'none';
  }
}

function off() {  // função para fechar botão offline
  var y = document.getElementById('offline_text');

  if (y.style.display === 'none') {
    y.style.display = 'block';
  } else {
    y.style.display = 'none';
  }
}

function rules() {  // função para fechar botão regras
  var z = document.getElementById('rules_text');
  if (z.style.display === 'none') {
    z.style.display = 'block';
  } else {
    z.style.display = 'none';
  }
}

var x = document.getElementById('online_text');
document.getElementById('close_online').addEventListener('click', function () {
  x.style.display = 'none';
});

var y = document.getElementById('offline_text');
document.getElementById('close_offline').addEventListener('click', function () {
  y.style.display = 'none';
});

var z = document.getElementById('rules_text');
document.getElementById('close_rules').addEventListener('click', function () {
  z.style.display = 'none';
});

var w = document.getElementById('dificuldade');
document.getElementById('close_dificuldade').addEventListener('click', function () {
  w.style.display = 'none';
});

var m = document.getElementById('escolha');
document.getElementById('close_escolha').addEventListener('click', function () {
  m.style.display = 'none';
});

var r = document.getElementById('ranks');
document.getElementById('close_ranking').addEventListener('click', function () {
  r.style.display = 'none';
});

document.getElementById('computador').addEventListener('click', function () {
  var z = document.getElementById('offline_text');
  z.style.display = 'none';
  var x = document.getElementById('dificuldade');
  x.style.display = 'block';
});

document.getElementById('Facil').addEventListener('click', function () {
  document.getElementById('escolha').style.display = 'block';
  dificuldade = 1;
  document.getElementById('dificuldade').style.display = 'none';
});


document.getElementById('Medio').addEventListener('click', function () {
  document.getElementById('escolha').style.display = 'block';
  dificuldade = 1;
  document.getElementById('dificuldade').style.display = 'none';
});

document.getElementById('jogador_branco').addEventListener('click', function () {
  lado_jogador = 1;
  lado_pc = 2;
  vez_pc = 1;
  x = 1;
  online=0;
  document.getElementById('total').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  document.getElementById('logo-inicial').style.display = 'none';
  document.getElementById('area-principal').style.display = 'block';
  if (dificuldade == 1) {
    setTimeout(function () { IA_facil(); }, 1000);
  }
  else if (dificuldade == 2) {
    setTimeout(function () { IA_medio(); }, 1000);
  }
});
document.getElementById('jogador_preto').addEventListener('click', function () {
  lado_jogador = 2;
  lado_pc = 1;
  vez_pc = 0;
  online=0;
  x = 2;
  document.getElementById('total').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  document.getElementById('logo-inicial').style.display = 'none';
  document.getElementById('area-principal').style.display = 'block';
  document.getElementById('vez_preto').style.display = 'block';
});
document.getElementById('amigo').addEventListener('click', function () {
  window.alert("Futuramente disponivel");
});



document.getElementById('botao_jogar').addEventListener('click', function () {
  var user = document.getElementById("username");
  var pass = document.getElementById("minha_pass");
  if (user.value == "" || pass.value == "")
    window.alert("Insert username and password before login!");
  else {
    //console.log(user.value);
    //console.log(pass.value);
    loginServer();
  }



});

//var url = 'http://twserver.alunos.dcc.fc.up.pt:8136/';
var url = 'http://localhost:8136/';

//LOGIN
function loginServer() {
  var user = document.getElementById("username").value;
  var pass = document.getElementById("minha_pass").value;
  username = user;
  password = pass;
  acc = {
    nick: user,
    pass: pass
  }
  // envia informação para o servidor
  // POST -> apenas existe uma troca de mensagens e depois a conexão é fechada | GET -> conexão só feixa quando uma das partes a fechar
  // body -> conteudo da mensagem, isto é, argumentos que o pedido precisa
  // JSON.stringfy() -> converte um objeto json para uma string, necessário no envio de mensagens
  fetch(url + "register", {
    method: "POST",
    body: JSON.stringify(acc),
  })
  //recebe informaçao do servidor
    .then(function (r) {
      //console.log(r.json);
      //transforma para string, se quiser transformar em json é r.json()
      return r.text();
    })
    .then(function (t) {
      //console.log(t);
      if (t != "{}") {
        window.alert("Username ou password errados!");
      }
      else {
        document.getElementById('logo-inicial').style.display = 'none';
        document.getElementById('online_text').style.display = 'none';
        document.getElementById('escolha_online').style.display = 'block';
      }
    })
    .catch(function (error) {
      console.log(error);
      return;
    });
}

document.getElementById('online_game').addEventListener('click', function () {
  document.getElementById('total').style.display = 'none';
  document.getElementById('game_online').style.display = 'block';
  document.getElementById('logo-inicial').style.display = 'none';
  document.getElementById('area-principal').style.display = 'block';
  cleanPc();
  joinGame();
});
var color;
var gameId;
var groupName = "GameRR&RJ2";


//JOIN GAME
function joinGame() {
online=1;
  game = {
    group: groupName,
    nick: username,
    pass: password
  }

  fetch(url + "join", {
    method: "POST",
    body: JSON.stringify(game),
  })
    .then(function (r) {
      return r.json();
    })
    .then(function (t) {
      console.log(t);
      gameId = t.game;
      color = t.color;
      //console.log(gameId);
      //console.log(color);
      mudar_pecas(0);
      if(color=="dark")
      {
        document.getElementById("botton_game11").innerHTML = username;
        document.getElementById("botton_game21").innerHTML = "Adversario";
      }
      else {
        document.getElementById("botton_game21").innerHTML = username;
        document.getElementById("botton_game11").innerHTML = "Adversario";
      }
      //update();
      //atribuir a cor ao jogador
    })
    .catch(function (error) {
      console.log(error);
      return;
    });
}

//LEAVE GAME
function leaveGame() {
  game = {
    game: gameId,
    nick: username,
    pass: password
  }

  fetch(url + "leave", {
    method: "POST",
    body: JSON.stringify(game),
  })
    .then(function (r) {
      return r.text();
    })
    .then(function (t) {
      return t;
    })
    .catch(function (error) {
      console.log(error);
      return;
    });
}


var turn;
function checkuser(){
  if(turn==username){
    return true;
  }
  return false;
}

//GET RANKING
function getRanking() {
  var z = document.getElementById('ranks');
  if (z.style.display === 'none') {
    z.style.display = 'block';
  } else {
    z.style.display = 'none';
  }
  fetch(url + "ranking", {
    method: "POST",
    body: JSON.stringify(""),
  })
    .then(function (r) {
      return r.json();
    })
    .then(function (t)
    {
      fillScores(t);
    })

    .catch(function (error) {
      console.log(error);
      return;
    });
}

//NOTIFY SERVER
function notifyServer(move) {
  console.log(move);
  game = {
    nick: username,
    pass: password,
    game: gameId,
    move: move
  }
  fetch(url + "notify", {
    method: "POST",
    body: JSON.stringify(game),
  })
    .then(function (r) {
      return r.text();
    })
    .then(function (t) {
      return t;
    })
    .catch(function (error) {
      console.log(error);
      return;
    });
}

function returnColor(){
  if(color == "dark")
  {
    return 1;
  }
  else
  {
    return 2;
  }
}
//Update
var eventSource;
//var turn;


var turn_online=0;
function update() {
  online=1;
  let urltemp = url + "update?game=" + gameId + "&nick=" + username;
  eventSource = new EventSource(encodeURI(urltemp));
  eventSource.onmessage = function (event) {
    const data = JSON.parse(event.data);
    if (data.winner != undefined) {
      window.alert(data.winner + " ganhou!");
      //leaveGame();
      give_up();
      eventSource.close();
      return;
    }

    //atualizar tabuleiro
    //tabuleiro
    var board = data.board;
    console.log(data.board);
    if(board != undefined){
      atualizar_tabuleiro_online(board);
    }
    //quem joga
    turn = data.turn;
    if(turn_online==0)
    {
      //console.log("mudou1");
      mudar_pecas(0);
      turn_online=1;
    }
    else if(turn_online==1)
    {
      //console.log("mudou");
      mudar_pecas(1);
      turn_online=0;
    }
    //numero de peças brancas/pretas/vazias
    var count = data.count;
    //diz se podes passar
    var skip = data.skip;
    //atualizas tabuleiro
    //erro
    var error = data.error;
  }
}

function fillScores(info){

  info = info.ranking;
  var scoreT = document.getElementById("tableinfo");

  while(scoreT.firstChild){
    scoreT.removeChild(scoreT.firstChild);
  }

  var thM = document.createElement("tr");
  var nameM = document.createElement("th");
  var vicM = document.createElement("th");
  var gamM = document.createElement("th");

  nameM.innerHTML = "Username";
  vicM.innerHTML = "Victorys";
  gamM.innerHTML = "Games";
  thM.appendChild(nameM);
  thM.appendChild(vicM);
  thM.appendChild(gamM);

  scoreT.appendChild(thM);
  for(var i=0; i<info.length; i++){
    var th = document.createElement("tr");

    var player = document.createElement("th");
    var wins = document.createElement("th");
    var games = document.createElement("th");
    player.innerHTML = info[i].nick;
    wins.innerHTML = info[i].victories;
    games.innerHTML = info[i].games;

    th.appendChild(player);
    th.appendChild(wins);
    th.appendChild(games);

    scoreT.appendChild(th);
  }
}