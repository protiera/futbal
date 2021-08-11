

const submitButton = document.getElementById("submit");
submitButton.addEventListener('click', (e) => {
    reset = true;
    bluePlayersCount = document.getElementById("bluePlayers").value;
    redPlayersCount = document.getElementById("redPlayers").value;
    init();
    console.log(blueTeam);
    console.log(redTeam);
});