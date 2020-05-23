var socket = io();
let yourColor = '';
$(document).ready(function () {
    $(".winnerStamp").hide(); //hide winner stamp
    disableButton($(".redButton")); //start game with red player, disable all other players
    disableButton($(".blueButton"));
    disableButton($(".yellowButton"));
    disableButton($(".greenButton"));
   
    let {username,room} = getUrlVars();
    //emit the join
    socket.emit('join',{username,room},(res)=>{
        debugger
        if(res.status == 0){
            alert(error) 
            location.href = '/'
        }else
        {
            yourColor = res.user.color.toLowerCase();
            $('.base').css('color',yourColor).html(`Hi ${res.user.username}, your color is ${yourColor}`);
            enableButton($(`.${yourColor}Button`))
        }
    });
    
    //on for rolling the dice
    socket.on('roll',({color,number})=>{debugger
        rollColor(color,number);
    })    
    socket.on('movepawn',({color,id})=>{debugger
        var $e = $(`#${id}`);
        switch (color) {
            case 'red':
                return redPlayerClicked($e);
            case 'green':
                return greenPlayerClickedPlayerClicked($e);
            case 'blue':
                return bluePlayerClickedPlayerClicked($e);
            case 'yellow':
                return yellowPlayerClicked($e);
            default:
                return 0;
        }
        rollColor(color,number);
    })  

    
});
function roll(color){
    let number = rollColor(color);
    socket.emit('roll',{color,number});
}
function rollColor(color,number){
    switch (color) {
        case 'red':
            return rollRed(number);
        case 'green':
            return rollGreen(number);
        case 'blue':
            return rollBlue(number);
        case 'yellow':
            return rollYellow(number);
        default:
            return 0;
    }
}
function rollDice($dice, $button,number) {
    $($button).removeClass("repeatChance");
    if(!number)
        number = Math.floor(Math.random() * 6); //generate random dice number
    number = 6;
    $($dice).text(number); //append text to dice
    //according to the dice number display respective image of dice
    if (number == 1) {
        $($dice).append("<img src='one.png' />")
    }
    if (number == 2) {
        $($dice).append("<img src='two.png' />")
    }
    if (number == 3) {
        $($dice).append("<img src='three.png' />")
    }
    if (number == 4) {
        $($dice).append("<img src='four.png' />")
    }
    if (number == 5) {
        $($dice).append("<img src='five.png' />")
    }
    if (number == 6) {
        $($dice).append("<img src='six.png' />")
    }
    return number;
}

function greenMovement($pawn) {
    var $currentPosition = $($pawn).parent().attr("class").replace("blocks ", "").replace("g", ""); //fetch current position of the pawn
    var $diceNumber = $(".greenDice").text(); //fetch dice number
    var $moveTo = parseInt($currentPosition) + parseInt($diceNumber); //convert class name into integer type
    $($pawn).appendTo(".g" + $moveTo); //move pawn to the sum of current posiiton and dice number
    if ($(".blocks").children().hasClass("greenPlayer") == false) {
        if ($(".pawnHome").children().hasClass("greenPlayer") == false) {
            //if all players are in final home declare the team as winner
            $(".winnerStampGreen").show();
            $(".gp").addClass("winner");
            disableButton($(".greenButton"));
        }
    }
}
function blueMovement($pawn) {
    var $currentPosition = $($pawn).parent().attr("class").replace("blocks ", "").replace("b", "");
    var $diceNumber = $(".blueDice").text();
    $currentPosition.split(" ");
    $currentPosition = $currentPosition.split(" ")[1];
    var $moveTo = parseInt($currentPosition) + parseInt($diceNumber);
    $($pawn).appendTo(".b" + $moveTo);
    if ($(".blocks").children().hasClass("bluePlayer") == false) {
        if ($(".pawnHome").children().hasClass("bluePlayer") == false) {
            $(".winnerStampBlue").show();
            $(".bp").addClass("winner");
            disableButton($(".blueButton"));
        }
    }
}
function redMovement($pawn) {
    var $currentPosition = $($pawn).parent().attr("class").replace("blocks ", "").replace("r", "");
    var $diceNumber = $(".redDice").text();
    $currentPosition.split(" ");
    $currentPosition = $currentPosition.split(" ")[2];
    var $moveTo = parseInt($currentPosition) + parseInt($diceNumber);
    $($pawn).appendTo(".r" + $moveTo);
    if ($(".blocks").children().hasClass("redPlayer") == false) {
        if ($(".pawnHome").children().hasClass("redPlayer") == false) {
            $(".winnerStampRed").show();
            $(".rp").addClass("winner");
            disableButton($(".redButton"));
        }
    }
}
function yellowMovement($pawn) {
    var $currentPosition = $($pawn).parent().attr("class").replace("blocks ", "").replace("y", "");
    var $diceNumber = $(".yellowDice").text();
    $currentPosition.split(" ");
    $currentPosition = $currentPosition.split(" ")[3];
    var $moveTo = parseInt($currentPosition) + parseInt($diceNumber);
    $($pawn).appendTo(".y" + $moveTo);
    if ($(".blocks").children().hasClass("yellowPlayer") == false) {
        if ($(".pawnHome").children().hasClass("yellowPlayer") == false) {
            $(".winnerStampYellow").show();
            $(".yp").addClass("winner");
            disableButton($(".yellowButton"));
        }
    }
}
function disableButton($button) {
    $($button).prop("disabled", true);
    $($button).css("opacity", 0.7);
    $($button).css("font-size", "13px");
}
function enableButton($button) {
    var _class = `${yourColor.toLowerCase()}Button`
    if($button.hasClass(_class)){
        $($button).prop("disabled", false);
        $($button).css("opacity", 1);
        $($button).css("font-size", "20px");
    }
}
function resizePawn($pawn) {
    $($pawn).siblings().css("font-size", "20px");
    $($pawn).css("font-size", "20px");
}
function originalPawnSize($pawn) {
    $($pawn).css("font-size", "30px");
}
function killPawn($pawn, $button) {
    var $position = $($pawn).siblings().attr("start"); //fetch specific pawn home of resective pawn
    $($pawn).siblings().removeClass("active"); //remove active class once killed
    $($pawn).siblings().css("font-size", "40px");
    $("." + $position).append($($pawn).siblings()); //append pawn to respective pawn home
    $($pawn).css("font-size", "30px");
    $($button).addClass("repeatChance"); //killer gets to roll dice again
}
function highlightPawn($pawn) {
    $($pawn).addClass("highlighted");
    $($pawn).addClass("spinAnimation");
}

function removeHighlight($pawn) {
    $($pawn).removeClass("highlighted");
    $($pawn).removeClass("spinAnimation");
}
//get all querystring parameters
function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
function rollGreen(number){
    var ownPlayer = number === undefined;
    if ($(".fas").parent().hasClass("finish") == true) { //remove classes from player after reaching finish home
        $(".fas").parent(".finish").children().removeClass("active");
        $(".fas").parent(".finish").children().removeClass("greenPlayer");
    }
    number = rollDice($(".greenDice"), $(".yellowButton"),number); //rollDice to obtain random number
    $(".redDice").empty(); //empty previous dice
    $(".yellowDice").empty();
    $(".blueDice").empty();
    if ($(".gp").hasClass("winner") == true) { //skip chance if won
        $(".greenDice").empty();
        enableButton($(".yellowButton"));
    }
    if ($(".greenDice").text() != 6) {
        disableButton($(".greenButton"));
        if ($(".greenPlayer").hasClass("active") == false) {
            enableButton($(".yellowButton"));
        }
    }
    $(".greenPlayer.active").off("click").on("click", function () {
        greenPlayerClicked(this);
    });
    if ($(".greenDice").text() == 6 && ownPlayer) {
        disableButton($(".greenButton"));
        highlightPawn($(".greenPlayer"));
        $(".highlighted").off("click").on("click", function () {
            highlightedClicked(this,'green')
        });
    } else {
        $(".greenPlayer.active").addClass("highlighted");
        $(".greenPlayer.active").addClass("spinAnimation");
    }
    return number;
}
function greenPlayerClicked(e){
    if ($(e).siblings().length == 1) { //if single pawn present in a block change pawn size to default
        originalPawnSize($(e).siblings());
    }
    greenMovement(e); //move pawn according to dice number
    if ($(e).parent().hasClass("finish") == true) { //if pawn goes into final house respective player gets one more chance to roll dice
        enableButton($(".greenButton"));
        $(".yellowButton").addClass("repeatChance");
    }
    if ($(e).siblings().length > 0) { //if more than one pawn is present in a block then resize pawn
        resizePawn($(e));
    } else {
        originalPawnSize($(e));
    }
    if ($(e).parent().not('.safe').children().length > 1) { //kill opponent if not in safe zone
        if ($(e).siblings().hasClass('greenPlayer') === false) { //check whether pawn is an opponent or not
            killPawn($(this), $(".yellowButton")); //append the killed pawn to respective pawn home
            enableButton($(".greenButton"));
        }
    }
    if ($(".greenPlayer, .bluePlayer, .yellowPlayer, .redPlayer").hasClass("active") == true) {
        if ($(".yellowButton").hasClass("repeatChance") == false) {
            enableButton($(".yellowButton"));
        }
        if ($(".greenPlayer").hasClass("winner") == true) {
            enableButton($(".yellowButton"));
        }
    }
    $(".greenPlayer").off("click");
    removeHighlight($(".greenPlayer"));
    socket.emit('movepawn',{color:'green',id: $(e).attr('id')})
}
function rollBlue(number){
    var ownPlayer = number === undefined;
    if ($(".fas").parent().hasClass("finish") == true) {
        $(".fas").parent(".finish").children().removeClass("active");
        $(".fas").parent(".finish").children().removeClass("bluePlayer");
    }
    number = rollDice($(".blueDice"), $(".redButton"));
    if ($(".bp").hasClass("winner") == true) {
        $(".blueDice").empty();
        enableButton($(".redButton"));
    }
    $(".redDice").empty();
    $(".yellowDice").empty();
    $(".greenDice").empty();
    if ($(".blueDice").text() != 6) {
        disableButton($(".blueButton"));
        if ($(".bluePlayer").hasClass("active") == false) {
            enableButton($(".redButton"));
        }
    }
    $(".bluePlayer.active").off("click").on("click", function () {
        bluePlayerClicked(this);
    });
    if ($(".blueDice").text() == 6 && ownPlayer) {
        disableButton($(".blueButton"));
        highlightPawn($(".bluePlayer"));
        $(".highlighted").off("click").on("click", function () {
            highlightedClicked(this,'blue')
        });
    } else {
        $(".bluePlayer.active").addClass("highlighted");
        $(".bluePlayer.active").addClass("spinAnimation");
    }
    return number;
}
function bluePlayerClicked(e)
{
    if ($(e).siblings().length == 1) {
        originalPawnSize($(e).siblings());
    }
    blueMovement(e);
    if ($(e).parent().hasClass("finish") == true) {
        enableButton($(".blueButton"));
        $(".redButton").addClass("repeatChance");
    }
    if ($(e).siblings().length > 0) {
        resizePawn($(e));
    } else {
        originalPawnSize($(e));
    }
    if ($(e).parent().not('.safe').children().length > 1) {
        if ($(e).siblings().hasClass('bluePlayer') === false) {
            killPawn($(this), $(".redButton"));
            enableButton($(".blueButton"));
        }
    }
    if ($(".greenPlayer, .bluePlayer, .yellowPlayer, .redPlayer").hasClass("active") == true) {

        if ($(".redButton").hasClass("repeatChance") == false) {
            enableButton($(".redButton"));
        }
    }
    $(".bluePlayer").off("click");
    removeHighlight($(".bluePlayer"));
    socket.emit('movepawn',{color:'blue',id: $(e).attr('id')})
}
function rollRed(number){
    //RED
    debugger
    var ownPlayer = number === undefined;
    if ($(".fas").parent().hasClass("finish") == true) {
        $(".fas").parent(".finish").children().removeClass("active");
        $(".fas").parent(".finish").children().removeClass("redPlayer");
    }
    number = rollDice($(".redDice"), $(".greenButton"),number);
    if ($(".rp").hasClass("winner") == true) {
        $(".redDice").empty();
        enableButton($(".greenButton"));
    }
    $(".blueDice").empty();
    $(".yellowDice").empty();
    $(".greenDice").empty();
    if ($(".redDice").text() != 6) {
        disableButton($(".redButton"));
        if ($(".redPlayer").hasClass("active") == false) {
            enableButton($(".greenButton"));
        }
    }
    $(".redPlayer.active").off("click").on("click", function () {
        debugger
        redPlayerClicked(this);
    });
    if ($(".redDice").text() == 6 && ownPlayer) {
        disableButton($(".redButton"));
        highlightPawn($(".redPlayer"));
        $(".highlighted").off("click").on("click", function () {
            highlightedClicked(this,'red')
        });
    } else {
        $(".redPlayer.active").addClass("highlighted");
        $(".redPlayer.active").addClass("spinAnimation");
    }
    return number;
}
function redPlayerClicked(e){debugger
    if ($(e).siblings().length == 1) {
        originalPawnSize($(e).siblings());
    }
    redMovement(e);
    if ($(e).parent().hasClass("finish") == true) {
        enableButton($(".redButton"));
        $(".greenButton").addClass("repeatChance");
    }
    if ($(e).siblings().length > 0) {
        resizePawn($(e));
    } else {
        originalPawnSize($(e));
    }
    if ($(e).parent().not('.safe').children().length > 1) {
        if ($(e).siblings().hasClass('redPlayer') === false) {
            killPawn($(e), $(".greenButton"));
            enableButton($(".redButton"));
        }
    }
    if ($(".yellowPlayer, .redPlayer, .bluePlayer, .greenPlayer").hasClass("active") == true) {

        if ($(".greenButton").hasClass("repeatChance") == false) {
            enableButton($(".greenButton"));
        }
    }
    $(".redPlayer").off("click");
    removeHighlight($(".redPlayer"));
    socket.emit('movepawn',{color:'red',id: $(e).attr('id')})
}
function rollYellow(number){
    var ownPlayer = number === undefined;
    if ($(".fas").parent().hasClass("finish") == true) {
        $(".fas").parent(".finish").children().removeClass("active");
        $(".fas").parent(".finish").children().removeClass("yellowPlayer");
    }
    number = rollDice($(".yellowDice"), $(".blueButton"),number);
    if ($(".yp").hasClass("winner") == true) {
        $(".yellowDice").empty();
        enableButton($(".blueButton"));
    }
    $(".greenDice").empty();
    $(".blueDice").empty();
    $(".redDice").empty();
    if ($(".yellowDice").text() != 6) {
        disableButton($(".yellowButton"));
        if ($(".yellowPlayer").hasClass("active") == false) {
            enableButton($(".blueButton"));
        }
    }
    $(".yellowPlayer.active").off("click").on("click", function () {
        yellowPlayerClicked(e);
    });
    if ($(".yellowDice").text() == 6 && ownPlayer) {
        disableButton($(".yellowButton"));
        highlightPawn($(".yellowPlayer"));
        $(".highlighted").off("click").on("click", function () {
            highlightedClicked(this,'yellow')
        });
    } else {
        $(".yellowPlayer.active").addClass("highlighted");
        $(".yellowPlayer.active").addClass("spinAnimation");
    }
    return number;
}
function yellowPlayerClicked(e){
    if ($(e).siblings().length == 1) {
        originalPawnSize($(e).siblings());
    }
    yellowMovement(e);
    if ($(e).parent().hasClass("finish") == true) {
        enableButton($(".yellowButton"));
        $(".blueButton").addClass("repeatChance");
    }
    if ($(e).siblings().length > 0) {
        resizePawn($(e));
    } else {
        originalPawnSize($(e));
    }
    if ($(e).parent().not('.safe').children().length > 1) {
        if ($(e).siblings().hasClass('yellowPlayer') === false) {
            killPawn($(e), $(".blueButton"));
            enableButton($(".yellowButton"));
        }
    }
    if ($(".yellowPlayer, .redPlayer, .bluePlayer, .greenPlayer").hasClass("active") == true) {
        if ($(".blueButton").hasClass("repeatChance") == false) {
            enableButton($(".blueButton"));
        }
    }
    $(".yellowPlayer").off("click");
    removeHighlight($(".yellowPlayer"));
    socket.emit('movepawn',{color:'yellow',id: $(e).attr('id')})
}
function highlightedClicked(e,color){
    if ($(e).siblings().length == 1) {
        originalPawnSize($(e));
        originalPawnSize($(e).siblings());
    }
    $(".highlighted").off("click");
    if ($(`.${color}Dice`).text() == 6) {
        if ($(e).hasClass("active") == true) {
            redMovement(e);
            if ($(e).parent().not('.safe').children().length > 1) {
                if ($(e).siblings().hasClass(`${color}Player`) === false) {
                    killPawn($(e));
                }
            }
        } else {
            $(e).appendTo(`.${color[0]}0`);
            $(e).addClass("active");

            if ($(e).siblings().length > 0) {
                resizePawn($(e));
            } else {
                originalPawnSize($(e));
            }
        }
    }
    enableButton($(`.${color}Button`));
    removeHighlight($(`.${color}Player`));
    socket.emit('movepawn',{color,id: $(e).attr('id')})
}
