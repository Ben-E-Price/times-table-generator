//User input elements
const userInput = {
    btnSubmit: document.querySelector("#btn-submit"),
    numInput: document.querySelector("#in-multi-num"),
    startInput: document.querySelector("#in-pos-start"),
    endInput: document.querySelector("#in-pos-end"),
};

const numberInputs = [38,5,4564];

//Creates an array of mutiplication tables
function createTimesTable(numberInputs, startPos, endPos){
    startPos = startPos -1;
    const numOfPostions = endPos - startPos;
    let timeTable = [];
    
    //Creates multiples of multiplyNum value 
    function multiplyNumbers(multiplyNum, numOfPostions){
        let singleTimeTable = [];
        let positionNum = multiplyNum;

        for(let i = 0; i < numOfPostions; i++){
            singleTimeTable[i] = positionNum;
            positionNum = positionNum + multiplyNum
        };

        return singleTimeTable;
    };

    //Inserts individual number mutiplication tables into timeTable - Runs for each input
    for(const num in numberInputs){
        let multiNum = numberInputs[num];
        timeTable[num] = multiplyNumbers(multiNum, numOfPostions); 
    };

    return timeTable;
};

const timeTable = createTimesTable(numberInputs, 1, 10);
console.log(timeTable)