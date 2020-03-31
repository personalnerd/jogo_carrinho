/*
 * 
 * CARRINHO
 * Joguinho estilo fliperama com movimentos simples, feito para estudo de HTML, CSS, JavaScript/jQuery
 * 
 * Author: Tarcisio Cavalcante / Personal Nerd
 * https://github.com/personalnerd/jogo_carrinho 
 * http://personalnerd.net.br/jogocarrinho/
 * http://www.personalnerd.net.br/projetos
 * 
 */


/*
 * 
 * Variáveis para controle do jogo
 */
var corrida;
var batida = 0;
var iniciou = 0;
var correndo = 0;
var velocidade = 200;
var velocidademin = 200;
var velocidademax = 60;
var contvelocidade;
var contpontuacao;
var pontos = 0;
var recorde = 0;
var poscarroini = 10;
var poscarromin = 1;
var poscarromax = 19;

/*
 * 
 * Áudios do jogo
 */
var somcorrida = new Audio('sons/tema.mp3');
somcorrida.loop = true;
var sbateu = new Audio('sons/bateu.wav');
var sinicio = new Audio('sons/inicio.wav');
var spausein = new Audio('sons/pausein.wav');
var spauseout = new Audio('sons/pauseout.wav');


/*
 * 
 * Captura as teclas pressionadas para controle do jogo
 */
document.addEventListener('keydown', pegaTecla);
function pegaTecla(){
    /* keycodes
     * 37 = esquerda
     * 38 = para cima
     * 39 = direita
     * 40 = para baixo
     * 32 = espaço
     */
    var tecla = event.keyCode;
    switch (tecla) {
        case 37: // esquerda
            if (correndo === 1 && poscarroini !== poscarromin) {
                // só movimenta se estiver correndo e se a posição não estiver na borda esquerda
                poscarro = $("#carro").html();  // pega o html
                poscarro = poscarro.replace("<span>d", " <span>d");  // adiciona um espaço no final
                poscarro = poscarro.replace("</span> ", "</span>");  // retira um espaço do início
                $("#carro").html(poscarro);  // coloca o novo html de volta na div com a nova posição do carro
                poscarroini--; // define a nova posição do carro para comparar com os adversários
            } else {
                // não faz nada se estiver parado
            }
            
            break;
        case 39: // direita
            if (correndo === 1 && poscarroini !== poscarromax) {
                // só movimenta se estiver correndo e se a posição não estiver na borda direita
                poscarro = $("#carro").html();  // pega o html
                poscarro = poscarro.replace("e</span>", "e</span> ");  // adiciona um espaço no início
                poscarro = poscarro.replace(" <span>", "<span>");       // retira um espaço do final
                $("#carro").html(poscarro);  // coloca o novo html de volta na div
                poscarroini++; // define a nova posição do carro para comparar com os adversários
            } else {
                // não faz nada se estiver parado
            }
            
            break;
        case 38: // cima
            if (correndo === 0) {
                // iniciar corrida
                if (iniciou === 0 && batida === 0) {
                    iniciou = 1;
                    correndo = 1;
                    contpontuacao = window.setInterval(pontuacao, velocidade*7);    // define o intervalo da pontuação, de acordo com a velocidade do carro.
                    corrida = window.setInterval(movimento, velocidade);            // define a movimentação da pista de acordo com a velocidade do carro.
                    contvelocidade = 50;                                            // variável armazenar a velocidade (valor inicial)
                    $('#veloc').html(contvelocidade);                               // mostrar a velocidade atual ao jogador
                    somcorrida.play();                                              // executa a música tema enquanto está correndo
                }
            } else {
                // se já está correndo, aumenta a velocidade, dentro do limite
                if (velocidade > velocidademax) {                                   // se ainda não atingiu a velocidade máxima, continua acelerando
                    velocidade -= 10;                                               // a cada clique na tecla aumenta a velocidade (diminui 10 milissegundos no tempo)
                    clearInterval(corrida);                                         // a cada clique, limpa o intervalo da corrida e abre um novo com a velocidade nova
                    clearInterval(contpontuacao);                                   // a cada clique, limpa o intervalo da pontuação e abre um novo com a velocidade nova (a pontuação fica mais rápida se o carro estiver mais rápido)
                    corrida = window.setInterval(movimento, velocidade);            // novo intervalo de corrida
                    contpontuacao = window.setInterval(pontuacao, velocidade*7);    // novo intervalo de pontuação
                    contvelocidade += 10;                                           // a cada clique, aumentando a velocidade, aumenta o mostrador da velocidade
                    $('#veloc').html(contvelocidade);                               // mostrar a velocidade atual ao jogador
                }
            }
            break;        
        case 40: // baixo
            if (correndo === 1) {
                // se estiver parado não faz nada.                
                if (velocidade === velocidademin) {
                    // se estiver na velocidade mínima não faz nada
                } else {
                    // se tiver aumentado a velocidade previamente, aqui diminui a velocidade
                    velocidade += 10;                                               // a cada clique na tecla diminui a velocidade (aumenta 10 milissegundos no tempo)
                    clearInterval(corrida);
                    clearInterval(contpontuacao);
                    corrida = window.setInterval(movimento, velocidade);
                    contpontuacao = window.setInterval(pontuacao, velocidade*7);
                    contvelocidade -= 10;
                    $('#veloc').html(contvelocidade);
                }
            }
            break;
        case 32: // espaço (pausa ou novo início)
            if (iniciou === 0) {
                // se a corrida ainda não tiver iniciado, não faça nada, a não ser que já tenha batido
                if (batida === 1) {
                    // se já tiver batido, o espaço serve para reiniciar o jogo, chamando a função
                    novoinicio();
                }
            } else {
                //se a corrida já iniciou
                if (correndo === 1) {
                    // se estiver correndo, pausa
                    clearInterval(corrida);
                    clearInterval(contpontuacao);
                    correndo = 0;                               // variável para definir se o jogo está correndo (1) ou pausado (0)
                    $('#corrida pre, .col').fadeTo(0,.4);       // diminui a opacidade do conteúdo da tela 
                    $('#pausa').show();                         // exibe o PAUSE
                    somcorrida.pause();                         // pausa a música tema
                    spausein.play();                            // som da pausa
                } else {
                    // se estiver parado, retorna
                    $('#corrida pre, .col').fadeTo(0,1);        // restaura a opacidade do conteúdo da tela
                    $('#pausa').hide();                         // oculta o PAUSE
                    correndo = 1;                               // variável para definir se o jogo está correndo (1) ou pausado (0)    
                    corrida = window.setInterval(movimento, velocidade);            // volta o movimento para a velocidade que estava antes
                    contpontuacao = window.setInterval(pontuacao, velocidade*14);   // volta a contar a pontuação na velocidade que estava antes
                    somcorrida.play();                          // play na música tema
                    spauseout.play();                           // som de voltar da pausa
                }
            } 
            break;
        default:
            break;
    }
}

/*
 * Arrays de definição da pista vazia ou dos carros adversários
 * todas as posições possíveis armazenadas em campos do array
 * vários campos com a pista limpa, para aparecer mais vezes a pista vazia
 * 
 * As posições do array também servem para identificar onde está o carro adversário e comparar com o carro do jogador para o caso de bater
 */

// PAR para definir onde mostra a pista com os traços
var par = new Array('',
'║█   |    |    |    ║', // 1
'║ █  |    |    |    ║', // 2
'║  █ |    |    |    ║', // 3
'║   █|    |    |    ║', // 4
'║    █    |    |    ║', // 5
'║    |█   |    |    ║', // 6
'║    | █  |    |    ║', // 7
'║    |  █ |    |    ║', // 8
'║    |   █|    |    ║', // 9
'║    |    █    |    ║', // 10
'║    |    |█   |    ║', // 11
'║    |    | █  |    ║', // 12
'║    |    |  █ |    ║', // 13
'║    |    |   █|    ║', // 14
'║    |    |    █    ║', // 15
'║    |    |    |█   ║', // 16
'║    |    |    | █  ║', // 17
'║    |    |    |  █ ║', // 18
'║    |    |    |   █║', // 19
'║    |    |    |    ║','║    |    |    |    ║','║    |    |    |    ║',
'║    |    |    |    ║','║    |    |    |    ║','║    |    |    |    ║',
'║    |    |    |    ║','║    |    |    |    ║','║    |    |    |    ║',
'║    |    |    |    ║','║    |    |    |    ║','║    |    |    |    ║',
'║    |    |    |    ║','║    |    |    |    ║','║    |    |    |    ║',
'║    |    |    |    ║','║    |    |    |    ║','║    |    |    |    ║',
'║    |    |    |    ║','║    |    |    |    ║','║    |    |    |    ║',
'║    |    |    |    ║','║    |    |    |    ║','║    |    |    |    ║',
'║    |    |    |    ║','║    |    |    |    ║','║    |    |    |    ║',
'║    |    |    |    ║','║    |    |    |    ║','║    |    |    |    ║');

// IMPAR para definir onde mostra a pista sem os traços
var imp = new Array('',
'║█                  ║', // 1
'║ █                 ║', // 2
'║  █                ║', // 3
'║   █               ║', // 4
'║    █              ║', // 5
'║     █             ║', // 6
'║      █            ║', // 7
'║       █           ║', // 8
'║        █          ║', // 9
'║         █         ║', // 10
'║          █        ║', // 11
'║           █       ║', // 12
'║            █      ║', // 13
'║             █     ║', // 14
'║              █    ║', // 15
'║               █   ║', // 16
'║                █  ║', // 17
'║                 █ ║', // 18
'║                  █║', // 19
'║                   ║','║                   ║','║                   ║',
'║                   ║','║                   ║','║                   ║',
'║                   ║','║                   ║','║                   ║',
'║                   ║','║                   ║','║                   ║',
'║                   ║','║                   ║','║                   ║',
'║                   ║','║                   ║','║                   ║',
'║                   ║','║                   ║','║                   ║',
'║                   ║','║                   ║','║                   ║',
'║                   ║','║                   ║','║                   ║',
'║                   ║','║                   ║','║                   ║');

// define par ou impar, para controlar as linhas da pista, para efeito de movimento
var novalinha = 0; 

/*
 * Movimento da pista
 */
function movimento() {
    
    // variável usa um número randômico entre 1 e 49 (quantidade de campos nos arrays)
    // para definir qual campo vai ser usado para desenhar a próxima linha da pista
    pos = Math.floor((Math.random() * 49) + 1);
    
    // a nova linha a ser desenhada tem que fica rpulando entre par e impar
    if (novalinha === 1) {      // se a nova linha for 1 faça...
        pre = par[pos];         // pega uma posição randômica (POS) do array PAR
        novalinha = 0;          // define que a próxima linha vai ser 0
    } else {                    // se a linha for 0 faça...
        pre = imp[pos];         // pega uma posição randômica (POS) do array IMP
        novalinha = 1;          // define que a próxima linha vai ser 1
    }
    
    // descobrir a posição do carro adversário na linha de baixo
    posicao = $('#lin14').html().indexOf('█');
    
    // conferir com a posição do carro atualmente 
    if (poscarroini === posicao) {
        // se o carro estiver na mesma posição de um carro adversário...
        bateu();
    }
    // cada linha pega o conteúdo da linha de cima
    // a primeira linha pega o conteúdo do PRE gerado randomicamente
    $('#lin14').html($('#lin13').html());    
    $('#lin13').html($('#lin12').html());
    $('#lin12').html($('#lin11').html());
    $('#lin11').html($('#lin10').html());
    $('#lin10').html($('#lin9').html());
    $('#lin9').html($('#lin8').html());
    $('#lin8').html($('#lin7').html());
    $('#lin7').html($('#lin6').html());
    $('#lin6').html($('#lin5').html());
    $('#lin5').html($('#lin4').html());
    $('#lin4').html($('#lin3').html());
    $('#lin3').html($('#lin2').html());
    $('#lin2').html($('#lin1').html());
    $('#lin1').html(pre);
    
}

// contar pontuação
function pontuacao() {
    pontos++;
    $('#score').html(pontos);
}

// se o carro bater...
function bateu() {
    clearInterval(corrida);                         // limpa (pausa) o intervalo da corrida
    clearInterval(contpontuacao);                   // limpa (pausa) o intervalo da pontuação
    correndo = 0;                                   // define que o carro não está mais correndo
    if (pontos > recorde) { recorde = pontos; }     // se a pontuação atual for maior que o recorde registrado, armazena na variável recorde
    $('#recorde span').html(recorde);               // adiciona o recorde na tag
    $('#recorde').show();                           // exibe o recorde para o jogador
    $('#voltar').show();                            // exibe a instrução de pressionar o ESPAÇO para reiniciar o jogo
    
    quebrado = $("#carro").html();                  // QUEBRADO: pega o HTML da tag do carro do jogador
    quebrado = quebrado.replace("█", "▚");         // substitui o carro por outro símbolo
    $("#carro").html(quebrado).addClass('animated infinite flash');    // repõe o HTML e deixa piscando
    
    somcorrida.pause();                             // pausa a música tema
    somcorrida = null;                              // zera a música tema (para quando começar o jogo de novo, começar a música do início)
    sbateu.play();                                  // som de batida do carro
    
    // zera tudo
    batida = 1;
    pontos = 0;
    iniciou = 0;
    velocidade = 200;
    
}

/*
 * Iniciar o jogo depois de uma batida
 */
function novoinicio() {
    // redesenha toda a pista vazia
    $('#lin14').html('║                   ║');
    $('#lin13').html('║    |    |    |    ║');
    $('#lin12').html('║                   ║');
    $('#lin11').html('║    |    |    |    ║');
    $('#lin10').html('║                   ║');
    $('#lin9').html('║    |    |    |    ║');
    $('#lin8').html('║                   ║');
    $('#lin7').html('║    |    |    |    ║');
    $('#lin6').html('║                   ║');
    $('#lin5').html('║    |    |    |    ║');
    $('#lin4').html('║                   ║');
    $('#lin3').html('║    |    |    |    ║');
    $('#lin2').html('║                   ║');
    $('#lin1').html('║    |    |    |    ║');
    
    // reposiciona o carro no meio
    $('#carro').html('<span>e</span>         █         <span>d</span>').removeClass('animated infinite flash');
    
    // reseta os contadores do jogador
    $('#score').html('0');
    $('#veloc').html('0');
    
    // oculta a instrução de pressionar o ESPAÇO para reiniciar a corrida
    $('#voltar').hide();
    
    // reseta as variáveis
    batida = 0;
    novalinha = 0;
    poscarroini = 10;
    somcorrida = new Audio('sons/tema.mp3');        // reseta a música tema para começar do início
    somcorrida.loop = true;
    sinicio.play();                                 // som de resetar a corrida
}
