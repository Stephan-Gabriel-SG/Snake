/*
   Snake v1.0
   Author: NANDRASANTSOA Stéphan Gabriel
   Date: 2023-08-22 19:27
*/
let level = 1
let myGame
function startGame(lv) {
    lv--
    var canvas = document.getElementById("gameboard");
    var score = document.getElementById('score')
    var tabRect = []
      , tabAllPosObstacle = {
        x: [],
        y: []
    }
    var chicken
    var play, timer = {
        time: 0,
        timeIsUp: false,
        min: 0,
        sec: 0
    }
    var vitesseSupl
    var direction = 1
    var choiceCenterObstacle, choiceCornerObstacle
    var pause = false
    var endParti = false
    var snakeSound
    var winSound
    var loseSound
    var eatSound
    const PAS = 5
    const LARGEUR = 5
    const HAUTEUR = 5
    var listLevel = [{
        num: 1,
        vitesse: 150,
        deadline: {
            min: 2,
            sec: 30
        },
        goal: 30
    }, {
        num: 2,
        vitesse: 125,
        deadline: {
            min: 3,
            sec: 30
        },
        goal: 40
    }, {
        num: 3,
        vitesse: 100,
        deadline: {
            min: 4,
            sec: 30
        },
        goal: 50
    }, {
        num: 4,
        vitesse: 80,
        deadline: {
            min: 5,
            sec: 30
        },
        goal: 60
    }, {
        num: 5,
        vitesse: 60,
        deadline: {
            min: 6,
            sec: 30
        },
        goal: 75
    }]
    const listCenterObstacle = [{
        name: 'plus',
        x: [26, 28, 30, 28, 28],
        y: [14, 14, 14, 16, 12]
    }, {
        name: 'egal',
        x: [27, 29, 31, 28, 30, 32],
        y: [11, 11, 11, 15, 15, 15]
    }, {
        name: 'egalv',
        x: [27, 27, 27, 31, 31, 31],
        y: [10, 12, 14, 12, 14, 16]
    }, {
        name: 'L',
        x: [24, 26, 28, 28, 28, 28, 30, 32],
        y: [11, 11, 11, 09, 17, 15, 15, 15]
    }, {
        name: 'L1',
        x: [26, 28, 30, 30, 28, 28, 30, 32],
        y: [09, 09, 09, 11, 15, 17, 17, 17]
    }, {
        name: 'L2',
        x: [24, 26, 26, 24, 26, 26, 30, 30, 32, 30, 30, 32],
        y: [11, 11, 09, 15, 15, 17, 09, 11, 11, 15, 17, 15]
    }]
    const listCornerObstacle = [{
        name: 'L',
        x: [02, 02, 04, 02, 02, 04, 54, 56, 56, 56, 54, 56],
        y: [02, 04, 02, 24, 26, 26, 02, 02, 04, 24, 26, 26]
    }, {
        name: 'L1',
        x: [02, 04, 02, 04, 54, 56, 54, 56],
        y: [04, 02, 24, 26, 02, 04, 24, 26]
    }, {
        name: 'L',
        x: [02, 02, 02, 02, 56, 56, 56, 56],
        y: [02, 04, 24, 26, 02, 04, 24, 26]
    }, ]

    const LENGTH_LIST_CENTER_OBSTACLE = listCenterObstacle.length
    const LENGTH_LIST_CORNER_OBSTACLE = listCornerObstacle.length

    /////////////////////////////////////////////////////////////////

    function createNewRect(x, y, color="#4CA30A", l=LARGEUR, h=HAUTEUR) {
        this.ctx = canvas.getContext('2d')
        this.x = x
        this.y = y
        this.lastX
        this.lastY
        this.axe = 'x'
        this.update = ()=>{
            this.ctx.fillStyle = color
            this.ctx.fillRect(this.x * PAS, this.y * PAS, l, h)
        }
        this.move = (upX,upY)=>{
            this.ctx.clearRect(this.x * PAS, this.y * PAS, l, h)
            this.x = upX
            this.y = upY
            this.update()
        }
    }
    function clearGameboard(gameBoard=true) {
        clearInterval(play)
        tabRect = []
        clearInterval(timer.time)
        disableBtnPause()
        disableBtnMenu()
        new createNewRect(0,0).ctx.clearRect(0, 0, canvas.width, canvas.height)
        if (gameboard) {
            showMessageFrame()
            endParti = true
        }

    }
    function addChicken() {
        let cX
        let cY
        let ver = 1
        while (ver > 0) {
            cX = Math.floor(Math.random() * 60)
            cY = Math.floor(Math.random() * 30)
            ver = 0
            for (let index = 0; index < tabRect.length; index++) {
                if (tabRect[index].x == cX && tabRect[index].y == cY) {
                    ver++
                }
            }
            //console.log('ny akoho ? collision avec obstacle :', collisionWithObstacle(cX, cY))
            if (collisionWithObstacle(cX, cY)) {
                ver++
            }
            if (ver == 0) {
                chicken = (new createNewRect(cX,cY,'#FFB300'))
                chicken.update()
            }
        }
    }
    function showObstacle(obstacle, color='#00531F', h=10, w=10) {
        let ob
        let obLength = obstacle.x.length
        for (let index = 0; index < obLength; index++) {
            ob = new createNewRect(obstacle.x[index],obstacle.y[index],color,h,w)
            ob.update()
        }
    }
    function collisionWithObstacle(posX, posY) {
        for (let index = 0; index < tabAllPosObstacle.x.length; index++) {
            if (tabAllPosObstacle.x[index] == posX || (tabAllPosObstacle.x[index] + 1) == posX) {
                if (tabAllPosObstacle.y[index] == posY || (tabAllPosObstacle.y[index] + 1) == posY) {
                    return true
                }
            }
        }
        return false
    }
    function initDashBoard() {
        document.getElementById('level').innerText = listLevel[lv].num
        document.getElementById('goal').innerText = listLevel[lv].goal
        document.getElementById('time').style.color = 'white'
        document.getElementById('time').innerText = listLevel[lv].deadline.min + ':' + listLevel[lv].deadline.sec
        score.innerText = 0
        //initialization timer
        timer = {
            time: 0,
            min: 0,
            sec: 0
        }
    }
    function initGame(nb, colorTete='#4C0AA3', colorQueue='#4CA30A') {
        vitesse = listLevel[lv].vitesse
        disableBtnPause()
        disableBtnMenu()
        initDashBoard()
        hideMessageFrame()
        restartGame()
        for (let index = nb; index >= 0; index--) {
            if (index == nb) {
                tabRect.push(new createNewRect(index,10,colorTete))
            } else {
                tabRect.push(new createNewRect(index,10,colorQueue))
            }
            tabRect[nb - index].update()
        }
        choiceCenterObstacle = Math.floor(Math.random() * LENGTH_LIST_CENTER_OBSTACLE)
        choiceCornerObstacle = Math.floor(Math.random() * LENGTH_LIST_CORNER_OBSTACLE)
        tabAllPosObstacle = {
            x: listCenterObstacle[choiceCenterObstacle].x.concat(listCornerObstacle[choiceCornerObstacle].x),
            y: listCenterObstacle[choiceCenterObstacle].y.concat(listCornerObstacle[choiceCornerObstacle].y)
        }
        showObstacle(listCenterObstacle[choiceCenterObstacle])
        showObstacle(listCornerObstacle[choiceCornerObstacle])
        addChicken()
        //sound
        //snakeSound=new mySound('snake.mp3')
        eatSound = new mySound('song/eat.mp3',false)
        loseSound = new mySound('song/gameOver.mp3',false)
        winSound = new mySound('song/win.mp3',false)
    }
    function restartGame() {
        for (i = -1; i < tabRect.length; i++) {
            tabRect.pop()
        }
    }
    function addQueu() {
        let x = tabRect[tabRect.length - 1].lastX
        let y = tabRect[tabRect.length - 1].lastY
        tabRect.push(new createNewRect(x,y))
        tabRect[tabRect.length - 1].update()
    }
    function updateScore() {
        score.innerText++
    }
    function makePause() {
        if (pause) {
            showMessageInit()
            disableBtnMenu()
            document.getElementById('pause').innerText = 'Pause'
            pause = false
        } else {
            //stop interval 
            clearInterval(play)
            //stop time
            removeListener('keydown', changeDirection)
            removeListener('keyup', sprintDeplacement)
            clearInterval(timer.time)
            //reactiverBtn menu
            disableBtnMenu(false)
            document.getElementById('pause').innerText = 'Resume'
            //pause music
            //snakeSound.pause()
            pause = true
        }
    }
    function disableBtnPause(value=true) {
        if (value) {
            document.getElementById('pause').setAttribute('disabled', value)
        } else {
            document.getElementById('pause').removeAttribute('disabled')
        }
    }
    function disableBtnMenu(value=true) {
        if (value) {
            document.getElementById('btnMenu').setAttribute('disabled', value)
        } else {
            document.getElementById('btnMenu').removeAttribute('disabled')
        }
    }

    function showMessageInit() {
        let index = 3
        let change = setInterval(()=>{
            document.getElementById('top').style.animation = "scaleEffect 0.4s"
            document.getElementById('top').innerText = 'start in ' + (index)
            index--
            if (index == -1) {
                clearInterval(change)
                document.getElementById('top').innerText = 'Good luck'
                play = setInterval(moveAll, listLevel[lv].vitesse)
                disableBtnPause(false)
                disableBtnMenu()
                //start Chrono
                if (timer.min != 0 || timer.sec != 0) {
                    chrono(timer.min, timer.sec)
                } else {
                    chrono(listLevel[lv].deadline.min, listLevel[lv].deadline.sec)
                }

                addListener('keydown', changeDirection)
                addListener('keyup', sprintDeplacement)
            }
            setTimeout(()=>{
                document.getElementById('top').style.animation = ""
            }
            , 500)
        }
        , 1000)
    }

    function moveAll() {
        if (!endParti) {
            if (tabRect[0].x > -1 && tabRect[0].x < 60 && tabRect[0].y > -1 && tabRect[0].y < 30 && !timer.timeIsUp) {
                for (let index = 0; index < tabRect.length; index++) {
                    if (index > 0) {
                        tabRect[index].lastX = tabRect[index].x
                        tabRect[index].lastY = tabRect[index].y
                        tabRect[index].move(tabRect[index - 1].lastX, tabRect[index - 1].lastY)
                    } else {
                        let queueEaten = false
                        tabRect[index].lastX = tabRect[index].x
                        tabRect[index].lastY = tabRect[index].y
                        if (tabRect[index].axe == 'y') {
                            if (direction == 1) {
                                tabRect[index].move(tabRect[index].x, tabRect[index].y + 1)
                            } else {
                                tabRect[index].move(tabRect[index].x, tabRect[index].y - 1)
                            }
                        } else {
                            if (direction == 1) {
                                tabRect[index].move(tabRect[index].x + 1, tabRect[index].y)
                            } else {
                                tabRect[index].move(tabRect[index].x - 1, tabRect[index].y)
                            }
                        }
                        //Si chicken en bouche
                        if (tabRect[0].x == chicken.x && tabRect[0].y == chicken.y) {
                            eatSound.play()
                            addQueu()
                            addChicken()
                            updateScore()
                        }
                        if (collisionWithObstacle(tabRect[0].x, tabRect[0].y)) {
                            clearGameboard()
                            win(false)
                        }
                        for (let index = 1; index < tabRect.length; index++) {
                            queueEaten = (tabRect[index].x == tabRect[0].x && tabRect[index].y == tabRect[0].y) ? true : false
                            if (queueEaten) {
                                clearGameboard()
                                win(false)
                                break
                            }
                        }
                        //reactive listener pour eviter le traitement de 2 bouton successif
                        addListener('keydown', changeDirection)
                    }
                }
            } else {
                clearGameboard()
                if (score.innerText >= document.getElementById('goal').innerText && timer.timeIsUp) {
                    console.log('score:', score.innerText)
                    win()
                } else {
                    win(false)
                }
                endParti = true
                removeListener('keydown', changeDirection)
                removeListener('keyup', sprintDeplacement)
            }

        }
    }
    function win(isWin=true) {
        if (isWin) {
            winSound.play()
            document.getElementById('message').innerHTML = 'You are WIN 🎯👏'
            document.getElementById('nextLevel').hidden = false
            document.getElementById('tryAgain').hidden = true
        } else {
            loseSound.play()
            document.getElementById('message').innerHTML = 'Game Over 🥺'
            document.getElementById('nextLevel').hidden = true
            document.getElementById('tryAgain').hidden = false
        }
        disableBtnMenu(false)

    }
    function addListener(key, method) {
        document.addEventListener(key, method)
    }
    function removeListener(key, method) {
        document.removeEventListener(key, method)
    }
    function showMessageFrame() {
        let panMessage = document.getElementById('messageFrame')
        panMessage.style.display = 'flex';
        let dTop = canvas.offsetTop + (canvas.offsetHeight / 2 - panMessage.offsetHeight / 2)
        let dLeft = canvas.offsetLeft + (canvas.offsetWidth / 2 - panMessage.offsetWidth / 2)
        panMessage.style.top = dTop + 'px'
        panMessage.style.left = dLeft + 'px'
    }

    function hideMessageFrame() {
        let panMessage = document.getElementById('messageFrame')
        panMessage.style.display = 'none';
    }

    function chrono(m, s=0, color='white') {
        let sec = s
        let min = m
        timer.timeIsUp = false
        timer.time = setInterval(()=>{
            if (sec == 0) {
                min--
                sec = 60
            } else {
                sec--
            }
            if (min == 0 && sec == 0) {
                clearInterval(timer.time)
                timer.timeIsUp = true
            }
            if (min == 0 && sec < 31) {
                color = 'red'
            }
            timer.min = min
            timer.sec = sec
            document.getElementById('time').style.color = color
            document.getElementById('time').innerText = min + ':' + sec
        }
        , 1000)
    }
    hideMenu()
    showGameboard()
    initGame(2)
    function changeDirection() {
        if (!endParti) {
            if (event.keyCode == 37 && tabRect[0].axe == 'y') {
                tabRect[0].axe = 'x'
                direction = -1
            } else {
                if (event.keyCode == 38 && tabRect[0].axe == 'x') {
                    tabRect[0].axe = 'y'
                    direction = -1
                } else {
                    if (event.keyCode == 39 && tabRect[0].axe == 'y') {
                        tabRect[0].axe = 'x'
                        direction = 1
                    } else if (event.keyCode == 40 && tabRect[0].axe == 'x') {
                        tabRect[0].axe = 'y'
                        direction = 1
                    }
                }
            }
            removeListener('keydown', changeDirection)
            if (event.keyCode == 17 && vitesseSupl == 0) {
                vitesseSupl = setInterval(moveAll, listLevel[lv].vitesse - 50)
            }
        }
    }
    function sprintDeplacement() {
        if (event.keyCode == 17 && !endParti) {
            clearInterval(vitesseSupl)
            vitesseSupl = 0
        }
    }
    function mySound(src, loop=true) {
        this.sound = document.createElement('audio')
        this.sound.src = src
        this.sound.setAttribute('preload', true)
        this.sound.setAttribute('controls', false)
        this.sound.loop = loop
        this.play = ()=>{
            this.sound.play()
        }
        this.pause = ()=>{
            this.sound.pause()
        }
    }
    showMessageInit()
    //click bouton menu
    document.getElementById('btnMenu').addEventListener('click', ()=>{
        showMenu()
        hideGameboard()
    }
    )
    document.getElementById('pause').addEventListener('click', ()=>{
        makePause()
    }
    )
    return 0
}
function hideMenu() {
    document.getElementById('menu').style.display = 'none'
}

function showMenu() {
    document.getElementById('menu').style.display = 'flex'
}
function hideGameboard() {
    document.getElementById('gameFrame').style.display = 'none'
}

function showGameboard() {
    document.getElementById('gameFrame').style.display = 'flex'
}

document.getElementById('down').addEventListener('click', ()=>{
    if (level > 1) {
        level--
    }
    document.getElementById('levelChoice').innerHTML = 'Level ' + level
}
)
document.getElementById('up').addEventListener('click', ()=>{
    if (level < 5) {
        level++
    }
    document.getElementById('levelChoice').innerHTML = 'Level ' + level
}
)
document.getElementById('play').addEventListener('click', ()=>{
    myGame = startGame(level)
}
)
document.getElementById('tryAgain').addEventListener('click', ()=>{
    myGame = startGame(level)
}
)
document.getElementById('nextLevel').addEventListener('click', ()=>{
    if (level < 5) {
        level++
    } else {
        level = 1
    }
    myGame = startGame(level)
}
)
