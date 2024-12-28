// Elementi di interesse della pagina
const grid = document.querySelector('.grid')
const leftButton = document.querySelector('.left-button')
const rightButton = document.querySelector('.right-button')
const scoreCounter = document.querySelector('.score-counter')
const endGameScreen = document.querySelector('.end-game-screen')
const finalScore = document.querySelector('.final-score')
const playAgainButton = document.querySelector('.play-again')

// Prepariamo la griglia iniziale
const gridMatrix = [
    ['', '', '', '', '', 'grass', ''],
    ['', 'cones', '', '', '', '', 'fence'],
    ['', '', 'rock', '', '', '', ''],
    ['fence', '', '', '', '', '', ''],
    ['', '', 'grass', '', '', 'water', ''],
    ['', '', '', '', 'cones', '', ''],
    ['', 'water', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', 'rock', ''],
]

//Preparazione iniziale del Game
let score = 0
let speed = 1000
const kartPosition = { y: 7, x: 3}

// Funzioni relative alla griglia
function renderGrid(){
    //Svuotiamo la griglia prima di tutto
    grid.innerHTML = ''

    //Recupero di ogni riga della matrice
    gridMatrix.forEach(function (rowCells){
        //Recupero di ogni cella della riga della matrice
        rowCells.forEach(function (cellContent){
            //Creazione di un elemento div
            const cell = document.createElement('div')

            //Assegnazione classe 'cell'
            cell.className = 'cell'

            //Se c'è qualcosa, aggiungi una classe con lo stesso nome
            if(cellContent){
                cell.classList.add(cellContent)
            }

            //Ora metti l'elemento nella griglia
            grid.appendChild(cell)
        })
    })
}

//Funzione per posizionare il Kart
function placeKart(){
    //Recuperiamo il valore della cella in cui dobbiamo posizionare il kart
    const contentBeforeKart = gridMatrix[kartPosition.y][kartPosition.x]

    //Se c'è qualcosa è collisione
    if(contentBeforeKart === 'coin'){
        getBonusPoints()
    } else if(contentBeforeKart){
        gameOver()
    }

    //Inserisco la classe kart, nella cella corrispondente di KartPosition
    gridMatrix[kartPosition.y][kartPosition.x] = 'kart'
}

//Funzione per muovere il Kart
function moveKart(direction){
    //'Sollevamento' kart per poi spostarlo da un'altra parte
    gridMatrix[kartPosition.y][kartPosition.x] = ''
    
    //Aggiornamento coordinate kart
    switch(direction){
        case 'left':
            if(kartPosition.x > 0) kartPosition.x--
            break;
        case 'right':
            if(kartPosition.x < 6) kartPosition.x++
            break;
        default:
            gridMatrix[kartPosition.y][kartPosition.x] = 'kart';

    }

    renderElements()
}

//Piano di Gioco
function renderElements(){
    //Piazzamento delKart
    placeKart()

    //Creazione griglia di gioco
    renderGrid()
}

//Click sul bottone gioca ancora
playAgainButton.addEventListener('click', function(){
    location.reload()
})

//Click sul bottoni di sinistra
leftButton.addEventListener('click', function(){
    moveKart('left')
})

//Click sul bottone di destra
rightButton.addEventListener('click', function(){
    moveKart('right')
})

//Reazione click freccette tastiera
document.addEventListener('keyup', function(e){
    switch(e.key){
        case 'ArrowLeft':
            moveKart('left')
            break;
        case 'ArrowRight':
            moveKart('right')
            break;
        default: return;
    }
})

//Funzione per lo scorrimento degli ostacoli
function scrollObstacles(){
    //Rimozione temporanea del kart
    gridMatrix[kartPosition.y][kartPosition.x] = ''

    //Controllo se c'è un coin in gioco
    const isCoinInGame = lookForCoin()

    //Recupero ultima riga
    let lastRow = gridMatrix.pop()

    //Inseriamo un coin nella riga se non ci sono coin in gioco
    if(!isCoinInGame) lastRow = insertCoin(lastRow)

    //Mescoliamo casualmente gli elementi della riga
    lastRow = shulleElements(lastRow)

    //Riporto l'ultima riga in cima
    gridMatrix.unshift(lastRow)

    //Renderizziamo il tutto
    renderElements()
}

//Funzione per mescolare gli elementi di una riga
function shulleElements(row){
    // Algoritmo di Fisher-Yates
    for (let i = row.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [row[i], row[j]] = [row[j], row[i]];
    }
    return row
}

//Funzioni relative al punteggio e alla velocità
//Funzione che incrementa il punteggio
function incrementScore(){ 
    //Aumento il punteggio di 1 e lo inserisco in pagina
    scoreCounter.innerText = ++score //il ++ va prima così prima incrementa e poi lo scrive in pagina
}

//Funzione punti bonus
function getBonusPoints(){
    //Incremento il punteggio di 30 punti
    score += 30

    //Inserisco il punteggio aggiornato in pagina
    scoreCounter.innerText = score

    //Aggiungiamo la classe bonus al contatore
    scoreCounter.classList.add('bonus')

    //Rimuoviamo la classe bonus subito dopo averla inserita per riavere l'effetto bonus sul contatore
    setTimeout(function(){
        scoreCounter.classList.remove('bonus')
    }, 1000)
}

//Funzione per inserire un coin all'interno della riga
function insertCoin(row){
    //Individuiamo l'indice del primo elemento vuoto della riga
    const emptyIndex = row.indexOf('')

    //Inserisco un coin in quella posizione
    row[emptyIndex] = 'coin'

    //Restituisce la riga aggiornata con il coin all'interno
    return row;
}

//Funzione per sapere se c'è un coin in gioco
function lookForCoin(){
    //creo un flag
    let coinFound = false

    //Recupero tutte le righe della matrice
    gridMatrix.forEach(function(row){
        //Per ogni riga controllo se c'è un coin
        if(row.includes('coin')) coinFound = true
    })
    return coinFound
}

//Funzione per incrementare la velocità
function incrementSpeed(){
    if(speed > 100){
        //Interrompo il flusso attuale
        clearInterval(gameLoop)

        //Decremento intervallo (così aumento la velocità)
        speed -= 100

        gameLoop = setInterval(runGameFlow, speed)
    }
}

//Funzioni relative al flusso di gioco
//Funzione che raggruppa le operazioni da ripetere ciclicamente
function runGameFlow(){
    //Aumentare il punteggio
    incrementScore()
    //Aumentare la velocità ogni 10 punti
    if (score % 10 === 0) incrementSpeed()
    //Far scorrere gli ostacoli
    scrollObstacles()
}

//Funzioni fine partita
//Funzione di Game Over
function gameOver(){
    //Interrompiamo il flusso di gioco
    clearInterval(gameLoop)

    //Aggiungo lo score all'immagine di game over
    finalScore.innerText = score

    //Rivelo l'immagine di game over
    endGameScreen.classList.remove('hidden')

    //Lascio il focus sul bottone gioca ancora, se premo invio fa giocare ancora
    playAgainButton.focus()
}

//Funzioni di Gioco
//Scrollo automaticamente gli ostacoli
let gameLoop = setInterval(runGameFlow, speed)