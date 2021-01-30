// Realizado por Rui Jorge & Rita Romani

var tabela = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

document.getElementById(45).className = "peca preto";
document.getElementById(54).className = "peca preto";
document.getElementById(44).className = "peca branca";
document.getElementById(55).className = "peca branca";


var dificuldade = 0; // dificuldade 1-Facil  2-Dificil
var pontos1 = 2;
var pontos2 = 2;
var flag_repeticao=0;
var pontos_max=0; // usado no algoritmo IA_Medio
atualizar_pontos();  // Ao começar jogo atualizar logo para 20
var x_max=0; // Y que vai ter a jogada com mais pontos (IA dificuldade Medio)
var y_max=0; // X que vai ter a jogada com mais pontos (IA dificuldade Medio)
var pecas = 0;
var vez_pc = 0;
document.getElementById('pontos_branco').innerHTML = 2;
document.getElementById('pontos_preto').innerHTML = 2;

function mudar_pecas(mudanca)
{
  if(mudanca==0)
  {
    if(online==1)
    {
       //console.log("Cima Visivel");
       document.getElementById('vez_preto1').style.display = 'block';
       document.getElementById('vez_branca1').style.display = 'none';
    }
    else
    {
      document.getElementById('vez_preto').style.display = 'none';
      document.getElementById('vez_branca').style.display = 'block';
    }
  }
  else if(mudanca==1)
  {
    if(online==1)
    {
      console.log("Baixo Visivel");
      document.getElementById('vez_preto1').style.display = 'none';
      document.getElementById('vez_branca1').style.display = 'block';
    }
    else
    {
      document.getElementById('vez_preto').style.display = 'block';
      document.getElementById('vez_branca').style.display = 'none';
    }
  }
}


function inserir_peca_online(y_coord, x_coord)
{
  if(online==1)
  {
    tabela[y_coord][x_coord]= 2;
    //atualizar_tabuleiro(y_coord, x_coord, 2);
    console.log("preto jogou");
    imprimir_tabela();
    online=2;
    update(y_coord,x_coord,2);
  }
  else if(online==2)
  {
    tabela[y_coord][x_coord]=1;
    //atualizar_tabuleiro(y_coord, x_coord, 1);
    console.log("branco jogou");
    imprimir_tabela();
    online=1;
    update(y_coord,x_coord,1);
  }
}

function inserir_peca(y_coord, x_coord) {
  if (tabela[y_coord][x_coord] != 0) {
    throw new Error("Essa posição ja possui peça"); // Erro invisivel mas window.alert nao funciona neste caso e usar return faz o mesmo porque nao para a função.
    // Evita que a vez passe caso o jogador jogue uma cell que já possui uma peça.
  }
  var pecas = 4;
  var m;
  if (x == 2 && vez_pc == 0) {
    if ((tabela[y_coord - 1][x_coord] == lado_pc|| tabela[y_coord][x_coord - 1] == lado_pc
      || tabela[y_coord + 1][x_coord] == lado_pc || tabela[y_coord][x_coord + 1] == lado_pc || tabela[y_coord+ 1][x_coord + 1] == lado_pc
      || tabela[y_coord - 1][x_coord - 1] == lado_pc  || tabela[y_coord - 1][x_coord + 1] == lado_pc || tabela[y_coord + 1][x_coord - 1] == lado_pc )
      && verificar_tabuleiro(y_coord, x_coord, lado_jogador, lado_pc) == 1) {
      mudar_pecas(0)
      tabela[y_coord][x_coord] = lado_jogador;
      var id = y_coord + "" + x_coord;
      if(lado_jogador==2)
      {
      document.getElementById(id).className = "peca preto";
    }
    else if(lado_jogador==1)
      {
        document.getElementById(id).className = "peca branca";
      }
      atualizar_tabuleiro(y_coord, x_coord, lado_jogador);
      atualizar_pontos();
      fim_de_jogo();
    }
    else {
      throw new Error("Posiçao mal jogada "); // Evita que a vez passe caso o jogador jogue uma peça indisponivel.
      return;
    }
    x = 1;
  }
  if (dificuldade == 1) { // Dificuldade 1 = Facil
      mudar_pecas(0);
    vez_pc = 1;
    flag_repeticao=0;
    setTimeout(function () { IA_facil(); }, 1000); // Delay quando for o IA a jogar para o jogo não ser tão acelerado !!
  }
  else if (dificuldade == 2) { // Dificuldade 2= Medio
      mudar_pecas(0);
    vez_pc = 1;
    setTimeout(function () { IA_medio(); }, 1000);
  }
  console.log("Inicio");
  imprimir_tabela();
  console.log("Fim");
}

function cleanPc(){
  vez_pc = 0;
  x = 0;
  online = 1;
}

function IA_facil() {
  for (var i=1; i <= 8; i++) {
    for (var k=1; k <= 8; k++) {
    if(verificar_tabuleiro(i,k,lado_pc,lado_jogador)==0 && i==8 && k==8 && flag_repeticao==1)
      {
        mudar_pecas();
        console.log("coiso x:%d y:%",i,k);
        console.log("pc:%d jogador:%d",lado_pc,lado_jogador);
        x=2;
        vez_pc=0;
        return;
      }
       if ((tabela[i - 1][k] == lado_jogador || tabela[i][k - 1] == lado_jogador
        || tabela[i + 1][k] == lado_jogador || tabela[i][k + 1] == lado_jogador || tabela[i + 1][k + 1] == lado_jogador
        || tabela[i - 1][k - 1] == lado_jogador || tabela[i - 1][k + 1] == lado_jogador || tabela[i + 1][k - 1] == lado_jogador) && verificar_tabuleiro(i, k, lado_pc, lado_jogador) == 1 && tabela[i][k]==0) {
        var random = Math.floor(Math.random() * 3);  // para tornar o robo facil mas ligeiramente imprevisivel mas ainda ser facil derrota-lo.
          if(flag_repeticao==1 ){random=0;}
        if (random == 0) {
          mudar_pecas();
          tabela[i][k] = lado_pc;
          var id = i + "" + k;
          if(lado_pc==1)
          {
          document.getElementById(id).className = "peca branca";
        }
        else if(lado_pc==2)
          {
            document.getElementById(id).className = "peca preto";
          }
          atualizar_tabuleiro(i, k, lado_pc);
          atualizar_pontos();
          fim_de_jogo();
          x = 2;
          vez_pc = 0;
          for(var l=1;l<=8;l++)
          {
            for(var m=1;m<=8;m++)
            {
              if(verificar_tabuleiro(l,m, lado_jogador, lado_pc) == 1)
              {
                  mudar_pecas(1);
                return;
              }
            }
          }
          // Passar a vez ao PC senao conseguirmos jogar
          if(lado_jogador==2)
          {
            mudar_pecas(0);
        }
        else if(lado_jogador==1)
        {
          mudar_pecas(1);
        }
          x=1;
          vez_pc=1;
          setTimeout(function () { IA_facil(); }, 1000);
          return;
        }
      }
    }
  }
  flag_repeticao=1;
  IA_facil() // casos em que nao seleciona nenhuma
}

function IA_medio()
{
  pontos_max=0;
  var flag_medio=0;
  for(var i=1;i<=8;i++)
  {
    for(var k=1;k<=8;k++)
    {
      if(predict_pontos(i,k,1,2)>pontos_max)
      {
        pontos_max=predict_pontos(i,k,1,2);
        flag_medio=1;
      }
    }
  }
  if(flag_medio==1) // Caso encontremos uma peça para jogar
  {
    tabela[y_max][x_max] = 1;
    var id = y_max + "" + x_max;
    if(lado_pc==1)
    {
    document.getElementById(id).className = "peca branca";
  }
  else if(lado_pc==2)
    {
      document.getElementById(id).className = "peca preto";
    }
    atualizar_tabuleiro(y_max, x_max, 1);
    atualizar_pontos();
    fim_de_jogo();
  }
  // Passamos a vez ao player
      mudar_pecas(1);
  x=2;
  vez_pc=0;
  for(var l=1;l<=8;l++) // Se o player nao conseguir jogar entao a vez passa outra vez para o PC
  {
    for(var m=1;m<=8;m++)
    {
      if(verificar_tabuleiro(l,m, 2, 1) == 1)
      {
        return;
      }
    }
  }
  // Vez passa para o PC
  x=1;
  vez_pc=1;
  if(lado_jogador==2)
  {
    mudar_pecas(0);
}
else if(lado_jogador==1)
{
  mudar_pecas(1);
}
  setTimeout(function () { IA_medio(); }, 1000);
}


function predict_pontos(y_y, x_x, vez, oponente) { // Prevê o numero de pontos que o PC ganha se jogar em determinada peça
  if(tabela[y_y][x_x]!=0)return 0;
  var pontos_obtidos=0;
  var peca;
  var flag = 0;
  var k_d = x_x + 1;
  for (; k_d <= 8; k_d++)  // linha horizontal direita
  {
    if (tabela[y_y][k_d] == 0) break;
    if (tabela[y_y][k_d] == oponente) flag = 1;
    if(tabela[y_y][k_d]==vez && flag==0)break;
    if (tabela[y_y][k_d] == vez && flag == 1) {
      pontos_obtidos++;
      x_max=x_x;
      y_max=y_y;
    }
  }
  flag = 0;

  var k_e = x_x - 1;
  for (; k_e >= 1; k_e--)  // linha horizontal esquerda
  {
    if (tabela[y_y][k_e] == 0) break;
    if (tabela[y_y][k_e] == oponente) flag = 1;
    if(tabela[y_y][k_e]==vez && flag==0)break;
    if (tabela[y_y][k_e] == vez && flag == 1) {
      pontos_obtidos++;
      x_max=x_x;
      y_max=y_y;
    }
  }
  flag = 0;

  var k_c = y_y + 1;
  for (; k_c <= 8; k_c++) // vertical cima
  {
    if (tabela[k_c][x_x] == 0) break;
    if (tabela[k_c][x_x] == oponente) flag = 1;
    if(tabela[k_c][x_x]==vez && flag==0)break;
    if (tabela[k_c][x_x] == vez && flag == 1) {
      pontos_obtidos++;
      x_max=x_x;
      y_max=y_y;
    }
  }
  flag = 0;

  var k_b = y_y - 1;
  for (; k_b >= 1; k_b--) {
    if (tabela[k_b][x_x] == 0) break;
    if (tabela[k_b][x_x] == oponente) flag = 1;
    if(tabela[k_b][x_x]==vez && flag==0)break;
    if (tabela[k_b][x_x] == vez && flag == 1) // vertical baixo
    {
      pontos_obtidos++;
      x_max=x_x;
      y_max=y_y;
    }
  }
  flag = 0;
  var k_dd_x = x_x + 1; // diagonal esquerda baixo x
  var k_dd_y = y_y - 1; // diagonal esquerda baixo y
  for (; k_dd_x <= 8; k_dd_x++) {
    if (tabela[k_dd_y][k_dd_x] == 0) break;
    if (tabela[k_dd_y][k_dd_x] == oponente) flag = 1;
    if(tabela[k_dd_y][k_dd_x]==vez && flag==0)break;
    if (tabela[k_dd_y][k_dd_x] == vez && flag == 1) {
      pontos_obtidos++;
      x_max=x_x;
      y_max=y_y;
    }
    k_dd_y--;
  }
  flag = 0;
  var k_db_x = x_x + 1; // diagonal esquerda cima x
  var k_db_y = y_y + 1; // diagonal esquerda cima y
  for (; k_db_x <= 8; k_db_x++) {
    if (tabela[k_db_y][k_db_x] == 0) break;
    if (tabela[k_db_y][k_db_x] == oponente) flag = 1;
    if(tabela[k_db_y][k_db_x]==vez && flag==0)break;
    if (tabela[k_db_y][k_db_x] == vez && flag == 1) {
      pontos_obtidos++;
      x_max=x_x;
      y_max=y_y;
    }
    k_db_y++;
  }
  flag = 0;
  var k_ddc_x = x_x - 1; // diagonal direita cima
  var k_ddc_y = y_y + 1; // diagonal direita cima
  for (; k_ddc_x >= 1; k_ddc_x--) {
    //  console.log("analise x:%d y:%d",k_dd_x,k_dd_y);
    if (tabela[k_ddc_y][k_ddc_x] == 0) break;
    if (tabela[k_ddc_y][k_ddc_x] == oponente) flag = 1;
    if(tabela[k_ddc_y][k_ddc_x]==vez && flag==0)break;
    if (tabela[k_ddc_y][k_ddc_x] == vez && flag == 1) {
      pontos_obtidos++;
      x_max=x_x;
      y_max=y_y;
    }
    k_ddc_y++;
  }
  flag = 0;
  var k_dde_x = x_x - 1; // diagonal direita baixo
  var k_dde_y = y_y - 1; // diagonal direita baixo
  for (; k_dde_x >= 1; k_dde_x--) {
    //  console.log("analise x:%d y:%d",k_dd_x,k_dd_y);
    if (tabela[k_dde_y][k_dde_x] == 0) break;
    if (tabela[k_dde_y][k_dde_x] == oponente) flag = 1;
    if(tabela[k_dde_y][k_dde_x]==vez && flag==0)break;
    if (tabela[k_dde_y][k_dde_x] == vez && flag == 1) {
      pontos_obtidos++;
      x_max=x_x;
      y_max=y_y;
    }
    k_dde_y--;
  }
  return pontos_obtidos;
}






function atualizar_pontos() { // Atualizar pontos na tabela
  pontos1=0;
  pontos2=0;
  if(lado_jogador==2)
  {
  for (var a = 1; a <= 8; a++) {
    for (var b = 1; b <= 8; b++) {
      if (tabela[a][b] == 1) {
        pontos1 += 1;
      }
      else if (tabela[a][b] == 2) {
        pontos2 += 1;
      }
    }
  }
}
else if(lado_jogador==1)
{
  for (var a = 1; a <= 8; a++) {
    for (var b = 1; b <= 8; b++) {
      if (tabela[a][b] == 2) {
        pontos1 += 1;
      }
      else if (tabela[a][b] == 1) {
        pontos2 += 1;
      }
    }
  }
}
  //console.log("pontos1:%d pontos2:%d",pontos1,pontos2);
  document.getElementById('pontos_branco').innerHTML = pontos1;
  document.getElementById('pontos_preto').innerHTML = pontos2;
  //document.getElementById('pontos_final_preto').innerHTML = pontos1;
  //document.getElementById('pontos_final_branco').innerHTML = pontos2;
  //pontos1 = 0;
  //pontos2 = 0;
}


function virar_pecas_horizontal(y_m, inicio, fim, vez) {
  for (var j = inicio; j < fim; j++) {
    var id = y_m + "" + j;
    if (vez == 1) {
      tabela[y_m][j] = 1;
      document.getElementById(id).className = "peca branca";
    }
    else if (vez == 2) {
      tabela[y_m][j] = 2;
      document.getElementById(id).className = "peca preto";
    }
  }
}

function virar_pecas_vertical(x_m, inicio, fim, vez) {
  for (var j = inicio; j < fim; j++) {
    var id = j + "" + x_m;
    if (vez == 1) {
      tabela[j][x_m] = 1;
      document.getElementById(id).className = "peca branca";
    }
    else if (vez == 2) {
      tabela[j][x_m] = 2;
      document.getElementById(id).className = "peca preto";
    }
  }
}

function virar_pecas_diagonal(x_inicio, x_fim, y_inicio, y_fim, vez, caso) // casos em que o x aumenta
{
  for (var j = x_inicio; j <= x_fim; j++) {
    var id = y_inicio + "" + j;
    if (vez == 1) {
      tabela[y_inicio][j] = 1;
      document.getElementById(id).className = "peca branca";
    }
    else if (vez == 2) {
      tabela[y_inicio][j] = 2;
      document.getElementById(id).className = "peca preto";
    }
    if (caso == 1) {
      y_inicio--;
    }
    else if (caso == 2) y_inicio++;
  }
  console.log("diagonal x:%d y:%d", y_inicio, j);
}

function virar_pecas_diagonal_menos(x_inicio, x_fim, y_inicio, y_fim, vez, caso)  // quando o x tem de diminuir
{
  for (var j = x_inicio; j >= x_fim; j--) {
    var id = y_inicio + "" + j;
    if (vez == 1) {
      tabela[y_inicio][j] = 1;
      document.getElementById(id).className = "peca branca";
    }
    else if (vez == 2) {
      tabela[y_inicio][j] = 2;
      document.getElementById(id).className = "peca preto";
    }
    if (caso == 1) {
      y_inicio--;
    }
    else if (caso == 2) y_inicio++;
  }
  //  console.log("diagonal x:%d y:%d",y_inicio,j);
}


function verificar_tabuleiro(y_y, x_x, vez, oponente) {  // Verifica se é possivel jogar em determinada posição
  if(tabela[y_y][x_x]!=0)return 0;
  var peca;
  var flag = 0;
  var k_d = x_x + 1;
  for (; k_d <= 8; k_d++)  // linha horizontal direita
  {
    if (tabela[y_y][k_d] == 0) break;
    if (tabela[y_y][k_d] == oponente) flag = 1;
    if(tabela[y_y][k_d]==vez && flag==0)break;
    if (tabela[y_y][k_d] == vez && flag == 1) {
      return 1;
    }
  }
  flag = 0;

  var k_e = x_x - 1;
  for (; k_e >= 1; k_e--)  // linha horizontal esquerda
  {
    if (tabela[y_y][k_e] == 0) break;
    if (tabela[y_y][k_e] == oponente) flag = 1;
    if(tabela[y_y][k_e]==vez && flag==0)break;
    if (tabela[y_y][k_e] == vez && flag == 1) {
      return 1;
    }
  }
  flag = 0;

  var k_c = y_y + 1;
  for (; k_c <= 8; k_c++) // vertical cima
  {
    if (tabela[k_c][x_x] == 0) break;
    if (tabela[k_c][x_x] == oponente) flag = 1;
    if(tabela[k_c][x_x]==vez && flag==0)break;
    if (tabela[k_c][x_x] == vez && flag == 1) {
      return 1;
    }
  }
  flag = 0;

  var k_b = y_y - 1;
  for (; k_b >= 1; k_b--) {
    if (tabela[k_b][x_x] == 0) break;
    if (tabela[k_b][x_x] == oponente) flag = 1;
    if(tabela[k_b][x_x]==vez && flag==0)break;
    if (tabela[k_b][x_x] == vez && flag == 1) // vertical baixo
    {
      return 1;
    }
  }
  flag = 0;
  var k_dd_x = x_x + 1; // diagonal esquerda baixo x
  var k_dd_y = y_y - 1; // diagonal esquerda baixo y
  for (; k_dd_x <= 8; k_dd_x++) {
    if (tabela[k_dd_y][k_dd_x] == 0) break;
    if (tabela[k_dd_y][k_dd_x] == oponente) flag = 1;
    if(tabela[k_dd_y][k_dd_x]==vez && flag==0)break;
    if (tabela[k_dd_y][k_dd_x] == vez && flag == 1) {
      return 1;
    }
    k_dd_y--;
  }
  flag = 0;
  var k_db_x = x_x + 1; // diagonal esquerda cima x
  var k_db_y = y_y + 1; // diagonal esquerda cima y
  for (; k_db_x <= 8; k_db_x++) {
    if (tabela[k_db_y][k_db_x] == 0) break;
    if (tabela[k_db_y][k_db_x] == oponente) flag = 1;
    if(tabela[k_db_y][k_db_x]==vez && flag==0)break;
    if (tabela[k_db_y][k_db_x] == vez && flag == 1) {
      return 1;
    }
    k_db_y++;
  }
  flag = 0;
  var k_ddc_x = x_x - 1; // diagonal direita cima
  var k_ddc_y = y_y + 1; // diagonal direita cima
  for (; k_ddc_x >= 1; k_ddc_x--) {
    //  console.log("analise x:%d y:%d",k_dd_x,k_dd_y);
    if (tabela[k_ddc_y][k_ddc_x] == 0) break;
    if (tabela[k_ddc_y][k_ddc_x] == oponente) flag = 1;
    if(tabela[k_ddc_y][k_ddc_x]==vez && flag==0)break;
    if (tabela[k_ddc_y][k_ddc_x] == vez && flag == 1) {
      return 1;
    }
    k_ddc_y++;
  }
  flag = 0;
  var k_dde_x = x_x - 1; // diagonal direita baixo
  var k_dde_y = y_y - 1; // diagonal direita baixo
  for (; k_dde_x >= 1; k_dde_x--) {
    //  console.log("analise x:%d y:%d",k_dd_x,k_dd_y);
    if (tabela[k_dde_y][k_dde_x] == 0) break;
    if (tabela[k_dde_y][k_dde_x] == oponente) flag = 1;
    if(tabela[k_dde_y][k_dde_x]==vez && flag==0)break;
    if (tabela[k_dde_y][k_dde_x] == vez && flag == 1) {
      return 1;
    }
    k_dde_y--;
  }
  return 0;
}

function atualizar_tabuleiro(y_m, x_m, vez) {  // Vira as peças na jogada
  // linhas horizontais
  var k_d = x_m + 1;
  for (; k_d <= 8; k_d++)  // linha horizontal direita
  {
    if (tabela[y_m][k_d] == 0) break;
    if (tabela[y_m][k_d] == vez) {
      //console.log("Condiçao aceite");
      virar_pecas_horizontal(y_m, x_m, k_d, vez);
      break;
    }
  }

  var k_e = x_m - 1;
  for (; k_e >= 1; k_e--)  // linha horizontal esquerda
  {
    if (tabela[y_m][k_e] == 0) break;
    if (tabela[y_m][k_e] == vez) {
      //console.log("Condiçao aceite");
      virar_pecas_horizontal(y_m, k_e, x_m, vez);
      break;
    }
  }

  var k_c = y_m + 1;
  for (; k_c <= 8; k_c++) // vertical cima
  {
    if (tabela[k_c][x_m] == 0) break;
    if (tabela[k_c][x_m] == vez) {
      //console.log("Condiçao aceite");
      virar_pecas_vertical(x_m, y_m, k_c, vez);
      break;
    }
  }

  var k_b = y_m - 1;
  for (; k_b >= 1; k_b--) {
    if (tabela[k_b][x_m] == 0) break;
    if (tabela[k_b][x_m] == vez) // vertical baixo
    {
      //console.log("Condiçao aceite");
      virar_pecas_vertical(x_m, k_b, y_m, vez);
      break;
    }
  }

  var k_dd_x = x_m + 1; // diagonal esquerda baixo x
  var k_dd_y = y_m - 1; // diagonal esquerda baixo y
  for (; k_dd_x <= 8; k_dd_x++) {
    if (tabela[k_dd_y][k_dd_x] == 0) break;
    if (tabela[k_dd_y][k_dd_x] == vez) {
      //console.log("Inicio direita x:%d y:%d  Fim x:%d y:%d",x_m,k_dd_x,y_m,k_dd_y);
      virar_pecas_diagonal(x_m, k_dd_x, y_m, k_dd_y, vez, 1); //x_inicio,x_fim,y_inicio,y_fim,vez)
      break;
    }
    k_dd_y--;
  }

  var k_db_x = x_m + 1; // diagonal esquerda cima x
  var k_db_y = y_m + 1; // diagonal esquerda cima y
  for (; k_db_x <= 8; k_db_x++) {
    if (tabela[k_db_y][k_db_x] == 0) break;
    if (tabela[k_db_y][k_db_x] == vez) {
      //console.log("Inicio direita x:%d y:%d  Fim x:%d y:%d",x_m,k_db_x,y_m,k_db_y);
      virar_pecas_diagonal(x_m, k_db_x, y_m, k_db_y, vez, 2); //x_inicio,x_fim,y_inicio,y_fim,vez)
      break;
    }
    k_db_y++;
  }

  var k_ddc_x = x_m - 1; // diagonal direita cima
  var k_ddc_y = y_m + 1; // diagonal direita cima
  for (; k_ddc_x >= 1; k_ddc_x--) {
    //  console.log("analise x:%d y:%d",k_dd_x,k_dd_y);
    if (tabela[k_ddc_y][k_ddc_x] == 0) break;
    if (tabela[k_ddc_y][k_ddc_x] == vez) {
      //console.log("Inicio esquerda x:%d y:%d  Fim x:%d y:%d",k_db_x,k_db_y,x_m,y_m);
      virar_pecas_diagonal_menos(x_m, k_ddc_x, y_m, k_ddc_y, vez, 2); //x_inicio,x_fim,y_inicio,y_fim,vez)
      //  break;
    }
    k_ddc_y++;
  }

  var k_dde_x = x_m - 1; // diagonal direita baixo
  var k_dde_y = y_m - 1; // diagonal direita baixo
  for (; k_dde_x >= 1; k_dde_x--) {
    //  console.log("analise x:%d y:%d",k_dd_x,k_dd_y);
    if (tabela[k_dde_y][k_dde_x] == 0) break;
    if (tabela[k_dde_y][k_dde_x] == vez) {
      //  console.log("Inicio esquerda x:%d y:%d  Fim x:%d y:%d",k_db_x,k_db_y,x_m,y_m);
      virar_pecas_diagonal_menos(x_m, k_dde_x, y_m, k_dde_y, vez, 1); //x_inicio,x_fim,y_inicio,y_fim,vez)
      //  break;
    }
    k_dde_y--;
  }
}


function fim_de_jogo() {
  var flag_fim=1;
  for (var s = 1; s <= 8; s++) {
    for (var d = 1; d <= 8; d++) {
      if (verificar_tabuleiro(s, d, 1, 2) == 1 || verificar_tabuleiro(s, d, 2, 1) == 1)
      {
        flag_fim=0;
        break;
      }
    }
  }
  //flag_fim=1; // Jogo acaba logo
  if(flag_fim==1)
  {
  if(pontos1>pontos2)
    {
      document.getElementById('computer_wins').style.display = 'block';
  }
   else if(pontos2>pontos1)
   {
    document.getElementById('human_wins').style.display = 'block';
   }
   else if(pontos2==pontos1)
   {
    document.getElementById('empate').style.display = 'block';
   }
    document.getElementById('game').style.display = 'none';
    document.getElementById('area-principal').style.display = 'none';
    document.getElementById('sair').style.display = 'block';
      clean();
        throw new Error('Jogo Acabou');  // Evitar que mais funções sejam executadas
  }
}

function imprimir_tabela() {
  /*  for(var i=0;i<8;i++)
    {
      for(var k=0;k<8;k++)
      {
        if(tabela[i][k]!=0)
        {
        console.log("y:%d x:%d valor:%d",i,k,tabela[i][k]);
      }
      }
    }*/
  console.log(tabela);
}


function selecionar_cell(y_coord, x_coord) {
  var id = y_coord + "" + x_coord;
  if (x == 2)
  {
    inserir_peca(y_coord, x_coord);
  }
  else if(online==1)
  {
    check(y_coord,x_coord);
  }
  pecas++;
}

function clean() {
  for (var i = 0; i < 8; i++) {
    for (var k = 0; k < 8; k++) {
      tabela[i][k] = 0;
    }
  }
  tabela[4][4] = 1;
  tabela[5][5] = 1;
  tabela[5][4] = 2;
  tabela[4][5] = 2;
}
function inicial() {
  for(var i=1;i<9;i++){
    for(var j=1;j<9;j++){
      var id = i + "" + j;
        document.getElementById(id).className = "peca";
    }
  }
  document.getElementById(44).className = "peca branca";
  document.getElementById(55).className = "peca branca";
  document.getElementById(45).className = "peca preto";
  document.getElementById(54).className = "peca preto";
}


function give_up() {
  clean();
  inicial();
  imprimir_tabela();
  pontos1=2;
  pontos2=2;
  document.getElementById('pontos_branco').innerHTML = pontos1;
  document.getElementById('pontos_preto').innerHTML = pontos2;
  document.getElementById('total').style.display = 'block';
  document.getElementById('game').style.display = 'none';
  document.getElementById('logo-inicial').style.display = 'block';
  document.getElementById('area-principal').style.display = 'none';
  document.getElementById('vez_preto').style.display = 'none';
  document.getElementById('close_offline').style.display = 'none';
  document.getElementById('close_dificuldade').style.display = 'none';
  document.getElementById('dificuldade').style.display = 'none';
  document.getElementById('escolha').style.display = 'none';
  //document.getElementById('online_game').style.display = 'none';
  document.getElementById('escolha_online').style.display = 'none';
  document.getElementById('game_online').style.display = 'none';
  leaveGame();

}
function sair(){
  location.reload();
}


function check(y_coord,x_coord){


    if(checkuser() == false){
      console.log("não podes jogar!");
      return;
    }
    console.log("posso jogar");
    var color = returnColor();
    console.log(color);
    if (tabela[y_coord - 1][x_coord] == color|| tabela[y_coord][x_coord - 1] == color
      || tabela[y_coord + 1][x_coord] == color || tabela[y_coord][x_coord + 1] == color || tabela[y_coord+ 1][x_coord + 1] == color
      || tabela[y_coord - 1][x_coord - 1] == color  || tabela[y_coord - 1][x_coord + 1] == color || tabela[y_coord + 1][x_coord - 1] == color ){
            var move = {
              row: y_coord-1,
              column: x_coord-1
            };

            notifyServer(move);
      }

}

function atualizar_tabuleiro_online(board){
  for(var i=0;i<8;i++){
    var linha = board[i];
    for(var j=0;j<8;j++){
      var y = j+1;
        var x = i+1;
      if(linha[j] == "empty"){
        tabela[i+1][j+1] =0;
      }

      else if(linha[j] == "dark"){

        id = x+""+y;
        document.getElementById(id).className = "peca preto";
        tabela[i+1][j+1] =2;
      }
      else{
        id = x+""+y;
        document.getElementById(id).className = "peca branca";
        tabela[i+1][j+1] =1;
      }
    }
  }
  console.log(tabela);
}
