/**
 * This code will takes user input (name, age and favourite colour) and change the game info appropriately.
 * Will show the matching card game, game info and help button after the user submits the form.
 * The game will begin and the player needs to match all the cards before the timer runs out.
 * Based on the outcome a message will appear and audio will play in the background.
 * 
 * I, Rhagavy Rakulan, 000802106 certify that this material is my original work.  
 * No other person's work has been used without due acknowledgement. 
 *   
 * Name: Rhagavy Rakulan, Student#: 000802106
 * Date created: Sunday, November 8, 2020
 * 
 */

//event listener waits for page to fully load
window.addEventListener("load", function(){
    //eventlistener for submit button
    document.forms.player-form.addEventListener("submit",function(event){
        event.preventDefault();
        // console.log(event.target);
        let playerName = event.target.name.value;
        let playerAge = event.target.age.value;
        let playerColour = event.target.colorpicker.value;
        console.log(playerColour);
        
        
        if (playerName.trim()!==""&& typeof parseInt(playerAge) == 'number'){
            //make game container visibile & hide the form
            playBGM();
            shuffleCards();
            gameAppear();
            buttonAppear();
            formDisappear();
            //set player name in game info & set colour as background color for front-face/card-back
            formInput(playerName,playerAge,playerColour);
            let timer2 = setInterval(gameTimer,1000);
            time = 90;
            /**
            * 
            */
            function gameTimer(){
                let node = document.getElementById("time-left");
                let node2 = document.getElementById("outcome");
                let node3 = document.getElementById("instructions-container");
                
                if(time > 0){
                    time = time -1;
                    node.innerHTML = time;
                    console.log(time)   
                }
                if (time === 0){
                    gameOver();
                    let node3 = document.getElementById("instructions-container");
                    node3.style.visibility ="visible";
                    node2.innerHTML = "Aw! Better Luck next time...";
                    console.log(node2.innerText)
                    //show lose message & play lose music
                }
                else if (score===10){
                    gameOver();
                    clearInterval(timer2);
                    node2.innerHTML = "Yay! You won!!!!";
                    node3.style.visibility ="visible";
                    console.log(node2.innerText)
                    //show win message & play winner music
                }
            }
        }
        else{
            //make wrong input image appear
            warningImage();
        }
   
    });
    //stores element of background audio
    let bgm = document.getElementById("background");

    //stores element of "it's a match" audio
    let match = document.getElementById("aMatch");

    //stores element of "it's not a match" audio
    let notAMatch = document.getElementById("noMatch");

    //stores element of "you lose" audio
    let youLose = document.getElementById("youLose");

    //stores element of " you win" audio
    let youWin = document.getElementById("winner");

    /**
     * plays background music in a loop
     */
    function playBGM(){
        bgm.volume = 0.6;
        bgm.play();
        bgm.loop = true;
    }

    /**
     * pauses background music
     */
    function pauseBGM(){
        bgm.pause();
        bgm.currentTime=0;
    }
    /**
     * changes inner html to contain the player name and their age inputted in the form.
     * select all  front side of card elements and change the backfround colour to user's favourite
     * colour.
     */
    function formInput(playerName,playerAge,playerColour){
        let node = document.getElementById("player-name");
        let node2 = document.querySelectorAll(".front-face");
        node.innerHTML = " "+playerName+" "+"("+playerAge+")";
        for (let i = 0; i<node2.length;i++){
            node2[i].style.backgroundColor = playerColour;
        }
        
    }

    // store help element
    let help = document.getElementById("help");
    /**
     * makes the help button visible
     */
    function buttonAppear(){
        help.style.visibility = "visible"
    }

    // event listener for help button
    help.addEventListener("click", needHelp);

    // stores whether or nor user wants help 
    let helpWanted = true;
    /**
     * allows help button to give instructions to user.
     * hides instructions when it not needed anymore.
     */
    function needHelp(){
        let node = document.getElementById("instructions-container");
        let node1 = document.getElementById("heading")
        let node2 = document.getElementById("instruct1")
        let node3 = document.getElementById("instruct2")
        if(helpWanted){
            node.style.visibility ="visible";
            node1.innerHTML = "Instructions";
            node2.innerHTML = "1. Start matching the cards to add points to your score";
            node3.innerHTML = "2. Get 10 point before the timer runs out to win!";
            helpWanted=false;
        }
        else{
            node.style.visibility = "hidden";
            helpWanted = true;
        }    
           
    }
    
    //let element = document.getElementById("info");
    //let elements = element.querySelectorAll(".info");
    //selecting all card elements
    let cards = document.querySelectorAll(".card");

    /**
     *adds click event listeners to all cards
     */
    cards.forEach(function(card){
        card.addEventListener("click",flipCard)
    });
    
    /**
     * reassigns default order property to between 0 and 19 to shuffle the cards
     */
    function shuffleCards(){
        cards.forEach(function(card){
            let random = Math.floor(Math.random()*20);
            card.style.order = random;
        });
    }

    //stores whether card was flipped or not
    let cardFlipped = false;

    //stores first cards pick, second card picked and score of player
    let firstPick, secondPick, score = 0;

    // stores value to prevent user from click cards before they flip back
    let stopClick = false;

    /**
     * determins if selected card is user's first pick or second and flips card.
     * after second pick function is called to determin if cards match
     */
    function flipCard(){
        //flip the card that was selected. Call the css that will flip back face by 180 deg and flip
        //front face by 180 deg
        if (stopClick||this === firstPick) return;
        this.classList.add("flip");

        if(!cardFlipped){
            cardFlipped = true;
            firstPick = this;
            firstPick.removeEventListener ("click", flipCard);    
        }
        else{
            cardFlipped = false;
            secondPick = this;
            secondPick.removeEventListener("click", flipCard);
            matchOrNot(firstPick,secondPick);
        }
    }
    /**
     * checks if two selected cards match or not and play appropriate sound effects.
     * if selected cards don't match, wait for cards to finish flipping before allowing user
     * to click again.
     * calls scoreKeeper and reset function.
     * 
     * @param firstPick
     * @param secondPick
     */
    function matchOrNot (firstPick,secondPick){
        let card1 = firstPick.dataset.name;
        let card2 = secondPick.dataset.name;
        if (card1 === card2){
            scoreKeeper();
            match.volume = 0.6;
            match.play();
        }
        else{
            stopClick = true;
            notAMatch.volume = 0.6;
            notAMatch.play();
            //waits for cards to finish flipping back before readding event listeners
            setTimeout(function(){
                firstPick.classList.remove("flip");
                firstPick.addEventListener("click",flipCard);
                secondPick.classList.remove("flip");
                secondPick.addEventListener("click", flipCard);
                reset();
            },2000);          
        }
    }

    /**
     * adds score when player matches a pair of cards, changes inner html of score element.
     */
    function scoreKeeper(){
        // firstPick.removeEventListener ("click", flipCard);
        // secondPick.removeEventListener("click", flipCard);
        score = score + 1;
        let node = document.getElementById("score");
        node.innerHTML = score;
        console.log(score);
    }

    /**
     * resets values for variables: cardFlipped,stopClick,fristPick,secondPick.
     */
    function reset(){
        cardFlipped = false;
        stopClick = false;
        firstPick = null;
        secondPick = null;
    }

    /**
     * makes wrong-input element visible
     */
    function warningImage(){
        let node = document.getElementById("wrong-input");
        node.style.visibility = "visible";
    }

    /**
     * makes form-container element hidden
     */
    function formDisappear(){
        let node = document.getElementById("form-container");
        node.style.visibility = "hidden";
    }

    /**
     * makes game & infor infor elements visible
     */
    function gameAppear(){
        let node = document.getElementById("game");
        let node2 = document.getElementById("info");
        node.style.visibility = "visible";
        node2.style.visibility = "visible";
    }

    /**
     * removes event listeners for cards and the help button, pause background audio
     * and plays appropriate audio based on player winning or losing 
     */
    function gameOver(){
        cards.forEach(function(card){
            card.removeEventListener("click",flipCard)
        });
        help.removeEventListener("click",needHelp)
        pauseBGM();
        if(time === 0){
            youLose.volume = 0.6;
            youLose.play();    
        }else{
            youWin.volume = 0.6;
            youWin.play();
            youWin.loop = true;
        }
    }

});