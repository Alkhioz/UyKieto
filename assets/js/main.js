const Alphabet = [
    "A", "B", "C", "D",
    "E", "F", "G", "H",
    "I", "J", "K", "L",
    "LL", "M", "N", "Ñ",
    "O", "P", "Q", "R",
    "S", "T", "U", "V",
    "W", "X", "Y", "Z",
];

let body = null;
let intervalId = null;
let TIME_LIMIT = 10;
let ROUNDS = 5;
let players = [];
let cards = [];

const disableAction = (evt) => {
    evt.target.classList.add("disabled-action");
    countdown();
}

const createAlphabet = () => {
    const container = document.querySelector("#alphabet-container");
    const list = document.createElement("ul");
    list.classList.add("alphabet-list");
    for (let letter of Alphabet) {
        const element = document.createElement("li");
        element.classList.add("alphabet-element");
        const elementAction = document.createElement("button");
        elementAction.classList.add("alphabet-elementAction");
        elementAction.innerText = letter;
        elementAction.addEventListener("click", disableAction);
        element.appendChild(elementAction);
        list.appendChild(element);
    }
    container.appendChild(list);
}

const restartTimer = () => {
    if (intervalId) clearInterval(intervalId);
    const countdownElement = document.getElementById('clock-timer');
    countdownElement.textContent = TIME_LIMIT;

}

const restartBoard = () => {
    const disabledActions = document.querySelectorAll(".disabled-action");
    for (let action of disabledActions) {
        action.classList.remove("disabled-action");
    }
    restartTimer();
}

const countdown = () => {
    let countdownTime = TIME_LIMIT;
    const countdownElement = document.getElementById('clock-timer');
    restartTimer();
    intervalId = setInterval(() => {
        countdownTime--;
        countdownElement.textContent = countdownTime;

        if (countdownTime <= 0) {
            restartTimer();
        }
    }, 1000);
}

const endActionHandler = () => {
    restartTimer();
    body.innerHTML = "";
    showConfigurationScreen();
}

const nextActionHandler = () => {
    renderCard();
    restartBoard();
}

const appendGameFunctions = () => {
    const restartAction = document.querySelector("#restart-action");
    restartAction.addEventListener("click", restartBoard);
    const clockAction = document.querySelector("#clock-action");
    clockAction.addEventListener("click", countdown);
    const endAction = document.querySelector("#end-action");
    endAction.addEventListener("click", endActionHandler);
    const nextAction = document.querySelector("#next-action");
    nextAction.addEventListener("click", nextActionHandler);
}

const renderCard = () => {
    if(cards.length === 0) return false;
    const newCard = cards.shift();
    const card = document.querySelector("#card");
    card.innerText = newCard.value;
}

const getCards = async () => {
    try {
        const response = await fetch('./cards.json');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        for (let i = data.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = data[i];
            data[i] = data[j];
            data[j] = temp;
        }
        if(data.length > ROUNDS){
            cards = [...data.slice(0, ROUNDS)];
        }else {
            cards = [...data];
        }
        renderCard();
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

const showGameScreen = async () => {
    if (players.length < 2) {
        alert("Debe haber al menos dos jugadores")
        return false;
    }
    ROUNDS = document.querySelector("#rounds")?.value ?? 5;
    TIME_LIMIT = document.querySelector("#time")?.value ?? 10;
    body.innerHTML = "";
    const menuContainer = document.createElement("section");
    menuContainer.classList.add("menu-container");
    menuContainer.id = "menu-container";
    const card = document.createElement("div");
    card.classList.add("card");
    card.id = "card";
    card.innerHTML = "";
    const nextAction = document.createElement("button");
    nextAction.classList.add("next-action");
    nextAction.id = "next-action";
    nextAction.innerHTML = "Next";
    const endAction = document.createElement("button");
    endAction.classList.add("end-action");
    endAction.id = "end-action";
    endAction.innerHTML = "End";
    menuContainer.appendChild(card);
    menuContainer.appendChild(nextAction);
    menuContainer.appendChild(endAction);
    const alphabetContainer = document.createElement("section");
    alphabetContainer.classList.add("alphabet-container");
    alphabetContainer.id = "alphabet-container";
    const timerContainer = document.createElement("section");
    timerContainer.classList.add("timer-container");
    timerContainer.id = "timer-container";
    const clock = document.createElement("div");
    clock.classList.add("clock");
    clock.id = "clock";
    const clockTimer = document.createElement("span");
    clockTimer.classList.add("clock-timer");
    clockTimer.id = "clock-timer";
    clockTimer.innerHTML = TIME_LIMIT;
    clock.appendChild(clockTimer);
    clock.appendChild(document.createTextNode("'S"));
    const clockAction = document.createElement("button");
    clockAction.classList.add("clock-action");
    clockAction.id = "clock-action";
    clockAction.innerHTML = "Clock";
    const clearAction = document.createElement("button");
    clearAction.classList.add("restart-action");
    clearAction.id = "restart-action";
    clearAction.innerHTML = "Clear";
    timerContainer.appendChild(clock);
    timerContainer.appendChild(clockAction);
    timerContainer.appendChild(clearAction);
    body.appendChild(menuContainer);
    body.appendChild(alphabetContainer);
    body.appendChild(timerContainer);
    createAlphabet();
    await getCards();
    appendGameFunctions();
}


const removePlayer = (position) => {
    players = players.filter((e, index) => index !== position);
    renderPlayers();
}

const renderPlayers = () => {
    if (players.length === 0) return 0;
    const playerList = document.querySelector("#player-list");
    playerList.innerHTML = "";
    for (let [index, playerObject] of players.entries()) {
        const player = document.createElement("li");
        player.classList.add("player");
        const playerName = document.createElement("span");
        playerName.classList.add("player-name");
        playerName.innerText = playerObject.name;
        const playerRemoveAction = document.createElement("button");
        playerRemoveAction.classList.add("remove-player-action");
        playerRemoveAction.id = "remove-player-action";
        playerRemoveAction.innerText = "X";
        playerRemoveAction.addEventListener("click", () => removePlayer(index));
        player.appendChild(playerName);
        player.appendChild(playerRemoveAction);
        playerList.appendChild(player);
    }
}

const addPlayer = () => {
    const name = document.querySelector("#name-input");
    if (name.value === "") return false;
    players.push({
        name: name.value,
        score: 0,
    });
    name.value = "";
    renderPlayers();
}

const appendConfigurationFunctions = () => {
    const startAction = document.querySelector("#start-action");
    startAction.addEventListener("click", showGameScreen);
    const addPlayerAction = document.querySelector("#add-player-action");
    addPlayerAction.addEventListener("click", addPlayer);
}

const showConfigurationScreen = () => {
    const logoContainer = document.createElement("section");
    logoContainer.classList.add("logo-container");
    logoContainer.id = "logo-container";
    const logo = document.createElement("h1");
    logo.classList.add("logo");
    logo.innerHTML = "UYYYY KIETO!";
    const startContainer = document.createElement("section");
    startContainer.classList.add("start-container");
    startContainer.id = "start-container";
    const startAction = document.createElement("button");
    startAction.classList.add("start-action");
    startAction.id = "start-action";
    startAction.innerHTML = "Start";
    const configurationContainer = document.createElement("section");
    configurationContainer.classList.add("configuration-container");
    configurationContainer.id = "configuration-container";
    const playersContainer = document.createElement("div");
    playersContainer.classList.add("players-container");
    playersContainer.id = "players-container";
    const playersTitle = document.createElement("h2");
    playersTitle.classList.add("players-title");
    playersTitle.innerText = "Jugadores:";
    const playerAdd = document.createElement("div");
    playerAdd.classList.add("player-add");
    playerAdd.id = "player-add";
    const playerAddLabel = document.createElement("label");
    playerAddLabel.htmlFor = "name-input";
    playerAddLabel.innerText = "Nombre:";
    const playerAddInput = document.createElement("input");
    playerAddInput.classList.add("name-input");
    playerAddInput.name = "name-input";
    playerAddInput.id = "name-input";
    playerAddInput.type = "text";
    const playerAddAction = document.createElement("button");
    playerAddAction.classList.add("add-player-action")
    playerAddAction.id = "add-player-action";
    playerAddAction.innerText = "Agregar";
    const playerListContainer = document.createElement("div");
    playerListContainer.classList.add("player-list-container");
    playerListContainer.id = "player-list-container";
    const playerList = document.createElement("ul");
    playerList.classList.add("player-list");
    playerList.id = "player-list";
    const settingsContainer = document.createElement("div");
    settingsContainer.classList.add("settings-container");
    settingsContainer.id = "settings-container";
    const roundLabel = document.createElement("label");
    roundLabel.htmlFor = "rounds";
    roundLabel.innerText = "Rondas:"
    const rounds = document.createElement("input");
    rounds.classList.add("rounds");
    rounds.name = "rounds";
    rounds.id = "rounds";
    rounds.value = 5;
    rounds.type = "number";
    const timeLabel = document.createElement("label");
    timeLabel.htmlFor = "time";
    timeLabel.innerText = "Tiempo (segundos):"
    const time = document.createElement("input");
    time.classList.add("time");
    time.name = "time";
    time.id = "time";
    time.value = 10;
    time.type = "number";
    logoContainer.appendChild(logo);
    playersContainer.appendChild(playersTitle);
    playerAdd.appendChild(playerAddLabel);
    playerAdd.appendChild(playerAddInput);
    playerAdd.appendChild(playerAddAction);
    playersContainer.appendChild(playerAdd);
    playerListContainer.appendChild(playerList);
    playersContainer.appendChild(playerListContainer);
    configurationContainer.appendChild(playersContainer);
    settingsContainer.appendChild(roundLabel);
    settingsContainer.appendChild(rounds);
    settingsContainer.appendChild(timeLabel);
    settingsContainer.appendChild(time);
    configurationContainer.appendChild(settingsContainer);
    startContainer.appendChild(startAction);
    body.appendChild(logoContainer);
    body.appendChild(configurationContainer);
    body.appendChild(startContainer);
    appendConfigurationFunctions();
    renderPlayers();
}

document.addEventListener("DOMContentLoaded", () => {
    body = document.querySelector("body");
    showConfigurationScreen();
});