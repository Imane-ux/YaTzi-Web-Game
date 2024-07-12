// Variables to track dice state
let playerDice=[]; // i.e the dice player chose to keep
let playerScore=[];
let rollCount=0;
let numFilledRowScore=0;
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
            rollButton.removeEventListener('click', rollDice); //12.1
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
    const diceContainer = document.querySelector(".savedDiceDisplay"); //container
    //diceContainer.innerHTML = ""; // Clear previous dice
    let numDice= diceContainer.children.length; //num of childs kept
    //12.2 counter
    diceElements.forEach( function(diceElement, index){
        if (diceElement.classList.contains("active") || rollCount ==1){ //12.2
            resetDicePositions(); // cuz only 2 rolls allowed //12.3
            const x = transformValues[index][0];// back to intial positions
            const y = transformValues[index][1];

            setTimeout(function(){
                changeDiePosition(diceElement, x, y);
                changeDiceFaces(dice);
                writeTempValuesInScoreTable(playerDice); //added m

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
          if(rollCount==0) return; //12.4
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
        let scoreTable= [];
        scoreTable= playerScore.slice();
        //onlyPossibleRow="blank";
        let yatzyScore= calculateYatzy(dice);
        const yatziElement= document.getElementById("yatzy"); //12.5 not n use
       
        if (scoreTable[0] === undefined) {
            let onesScore = calculateOnes(dice);
            console.log("ones", onesScore);
            document.getElementById("Ones").innerHTML = onesScore;
          }
          if (scoreTable[1] === undefined) {
            let twosScore = calculateTwos(dice);
            document.getElementById("Twos").innerHTML = twosScore;
          }
          if (scoreTable[2] === undefined) {
            let threesScore = calculateThrees(dice);
            document.getElementById("Threes").innerHTML = threesScore;
          }
          if (scoreTable[3] === undefined) {
            let foursScore = calculateFours(dice);
            document.getElementById("Fours").innerHTML = foursScore;
          }
          if (scoreTable[4] === undefined) {
            let fivesScore = calculateFives(dice);
            document.getElementById("Fives").innerHTML = fivesScore;
          }
          if (scoreTable[5] === undefined) {
            let sixesScore = calculateSixes(dice);
            document.getElementById("Sixes").innerHTML = sixesScore;
          }

        // Implement logic for Lower Section categories //12; skipped 6? yes cuz sum? no no need 
        if (scoreTable[6] === undefined) {
          //console.log("got in?");
          //console.log("table", scoreTable);
            scoreTable[6] = calculateOnePair(dice);
            document.getElementById("OnePair").innerHTML = scoreTable[6];
        }
        if (scoreTable[7] === undefined) {
            scoreTable[7] = calculateTwoPair(dice);
            document.getElementById("TwoPair").innerHTML = scoreTable[7];
        }
        if (scoreTable[8] === undefined) {
            scoreTable[8] = calculateThreeOfAKind(dice);
            //console.log("3ofK", calculateThreeOfAKind(dice));
            document.getElementById("ThreeOfKind").innerHTML = scoreTable[8];
        }
        if (scoreTable[9] === undefined) {
            scoreTable[9] = calculateFourOfAKind(dice);
            document.getElementById("FourOfKind").innerHTML = scoreTable[9];
        }
        if (scoreTable[10] === undefined) {
            scoreTable[10] = calculateSmallStraight(dice);
            document.getElementById("smallStraight").innerHTML = scoreTable[10];
        }
        if (scoreTable[11] === undefined) {
            scoreTable[11] = calculateLargeStraight(dice);
            document.getElementById("LargeStraight").innerHTML = scoreTable[11];
        }
        if (scoreTable[12] === undefined) {
            scoreTable[12] = calculateFullHouse(dice);
            document.getElementById("FullHouse").innerHTML = scoreTable[12];
            
        }
        if (scoreTable[13] === undefined) {
            scoreTable[13] = calculateChance(dice);
            document.getElementById("chance").innerHTML = scoreTable[13];
            
        }
        if (scoreTable[14] === undefined) {
            scoreTable[14] = yatzyScore; // Assign Yatzy score directly here
            document.getElementById("yatzy").innerHTML = scoreTable[14];
        }
        console.log(scoreTable);
        // Update playerScore with the calculated scores
        //playerScore = scoreTable; //change 12

        // Update UI or any other logic based on scoring
        //console.log("Scores updated:", playerScore);
        // can disable button gere as welll.
        ////12.1

}
// updateScoreForCategory{} for the ones taht only have 1 possible row where the score can be entered

scoreTableCells.forEach(function(cell){
    cell.addEventListener("click",onCellClick);
  });
  function onCellClick(){
    const row = this.getAttribute("data-row");
    const column = this.getAttribute("data-column");
    if( rollCount==0 || row===null ) return; //12.1 

    playerScore[row-1]=parseInt(this.innerHTML);

    // is this just to diaplay possible options i think so . //12.1
    let upperSectionScore1=calculateUpperSection(playerScore);
    let bonusScore1=upperSectionScore1>63 ? 35 : 0;// check this 
    let lowerSectionScore1=calculateLowerSectionScore(playerScore);
    //console.log("this is LS", lowerSectionScore1);
    let totalScore1= upperSectionScore1+lowerSectionScore1+bonusScore1;
    //console.log("this is bonuS", bonusScore1);
    console.log("this is total", totalScore1);
    Sum1.innerHTML=upperSectionScore1;
    bonus1.innerHTML=bonusScore1;
    total1.innerHTML= totalScore1;
    console.log("1st", document.getElementById("total1").innerHTML);
    //document.getElementById("total").innerHTML= totalScore1;
    this.removeEventListener("click",onCellClick);
    //console.log(` shoudl add code to display i guess, Score selected for row ${row}, column ${column}:`, playerScore);
    this.style.color="green";
    this.style.cursor= "default";
    Sum1.style.color="green";
    bonus1.style.color="green";
    total1.style.color="green";


    numFilledRowScore++;
    console.log(numFilledRowScore);


    // Enable roll button for next turn
    rollButton.disabled = false;
    //console.log("btn disablesnow.");
    rollButton.style.opacity = 1; 
    rollCount=0;
    //update Table all gone.
    updateScoreTable();
    resetDiceFaces();
    if(numFilledRowScore==15)  {
        calculateEndGameScore();
        window.prompt("the end, your score is : XO")
        console.log("print end");
        return;
      }
  }

function calculateEndGameScore() {
    //to be implemented. you can use: 
    let playerTotal=parseInt(document.getElementById("total1").innerHTML);//12.1 does totalproper
    const endGameMessage= "End of Game. Your total score is" + playerTotal;
    resetDicePositions();
    document.getElementById("endGameMessage").innerHTML=endGameMessage;
    rollButton.disabled=true;
    rollButton.style.opacity=0.5;
}

//bunch of func to claculate scores for each rule
function calculateOnes(dice) {
    let score=0;
    for (let i=0;i<dice.length;i++){
      if(dice[i]===1) {
        score+=1;
      }
    }
    return score;
  }
  function calculateTwos(dice) {
    let score=0;
    for (let i=0;i<dice.length;i++){
      if(dice[i]===2) {
        score+=2;
      }
    }
    return score;
  }
  function calculateThrees(dice) {
    let score=0;
    for (let i=0;i<dice.length;i++){
      if(dice[i]===3) {
        score+=3;
      }
    }
    return score;
  }
  function calculateFours(dice) {
    let score=0;
    for (let i=0;i<dice.length;i++){
      if(dice[i]===4) {
        score+=4;
      }
    }
    return score;
  }
  function calculateFives(dice) {
    let score=0;
    for (let i=0;i<dice.length;i++){
      if(dice[i]===5) {
        score+=5;
      }
    }
    return score;
  }
  function calculateSixes(dice) {
    let score=0;
    for (let i=0;i<dice.length;i++){
      if(dice[i]===6) {
        score+=6;
      }
    }
    return score;
  }
  function calculateChance(dice) {
    let score=0;
    for (let i=0;i<dice.length;i++){ 
        score+=dice[i];
    }
    return score;
  }
function calculateYatzy(dice) {
    let firstDie=dice[0];
    let score=50;
    for (let i=0;i<dice.length;i++){
      if(dice[i]!==firstDie) {
        score=0;
      }
    }
    return score;
  }

function calculateOnePair(dice) {
    console.log("in 1 pair",dice);
    let pairs = [];
    let score = 0;
    for (let i = 0; i < dice.length; i++) {
        let count = 1;
        for (let j = 0; j < dice.length; j++) {
            if (j !== i && dice[i] === dice[j]) {
                count++;
            }
        }
        if (count >= 2 && !pairs.includes(dice[i])) {
            pairs.push(dice[i]);
            score = Math.max(score, dice[i] * 2); // Take the highest pair
        }
    }
    return score;
  }
  
  function calculateTwoPair(dice) {
    let pairs = [];
    let score = 0;
    for (let i = 0; i < dice.length; i++) {
        let count = 1;
        for (let j = 0; j < dice.length; j++) {
            if (j !== i && dice[i] === dice[j]) {
                count++;
            }
        }
        if (count >= 2 && !pairs.includes(dice[i])) {
            pairs.push(dice[i]);
        }
    }
    if (pairs.length >= 2) {
        score = pairs.reduce((acc, val) => acc + val * 2, 0); // Sum of both pairs
    }
    return score;
  }
  
  
  function calculateThreeOfAKind(dice) {
    let score=0;
    for(let i=0;i<dice.length;i++){
      let count=1;
      for(let j=0;j<dice.length;j++) {
        if(j!==i && dice[i]===dice[j]){
          count++;
        }
      }
      if(count>=3) {
        score=dice.reduce((acc,val)=>acc+val);
        break;
      }
    }
    return score;
  }
  function calculateFourOfAKind(dice) {
    let score=0;
    for(let i=0;i<dice.length;i++){
      let count=1;
      for(let j=0;j<dice.length;j++) {
        if(j!==i && dice[i]===dice[j]){
          count++;
        }
      }
      if(count>=4) {
        score=dice.reduce((acc,val)=>acc+val);
        break;
      }
    }
    return score;
  }
  
  
  function calculateFullHouse(dice) {
    let score=0;
    let diceCopy=dice.slice();
    diceCopy.sort();
    if(
      (diceCopy[0]==diceCopy[1] &&
        diceCopy[1]==diceCopy[2] &&
        diceCopy[3]==diceCopy[4]   
        ) ||
          (diceCopy[0]==diceCopy[1] &&
            diceCopy[2]==diceCopy[3] &&
            diceCopy[3]==diceCopy[4]   
            )     
    ) {
      score=25;
      return score;
    }
    return score;
  }
  
  function calculateSmallStraight(dice) {
    let score=0;
    let diceCopy=[...new Set(dice)];
    diceCopy.sort();
    if(
      (diceCopy[1]==diceCopy[0]+1 &&
        diceCopy[2]==diceCopy[1]+1 &&
        diceCopy[3]==diceCopy[2] +1  
        ) ||
          (diceCopy[2]==diceCopy[1]+1 &&
            diceCopy[3]==diceCopy[2]+1 &&
            diceCopy[4]==diceCopy[3] +1  
            )     
    ) {
      score=30;
    }
    return score;
  }
  function calculateLargeStraight(dice) {
    let score=0;
    let diceCopy=[...new Set(dice)];
    diceCopy.sort();
    if(
      (diceCopy[1]==diceCopy[0]+1 &&
        diceCopy[2]==diceCopy[1]+1 &&
        diceCopy[3]==diceCopy[2] +1 &&
        diceCopy[4]==diceCopy[3] +1
        )  
    ) {
      score=40;
    }
    return score;
  }
  function calculateUpperSection(playerScore){ ////12.1
    let score=0;
    let ones=playerScore[0]==undefined ? 0 : playerScore[0];
    let twos=playerScore[1]==undefined ? 0 : playerScore[1];
    let threes=playerScore[2]==undefined ? 0 : playerScore[2];
    let fours=playerScore[3]==undefined ? 0 : playerScore[3];
    let fives=playerScore[4]==undefined ? 0 : playerScore[4];
    let sixes=playerScore[5]==undefined ? 0 : playerScore[5];
    score=ones+twos+threes+fours+fives+sixes;
    return score;
  }
  function calculateLowerSectionScore(playerScore){ ////12.1
    let lowerSectionScore=0;
    let onePair= playerScore[6]===undefined ? 0 : playerScore[6];
    let twoPair=playerScore[7]===undefined ? 0 : playerScore[7];
    let threeofKind= playerScore[8]===undefined ? 0 : playerScore[8];
    let fourOfAKind=playerScore[9]===undefined ? 0 : playerScore[9];
    let smallStraight=playerScore[10]===undefined ? 0 : playerScore[10];
    let largeStraight=playerScore[11]===undefined ? 0 : playerScore[11];
    let fullHouse=playerScore[12]===undefined ? 0 : playerScore[12];
    let chance=playerScore[13]===undefined ? 0 : playerScore[13];
    let yatzy=playerScore[14]===undefined ? 0 : playerScore[14];
    

    if(yatzy>0) {
      yatzy=parseInt(document.getElementById("yatzy").innerHTML);
    }
    lowerSectionScore= onePair+ twoPair+ threeofKind+ fourOfAKind+fullHouse+smallStraight+largeStraight
    + chance+yatzy;
    return lowerSectionScore;
  }
  
  function updateScoreTable(){//12.1
    let scoreTable=[];
    scoreTable=playerScore.slice();
    let scoreCells=document.querySelectorAll('[data-column="1"]');
    for (let i=0;i<scoreCells.length;i++) {
      if(scoreTable[i]===undefined) {
        scoreCells[i].innerHTML="";
      }
    }
  }
  