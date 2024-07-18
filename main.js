// Variables to track dice state
/*let playerDice=[]; // i.e the dice player chose to keep
let playerScore=[];
let rollCount=0;
let numFilledRowScore=0;*/
let transformValues= [
    [0, 35], [-5, 45], [0, 40], [5, 45], [0, 35]
  ];

const playerContainer= document.querySelector(".savedDiceDisplay");
const rollButton= document.querySelector(".reroll-button");
const diceElements= document.querySelectorAll(".dice");
const scoreTableCells=document.querySelectorAll(".cell");

function rollDice() {
  fetch('http://localhost:8000/yatzy.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'action=rollDice'
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
})
  .then(data => {
      // Update UI with rolled dice values
      displayDice(data.randomDice, data.rollCount, data.playerDice); // Update displayDice function to handle this
      console.log('Dice rolled:', data.randomDice);
      console.log('Roll count:', data.rollCount);

      // Check roll count from server response to enable/disable roll button
      if (data.rollCount >= 2) {
          rollButton.disabled = true;
          rollButton.removeEventListener('click', rollDice); // Remove event listener
          console.log('No more rolls allowed until score is entered.');
      }
  })
  .catch(error => console.error('Error rolling dice:', error));
}

rollButton.addEventListener('click', function() {
  if (!rollButton.disabled) {
      rollDice(); // Call rollDice function to initiate a dice roll
  }
});

function displayDice(dice, rollCount, playerDice) {
    const playArea= document.querySelector(".DisplayOfRolling");
    const diceContainer = document.querySelector(".savedDiceDisplay"); 
    //let numDice= diceContainer.children.length; 
    diceElements.forEach( function(diceElement, index){
        if (diceElement.classList.contains("active") || rollCount ==1){ 
            resetDicePositions(); // cuz only 2 rolls allowed 
            const x = transformValues[index][0];// back to intial positions 
            const y = transformValues[index][1];

            setTimeout(function(){
                changeDiePosition(diceElement, x, y);
                changeDiceFaces(dice, rollCount, playerDice);
                
                writeTempValuesInScoreTable(playerDice);

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

function changeDiceFaces(randomDice, rollCount, playerDice) {
        for (let i=0; i < diceElements.length;i++) {
          if(rollCount ===1) diceElements[i].classList.add("active");// no more rolls alllowed, all should be active, could return em back to position here
          if(diceElements[i].classList.contains("active")) {
            playerDice[i]=randomDice[i];  
            let face = diceElements[i].getElementsByClassName("face")[0];
            face.src="docs/design_system/images/dice"+randomDice[i]+".png";
          }
        }
        updatePlayerDice(playerDice);
    }

    function updatePlayerDice(playerDice) {
      fetch('http://localhost:8000/yatzy.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'action=updatePlayerDice&randomDice=' + JSON.stringify(playerDice)
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          
          console.log('Player dice updated on server:', data.playerDice);
      })
      .catch(error => console.error('Error updating player dice:', error));
  }


function resetDiceFaces() {
        for (let i=0;i<diceElements.length;i++){
          let face = diceElements[i].getElementsByClassName("face")[0];
          diceElements[i].classList.remove("active");
          let diceNumber=i+1;
          face.src="docs/design_system/images/dice"+diceNumber+".png";
        }
      }

function fetchRollCount() {
        fetch('http://localhost:8000/yatzy.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'action=getRollCount'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); 
        })
        .then(data => {
            const rollCount = parseInt(data); // Parse the response as an integer
            console.log('Current roll count:', rollCount);
        })
        .catch(error => console.error('Error fetching roll count:', error));
      }

//Dice Elements'Events listeners
diceElements.forEach(function(diceElement,index){
        diceElement.addEventListener("click",function(){
          if(fetchRollCount()==0) return; 
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
/*function writeTempValuesInScoreTable(dice) {
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

}*/
function writeTempValuesInScoreTable() {
  fetch('http://localhost:8000/yatzy.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded', // Adjusted to form-urlencoded
    },
    body: 'action=calculateScores', // No need to send dice data anymore
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text(); // Expecting HTML/text response
    })
    .then(htmlResponse => {

      //console.log('HTML Response:', htmlResponse);
      const response = JSON.parse(htmlResponse);
    
      Object.keys(response).forEach(category => {
        const element = document.getElementById(category);
        if (element) {
          element.innerHTML = response[category];
        }
      });

      //console.log('Score table updated on client');
    })
    .catch(error => console.error('Error updating score table:', error));
}


scoreTableCells.forEach(function(cell){
    cell.addEventListener("click",onCellClick);
  });
  function onCellClick(){
    const id = this.getAttribute("id");
    const yatzyScore = parseInt(document.getElementById("yatzy").innerHTML);

    if( fetchRollCount()==0 || id===null ) return; 

    //playerScore[row-1]=parseInt(this.innerHTML);
    fetch('http://localhost:8000/yatzy.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
      },
      
      body: new URLSearchParams({
        action: 'enterScore', 
        id: id,
        score: this.innerHTML, // Send updated player scores to PHP
        yatzy: yatzyScore
      }).toString()
    
  })
    //.then(response => response.json())
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json(); 
    })
    .then(data => {
      console.log('JSON Response:', data);
        Sum1.innerHTML = data.upperSectionScore;
        bonus1.innerHTML = data.bonusScore;
        //total1.innerHTML = data.totalScore;
        console.log("this is total", data.totalScore);

        this.removeEventListener("click",onCellClick);
        this.style.color="green";
        this.style.cursor= "default";
        Sum1.style.color="green";
        bonus1.style.color="green";
        //total1.style.color="green";

        // Enable roll button for next turn
        rollButton.disabled = false;
        rollButton.style.opacity = 1; 

        updateScoreTable(data.gameState.playerScore);
        resetDiceFaces();
        if(data.gameState.numFilledRowScore==15)  {
          calculateEndGameScore();
          //console.log("print end");
          return;
        }


    })
    .catch(error => {
        console.error('Error:', error);
    });
  }

function calculateEndGameScore() { 
    /*let playerTotal=parseInt(document.getElementById("total1").innerHTML);//12.1 does totalproper
    const endGameMessage= "End of Game. Your total score is" + playerTotal;*/
    endGameMessage= "End of Game Round. You can play another round after closing this window! \n Your total score for this round was: ";
    resetDicePositions();
    
    // Display modal with end game message
    const modal = document.getElementById("endGameModal");
    const messageElement = document.getElementById("endGameMessage");
    const closeModal = document.getElementById("closeModal");

    // Fetch leaderboard data
    fetch('http://localhost:8000/yatzy.php?action=getLeaderboard')// get request 
        .then(response => response.json())
        .then(data => {
            endGameMessage+= data.total;
            // Construct leaderboard message
            let leaderboardMessage = "<h3>Leaderboard -- Top Scores:</h3><ul>";
            data.top_scores.forEach((score, index) => {
                leaderboardMessage += `<li>#${index + 1}: ${score}</li>`;
            });
            leaderboardMessage += "</ul>";

            // Set end game message and leaderboard in modal
            messageElement.innerHTML = endGameMessage + leaderboardMessage;
            modal.style.display = "block";
        })
        .catch(error => {
            console.error('Error fetching leaderboard:', error);
            // Fallback message if fetch fails
            messageElement.textContent = endGameMessage + " (Leaderboard data could not be retrieved)";
            modal.style.display = "block";
        });
  
    // Close modal when close button is clicked
    closeModal.addEventListener("click", function() {
      modal.style.display = "none";
    });
    updateScoringTable();

}

function updateScoreTable(playerScore) {
  //console.log(playerScore);
  // Convert playerScore object to an array of objects for easier iteration
  let scoreTable = Object.keys(playerScore).map(key => {
      return { category: key, score: playerScore[key] };
  });
  console.log("score table after player score copy?",scoreTable);
  // Clear all score cells initially
  let scoreCells = document.querySelectorAll('[data-column="1"]');
  scoreCells.forEach(cell => {
      let category = cell.getAttribute('id');
      let scoreObj = scoreTable.find(item => item.category === category);
      //console.log("score obj found?", scoreObj);
      if (scoreObj) {
          cell.innerHTML = scoreObj.score; // Update cell with score
      } else {
          cell.innerHTML = ''; // Clear cell if category score is not defined
      }
  });
}

function updateScoringTable() {
  
  // Clear all score cells initially
  let scoreCells = document.querySelectorAll('[data-column="1"]');
  scoreCells.forEach(cell => {
      cell.innerHTML = ''; 
      cell.style.color="white";
      cell.style.cursor = 'pointer';
      // Restore event listener for the new round.
      cell.addEventListener('click', onCellClick); 
      
  });
  Sum1.style.color="white";
  bonus1.style.color="white";
  total1.style.color="white";
  Sum1.innerHTML = '';
  bonus1.innerHTML = '';
  total1.innerHTML = '';
}