

const submitButton = document.getElementById("submit");
const stopButton = document.getElementById("stop");
const playPauseButton = document.getElementById("playPause");
const fpsInput = document.getElementById("fps");


// sleep time expects milliseconds
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}


function resetGame(){
    reset = true;
    pause = false;
    init();
}

function pauseGame(){
    pause = true;
    document.getElementById("pauseIcon").classList.add("hidden");
    document.getElementById("playIcon").classList.remove("hidden");
}

function resumeGame(){
    pause = false;
    document.getElementById("pauseIcon").classList.remove("hidden");
    document.getElementById("playIcon").classList.add("hidden");
    main()
}

submitButton.addEventListener('click', (e) => {
    resetGame();
    resumeGame();
    console.log(blueTeam);
    console.log(redTeam);
});

stopButton.addEventListener('click', (e) => {
    resetGame();
    pauseGame();
})

playPauseButton.addEventListener('click', (e)=> {
    if(pause){
        resumeGame()
    }
    else{
        pauseGame();
    }
});

fpsInput.addEventListener('change', (e)=>{
    fps = e.target.value;
});