// Variables to track dice state
let playerDice=[]; // i.e the dice player chose to keep
let rollCount=0;
let transformValues= [
    [0, 35], [-5, 45], [0, 40], [5, 45], [0, 35]
  ];

const playerContainer= document.querySelector(".savedDiceDisplay");
const rollButton= document.querySelector(".reroll-button");
const diceElements= document.querySelectorAll(".dice");
const scoreTableCells=document.querySelectorAll(".cell");

//rollButton.addEventListener("click", rollDice);
rollButton.addEventListener('click', function() {
    if (!rollButton.disabled) {
        if (rollCount < 2) { // Allow up to 2 rolls
            rollDice();
        } else {
            rollButton.disabled = true;
            rollButton.removeEventListener('click', rollDice); 
            console.log('No more rolls allowed, until score is entered.');
        }
    }
});
function rollDice() {
    // Roll five dices over 6.
    rollCount++;
    let randomDice= [];
    for (let i = 0; i < 5; i++) {
        randomDice.push(Math.floor(Math.random() * 6) + 1);
    }

    // Display the rolled dice
    displayDice(randomDice);

}

function displayDice(dice) {
    const playArea= document.querySelector(".DisplayOfRolling");
    const diceContainer = document.querySelector(".savedDiceDisplay");
    //diceContainer.innerHTML = ""; // Clear previous dice
    let numDice= diceContainer.children.length; //num of childs kept
    
    diceElements.forEach( function(diceElement, index){
        if (diceElement.classList.contains("active") || rollCount ==1){
            resetDicePositions(); // cuz only 2 rolls allowed
            const x = transformValues[index][0];// back to intial positions
            const y = transformValues[index][1];

            setTimeout(function(){
                changeDiePosition(diceElement, x, y);
                changeDiceFaces(dice);

                if (rollCount == 2) {
                    rollButton.disabled = true;
                    rollButton.style.opacity = 0.5;
                    console.log('No more rolls allowed. Enter a score First');
                    writeTempValuesInScoreTable(playerDice);
                  }
                
            },500)

        }
    });
}

function resetDicePositions() {
        diceElements.forEach(function(diceElement) {
          diceElement.style.transform = "none";
        });
      }
    
function changeDiePosition(diceElement,x,y){
        let angle=135*Math.floor(Math.random()*10);
        let diceRollDirection = 1;
        angle=135*Math.floor(Math.random()*10);
        diceElement.style.transform=
        "translateX("+
        x+"vw) translateY("+diceRollDirection*y+
        "vh) rotate(" + angle + "deg)";
      }

function changeDiceFaces(randomDice) {
        for (let i=0; i < diceElements.length;i++) {
          if(rollCount ===1) diceElements[i].classList.add("active");
          if(diceElements[i].classList.contains("active")) {
            playerDice[i]=randomDice[i];
      
            let face = diceElements[i].getElementsByClassName("face")[0];
            face.src="docs/design_system/images/dice"+randomDice[i]+".png";
          }
        }
    }
function resetDiceFaces() {
        for (let i=0;i<diceElements.length;i++){
          let face = diceElements[i].getElementsByClassName("face")[0];
          diceElements[i].classList.remove("active");
          let diceNumber=i+1;
          face.src="docs/design_system/images/dice"+diceNumber+".png";
        }
      }
//Dice Elements'Events listeners
diceElements.forEach(function(diceElement,index){
        diceElement.addEventListener("click",function(){
          if(rollCount==0) return;
          diceElement.classList.toggle("active");
          if(!diceElement.classList.contains("active")){
            diceElement.style.transform="none";      
          }
          else {
            const diceNumber=diceElement.id.charAt(3);
            const x = transformValues[diceNumber-1][0];
            const y = transformValues[diceNumber-1][1];
            changeDiePosition(diceElement,x,y);
      
          }
        })
    })
function writeTempValuesInScoreTable(dice) {
        // For special cases like yahzi, and joker (not sure if it has it)
        console.log("once calculation applied, now the button for rerolling is no longer disabled")
        //A counter should be set for once all score boxes our full, its the end game
        rollButton.disabled = false;
}
// updateScoreForCategory{} for the ones taht only have 1 possible row where the score can be entered

scoreTableCells.forEach(function(cell){
    cell.addEventListener("click",onCellClick);
  });
  function onCellClick(){
    //to be implemented
    // P>S instead of changing turns, since its only 1 player, just set the re-roll button as enabled, after score
    //like rollButton.disabled = false;
  }

function calculateEndGameScore() {
    //to be implemented. you can use: 
    //const endGameMessage= "End of Game. Your core is ---";
    //document.getElementById("endGameMessage").innerHTML=endGameMessage;
}

//bunch of func to claculate scores for each rule