/*
    Système global d'un tour de jeu : 
    
    - Le ball manager determine l'état de la balle : 
        - Controllable : la balle peut être tiré par un des joueurs, du moment que le joueur est à porté
        - Incontrollable : la balle rebondit sur les joueurs qu'elle recontre 
        - Hors jeu
*/


// initialize config variables here
let canvas, ctx

const FIELD_SIZE = {
    width: 1200,
    height: 600
}

const teamColors = {
    RED: "red",
    BLUE: "blue"
}

const ballState = {
    UNCONTROLLABLE: "unc",
    CONTROLLABLE: "con",
    OUT: "out"
}

var bluePlayersCount = 1;
var redPlayersCount = 1;
var entities;
var ball;
var blueTeam;
var redTeam;
var reset = false;
var pause = false;
var fps = 100;


function animate(){
    if(!reset){
        setTimeout(function() {
            requestAnimationFrame(main);
        }, 1000 / fps);
    }
    else{
        reset = false;
    }

}

// setup config variables and start the program
function init() {
    bluePlayersCount = document.getElementById('bluePlayers').value;
    redPlayersCount = document.getElementById('redPlayers').value;
    fps = document.getElementById('fps').value;
    // set our config variables
    canvas = document.getElementById('mainCanvas')
    ctx = canvas.getContext('2d');

    ball = new Ball(600, 300, 0);

    blueTeam = new Team(teamColors.BLUE);
    redTeam = new Team(teamColors.RED);

    entities = [
        field = new Field(),
        BallManager,
        blueTeam,
        redTeam,
        ball
    ];

    animate();
}

function main() {
      
    ctx.clearRect(0, 0, 1200, 600);
    
    entities.forEach(function(entity) {
        if(!pause){
            entity.update();
        }
        entity.draw();
    });
    
    
    if(!pause){
        animate();
    }        

}

// wait for the HTML to load
document.addEventListener('DOMContentLoaded', init)


class Ball {
    constructor(x, y, velocity = 0, angle = 0, radius = 5) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.angle = angle;
        this.radius = radius;
        this.ballState = ballState.CONTROLLABLE;
    }

    update() {
        this.move();

    }

    move() {
        this.UpdateAngle();
        this.x += Math.cos(this.angle) * this.velocity;
        this.y += -Math.sin(this.angle) * this.velocity;
        this.velocity -= this.velocity * 0.01;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.stroke();
    }

    UpdateAngle() {
        if (this.x < 0 + this.radius || this.x > FIELD_SIZE.width - this.radius) {
            this.angle = Math.PI / 2 - (this.angle - Math.PI / 2);
        } else if (this.y < 0 + this.radius || this.y > FIELD_SIZE.height - this.radius) {
            this.angle = Math.PI - (this.angle - Math.PI);
        }
    }
}

class Player {
    constructor(team, x, y, maxspeed, power) {
        this.x = x;
        this.y = y;
        this.maxspeed = maxspeed;
        this.power = power;
        this.radius = 10;
        this.team = team;
        this.velocity = 0;
    }

    update() {

        this.getBall();
        this.play();
        this.move();
        // console.log("Player angle : " + this.angle);
    }


    play() {
        this.shoot(Math.random() * 2 * Math.PI, this.power / 3);
    }

    shoot(angle, power) {
        BallManager.shoot(this, angle, power);
    }

    getBall() {
        this.angle = MathUtils.getAngleBetweenTwoEntities(this, ball);
        MathUtils.getDistanceBetweenTwoEntities(this, ball);
    }

    move() {

        if (this.velocity < this.maxspeed) {
            this.velocity += this.maxspeed / 120;
        }
        this.x += Math.cos(this.angle) * this.velocity;
        this.y += -Math.sin(this.angle) * this.velocity;


    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.team.teamColor;
        ctx.fill();
        ctx.stroke();
    }
}

class Field {
    constructor(x = 0, y = 0, width = FIELD_SIZE.width, height = FIELD_SIZE.height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    update() {}

    draw() {
        ctx.beginPath()
        ctx.strokeRect(this.x, this.y, this.width, this.height)
    }
}

class MathUtils {
    static getAngleBetweenTwoEntities(mainEntity, targetEntity) {
        var delta_x = targetEntity.x - mainEntity.x;
        var delta_y = targetEntity.y - mainEntity.y;
        var theta_radians = Math.atan2(delta_y, delta_x);
        // console.log("angle between player and ball" + theta_radians);
        return theta_radians;
    }

    static getDistanceBetweenTwoEntities(mainEntity, targetEntity) {
        var delta_x = targetEntity.x - mainEntity.x;
        var delta_y = targetEntity.y - mainEntity.y;
        var distance = Math.sqrt(Math.pow(delta_x, 2) + Math.pow(delta_y, 2));
        return distance;
    }
}

class BallManager {
    static update() {
        this.checkBallState();
    }



    static checkBallState() {
        if (ball.velocity > 2) {
            ball.ballState = ballState.UNCONTROLLABLE;
        } else {
            ball.ballState = ballState.CONTROLLABLE;
        }
    }

    /*
        Vérifie si le les joueurs peuvent prendre possission de la balle
        S'il y a qu'un joueur il devient propriétaire de la balle
        S'il y a plusieurs joueurs, un tirage définit le nouveau propriétaire de la balle : 
            - Le tirage a plus de chance de tirer un joueur avec beaucoup de dribble 
    */

    static draw() {}

    static shoot(player, angle, power) {
        if (MathUtils.getDistanceBetweenTwoEntities(player, ball) < ball.radius && ball.ballState == ballState.CONTROLLABLE) {
            if (power > player.power) {
                power = player.power;
            }
            ball.velocity = power;
            ball.angle = angle;
            player.velocity -= player.velocity / 2;



        }
    }
}

class Team {
    constructor(teamColor) {
        this.teamColor = teamColor;
        if (teamColor == teamColors.RED) {
            console.log("Red team created");
            this.players = [];
            for(let i = 0; i < redPlayersCount; i++){
                this.players.push(new Player(this, 400, 100+100*i, 2, 8));
            }
        } else if (teamColor == teamColors.BLUE) {
            console.log("Blue team created");
            this.players = [];
            for(let i = 0; i < bluePlayersCount; i++){
                this.players.push(new Player(this, 100, 100+100*i, 2, 8));
            }
        }
    }

    draw() {
        this.players.forEach(function(player) {
            player.draw();
        });
    }

    update() {
        this.players.forEach(function(player) {
            player.update();
        });
    }
}

// class Net {
//     constructor(x, y, x2, y2) {
//         this.x = x;
//         this.y = y;
//         this.x2 = x2;
//         this.y2 = y2;
//     }

//     update() {}

//     draw() {

//     }
// }