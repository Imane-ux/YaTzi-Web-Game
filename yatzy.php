<?php
session_start();
//$_SESSION = array();
// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

// Initialize game state and leaderboard in the session if not already set
if (!isset($_SESSION['game_state'])) {
    $_SESSION['game_state'] = [
        'playerDice' => [],//dice kept by player, i.e active
        'randomDice' => [],
        'playerScore' => [], 
        'rollCount' => 0,
        'numFilledRowScore' => 0,
        'totale'=> 0
    ];
}

if (!isset($_SESSION['leaderboard'])) {
    $_SESSION['leaderboard'] = []; 
}

// API endpoint to roll the dice
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'rollDice') {
    
    $gameState = $_SESSION['game_state'];
    $dice = [];
    for ($i = 0; $i < 5; $i++) {
        $dice[] = rand(1, 6);
    }
    
    $gameState['randomDice'] = $dice;
    $gameState['rollCount']++;
    
    if (isset($_POST['playerDice'])) {
        $playerDice = json_decode($_POST['playerDice'], true); // Decoding JSON string into array
        $gameState['playerDice'] = $playerDice; 
    }

    $_SESSION['game_state'] = $gameState;
    
    echo json_encode($gameState);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'updatePlayerDice') {
    // Update playerDice based on data received from JavaScript
    //$randomDice = $_POST['randomDice']; // Assuming randomDice is sent as an array
    $randomDice = json_decode($_POST['randomDice'], true);
    //error_log('Decoded' . print_r($randomDice , true));

    $gameState = $_SESSION['game_state']; //does this create a new one?
    $gameState['playerDice'] = $randomDice;
    $gameState['rollCount'] = $_SESSION['game_state']['rollCount'];
    
    $_SESSION['game_state'] = $gameState;
    //error_log('Session data1: ' . print_r($_SESSION['game_state'], true));
    
    // Return updated game state as JSON response
    echo json_encode($gameState);
    exit;
}
//GET Request from main.js to fetch rollcount
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'getRollCount') {
    // Return just the rollCount as plain text
    echo $_SESSION['game_state']['rollCount'];
    exit;
}
// API endpoint to calculate and update scores
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'calculateScores') {
    //$dice = json_decode($_POST['dice'], true); //can also fetch them from here and reduce traffic!!
    $dice= $_SESSION['game_state']['playerDice'];
    //error_log('Session data: ' . print_r($_SESSION['game_state'], true));
    
    // Defining all score calculation functions here
    function calculateOnes($dice) {
        $score = 0;
        foreach ($dice as $die) {
            if ($die == 1) {
                $score += 1;
            }
        }
        //error_log('OnesScore: ' . print_r($dice, true));
        return $score;
    }
    function calculateTwos($dice) {
        $score = 0;
        foreach ($dice as $die) {
            if ($die === 2) {
                $score += 2;
            }
        }
        return $score;
    }
    function calculateThrees($dice) {
        $score = 0;
        foreach ($dice as $die) {
            if ($die === 3) {
                $score += 3;
            }
        }
        return $score;
    }
    function calculateFours($dice) {
        $score = 0;
        foreach ($dice as $die) {
            if ($die === 4) {
                $score += 4;
            }
        }
        return $score;
    }
    function calculateFives($dice) {
        $score = 0;
        foreach ($dice as $die) {
            if ($die === 5) {
                $score += 5;
            }
        }
        return $score;
    }
    function calculateSixes($dice) {
        $score = 0;
        foreach ($dice as $die) {
            if ($die === 6) {
                $score += 6;
            }
        }
        return $score;
    }
    function calculateChance($dice) {
        $score = array_sum($dice);
        return $score;
    }
    function calculateYatzy($dice) {
        if (count($dice) == 5) {$firstDie = $dice[0];}
        $score = 50;
        foreach ($dice as $die) {
            if ($die !== $firstDie) {
                $score = 0;
                break;
            }
        }
        return $score;
    }
    function calculateOnePair($dice) {
        $pairs = [];
        $score = 0;
        foreach ($dice as $i => $die) {
            $count = 1;
            foreach ($dice as $j => $otherDie) {
                if ($j !== $i && $die === $otherDie) {
                    $count++;
                }
            }
            if ($count >= 2 && !in_array($die, $pairs)) {
                $pairs[] = $die;
                $score = max($score, $die * 2); // Takes the highest pair
            }
        }
        return $score;
    }
    function calculateTwoPair($dice) {
        $pairs = [];
        $score = 0;
        foreach ($dice as $i => $die) {
            $count = 1;
            foreach ($dice as $j => $otherDie) {
                if ($j !== $i && $die === $otherDie) {
                    $count++;
                }
            }
            if ($count >= 2 && !in_array($die, $pairs)) {
                $pairs[] = $die;
            }
        }
        if (count($pairs) >= 2) {
            $score = array_sum($pairs) * 2; 
        }
        return $score;
    }
    function calculateThreeOfAKind($dice) {
        $score = 0;
        foreach ($dice as $i => $die) {
            $count = 1;
            foreach ($dice as $j => $otherDie) {
                if ($j !== $i && $die === $otherDie) {
                    $count++;
                }
            }
            if ($count >= 3) {
                $score = array_sum($dice);
                break;
            }
        }
        return $score;
    }
    function calculateFourOfAKind($dice) {
        $score = 0;
        foreach ($dice as $i => $die) {
            $count = 1;
            foreach ($dice as $j => $otherDie) {
                if ($j !== $i && $die === $otherDie) {
                    $count++;
                }
            }
            if ($count >= 4) {
                $score = array_sum($dice);
                break;
            }
        }
        return $score;
    }
    function calculateFullHouse($dice) {
        $score = 0;
        if (!is_array($dice)) {
            $diceArray = json_decode($dice, true);

        // Checking if decoding was successful and $diceArray is now an array
            if (!is_array($diceArray)) {
                error_log('Error decoding JSON: ' . $dice);
                return $score;
            }
        } else {
        $diceArray = $dice; // If $dice is already an array, use it directly
        }
    
        $diceCopy = $diceArray;
        sort($diceCopy);
        if (count($diceCopy) == 5) {
            if (($diceCopy[0] === $diceCopy[1] && $diceCopy[1] === $diceCopy[2] && $diceCopy[3] === $diceCopy[4]) ||
                ($diceCopy[0] === $diceCopy[1] && $diceCopy[2] === $diceCopy[3] && $diceCopy[3] === $diceCopy[4])) {
                $score = 25;
            }
        }
        return $score;
    }
    function calculateSmallStraight($dice) {
        $score = 0;
        if (!is_array($dice)) {
            $diceArray = json_decode($dice, true);

            if (!is_array($diceArray)) {
                error_log('Error decoding JSON: ' . $dice);
                return $score; 
            }
        } else {
        $diceArray = $dice; 
        }
    
        $diceCopy = array_unique($diceArray);
        sort($diceCopy);
        if (count($diceCopy) >= 5) {
            if (($diceCopy[1] === $diceCopy[0] + 1 &&
                    $diceCopy[2] === $diceCopy[1] + 1 &&
                    $diceCopy[3] === $diceCopy[2] + 1) ||
                ($diceCopy[2] === $diceCopy[1] + 1 &&
                    $diceCopy[3] === $diceCopy[2] + 1 &&
                    $diceCopy[4] === $diceCopy[3] + 1)) {
                $score = 30;
            }
        }
        return $score;
    }
    
    function calculateLargeStraight($dice) {
        $score = 0;
        if (!is_array($dice)) {
            $diceArray = json_decode($dice, true);

            if (!is_array($diceArray)) {
                error_log('Error decoding JSON: ' . $dice);
                return $score; 
            }
        } else {
        $diceArray = $dice; 
        }
    
        $diceCopy = array_unique($diceArray);
        sort($diceCopy);
        if (count($diceCopy) >= 5) {
            if ($diceCopy[1] === $diceCopy[0] + 1 &&
                $diceCopy[2] === $diceCopy[1] + 1 &&
                $diceCopy[3] === $diceCopy[2] + 1 &&
                $diceCopy[4] === $diceCopy[3] + 1) {
                $score = 40;
            }
        }
        return $score;
    }
    
    $scoreTable = [];

    // here it should first check if there is naything stored in playerSCore.
    $playerScore=  $_SESSION['game_state']['playerScore'];
    if (!empty($playerScore)) {
        foreach ($playerScore as $key => $value) {
            if (!is_null($value)) {
                $scoreTable[$key] = $value;
            }
        }
        //error_log('score table beg: ' . print_r($scoreTable, true));
    }

    // Calculate scores for each category if they are not already defined
    if (!isset($scoreTable['Ones'])) { 
        $scoreTable['Ones'] = calculateOnes($dice);
    }
    if (!isset($scoreTable['Twos'])) {
        $scoreTable['Twos'] = calculateTwos($dice);
    }
    if (!isset($scoreTable['Threes'])) {
        $scoreTable['Threes'] = calculateThrees($dice);
    }
    if (!isset($scoreTable['Fours'])) {
        $scoreTable['Fours'] = calculateFours($dice);
    }
    if (!isset($scoreTable['Fives'])) {
        $scoreTable['Fives'] = calculateFives($dice);
    }
    if (!isset($scoreTable['Sixes'])) {
        $scoreTable['Sixes'] = calculateSixes($dice);
    }
    if (!isset($scoreTable['OnePair'])) {
        $scoreTable['OnePair'] = calculateOnePair($dice);
    }
    if (!isset($scoreTable['TwoPair'])) {
        $scoreTable['TwoPair'] = calculateTwoPair($dice);
    }
    if (!isset($scoreTable['ThreeOfKind'])) {
        $scoreTable['ThreeOfKind'] = calculateThreeOfAKind($dice);
    }
    if (!isset($scoreTable['FourOfKind'])) {
        $scoreTable['FourOfKind'] = calculateFourOfAKind($dice);
    }
    if (!isset($scoreTable['smallStraight'])) {
        $scoreTable['smallStraight'] = calculateSmallStraight($dice);
    }
    if (!isset($scoreTable['LargeStraight'])) {
        $scoreTable['LargeStraight'] = calculateLargeStraight($dice);
    }
    if (!isset($scoreTable['FullHouse'])) {
        $scoreTable['FullHouse'] = calculateFullHouse($dice);
    }
    if (!isset($scoreTable['chance'])) {
        $scoreTable['chance'] = calculateChance($dice);
    }
    if (!isset($scoreTable['yatzy'])) {
        $scoreTable['yatzy'] = calculateYatzy($dice);
    }
    //error_log('score table end: ' . print_r($scoreTable, true));
    
    echo json_encode($scoreTable);
    exit;
}

//API to enter score selected by user
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'enterScore') {
    
    if (isset($_POST['id']) && isset($_POST['score'])) {
        $id = $_POST['id'];
        //error_log('id got ' . print_r($id, true));
        $score = intval($_POST['score']);
        //error_log('score got ' . print_r($score, true));

        $gameState = $_SESSION['game_state'];
        $gameState['playerScore'][$id] = $score;
        //error_log('player score got ' . print_r($gameState['playerScore'][$id], true));
        //error_log('final player score ' . print_r($gameState['playerScore'], true));

        $upperSectionScore = calculateUpperSection($gameState['playerScore']);
        $bonusScore = ($upperSectionScore > 63) ? 35 : 0;
        $lowerSectionScore = calculateLowerSectionScore($gameState['playerScore']);
        $totalScore = $upperSectionScore + $lowerSectionScore + $bonusScore;

        $gameState['numFilledRowScore']++;
        $gameState['rollCount'] = 0;
        $gameState['totale'] = $totalScore;// just added, could get rid of the other no time

        // Update game state
        $_SESSION['game_state'] = $gameState;

        // Prepare response data
        $response = [
            'upperSectionScore' => $upperSectionScore,
            'bonusScore' => $bonusScore,
            'totalScore' => $totalScore,
            'gameState' => $_SESSION['game_state']
            
        ];

        
        echo json_encode($response);
        exit;
    } else {
        
        http_response_code(400); // Bad request
        echo json_encode(['error' => 'Missing or invalid input']);
        exit;
    }
}
// Function to calculate upper section score
function calculateUpperSection($playerScore) {
    $ones = isset($playerScore['Ones']) ? intval($playerScore['Ones']) : 0;
    $twos = isset($playerScore['Twos']) ? intval($playerScore['Twos']) : 0;
    $threes = isset($playerScore['Threes']) ? intval($playerScore['Threes']) : 0;
    $fours = isset($playerScore['Fours']) ? intval($playerScore['Fours']) : 0;
    $fives = isset($playerScore['Fives']) ? intval($playerScore['Fives']) : 0;
    $sixes = isset($playerScore['Sixes']) ? intval($playerScore['Sixes']) : 0;

    $score = $ones + $twos + $threes + $fours + $fives + $sixes;
    return $score;
}

// Function to calculate lower section score
function calculateLowerSectionScore($playerScore) {
    $onePair = isset($playerScore['OnePair']) ? intval($playerScore['OnePair']) : 0;
    $twoPair = isset($playerScore['TwoPair']) ? intval($playerScore['TwoPair']) : 0;
    $threeOfKind = isset($playerScore['ThreeOfKind']) ? intval($playerScore['ThreeOfKind']) : 0;
    $fourOfKind = isset($playerScore['FourOfKind']) ? intval($playerScore['FourOfKind']) : 0;
    $smallStraight = isset($playerScore['smallStraight']) ? intval($playerScore['smallStraight']) : 0;
    $largeStraight = isset($playerScore['LargeStraight']) ? intval($playerScore['LargeStraight']) : 0;
    $fullHouse = isset($playerScore['FullHouse']) ? intval($playerScore['FullHouse']) : 0;
    $chance = isset($playerScore['chance']) ? intval($playerScore['chance']) : 0;
    $yatzy = isset($playerScore['yatzy']) ? intval($playerScore['yatzy']) : 0;

    // If yatzy is greater than 0, fetch it from UI 
    if ($yatzy > 0) {
        $yatzy = intval($_POST['yatzy']); 
    }

    $lowerSectionScore = $onePair + $twoPair + $threeOfKind + $fourOfKind + $smallStraight + $largeStraight
                         + $fullHouse + $chance + $yatzy;

    return $lowerSectionScore;
}
// Function to update top 10 scores
function updateTopScores($newScore) {
    global $_SESSION;
    
    // Add new score if it's higher than any of the current top 10 scores
    $topScores = $_SESSION['leaderboard'];
    $topScores[] = $newScore;
    rsort($topScores); // Sort scores in descending order
    
    // Keep only the top 10 scores
    $_SESSION['leaderboard'] = array_slice($topScores, 0, 10);
    
    // Ensure $_SESSION['top_scores'] has exactly 10 entries
    while (count($_SESSION['leaderboard']) < 10) {
        $_SESSION['leaderboard'][] = null;
    }
}
// API endpoint to fetch the leaderboard
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getLeaderboard') {
    // Return the leaderboard data as JSON response 
    //$response = $_SESSION['leaderboard']; //reviewhow score should be updated
    updateTopScores($_SESSION['game_state']['totale']);
    $total= $_SESSION['game_state']['totale'];
    //$_SESSION['game_state']['rollCount']=0;
    //initialize/clear all fields for next round
    $_SESSION['game_state'] = [
        'playerDice' => [],//dice kept by player, i.e active
        'randomDice' => [],
        'playerScore' => [], //score for all rows?
        'rollCount' => 0,
        'numFilledRowScore' => 0,
        'totale'=> 0
    ];
    //echo json_encode($response);
    echo json_encode(['top_scores' => $_SESSION['leaderboard'], 
                       'total'=> $total ]);
    exit;
}

?>