//User input elements
const userInput = {
    btnSubmit: document.querySelector("#btn-submit"),
    numInput: document.querySelector("#multi-num-input"),
};

const timeTable = []

//Creates array of mutiples
function createTimesTable(mutiNumInput, startPos, endPos){
    startPos = startPos -1;
    const numOfPostions = endPos - startPos;
    let mutiNum = mutiNumInput * startPos;

    for(let i = 0; i < numOfPostions; i++){
        mutiNum = mutiNum + mutiNumInput;
        timeTable[i] = mutiNum;
    };
};

createTimesTable(5, 1, 10);