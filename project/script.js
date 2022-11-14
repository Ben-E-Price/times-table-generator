const numberInputs = [5, 10, 15];
const inputElements = document.getElementsByClassName("num-input"); //Input feilds used to enter numbers

//User input elements
const calcInputs = {
    btnCalc: document.querySelector("#btn-calc"),
    numInput: document.querySelector("#in-multi-num"),
    startInput: document.querySelector("#in-pos-start"),
    endInput: document.querySelector("#in-pos-end"),
};

//Table elements + functionality
const table = {

    //Input elements regarding table creation
    inputs: {
        btnAdd: document.querySelector("#btn-add-col"),
        btnRemove: document.querySelector("#btn-remove-col"),
        btnCreateCols: document.querySelector("#btn-create-cols"),
        inNumOfCols: document.querySelector("#in-num-of-cols"),
    },
    
    inMultiNum: document.getElementsByClassName("multi-num-cont"),
    inMultiNumRoot: document.querySelector("#multi-num-in-wrapper"),
    tableBody: document.querySelector("#table-body"),
    columnRoot: document.getElementsByClassName("column-root"),

    //Creates column
    createColumn: function(){
        const length = this.columnRoot.length
        const cloneColumn = this.columnRoot[1].cloneNode(true);
        const cloneInMultiNum = this.inMultiNum[0].cloneNode(true);

        this.tableBody.appendChild(cloneColumn);
        this.inMultiNumRoot.appendChild(cloneInMultiNum);
    },

    //Removes columns - Prevents intial 2 being removed
    removeColumn: function(){
        const numOfCols = this.columnRoot.length;
        
        if(numOfCols > 2){
            this.columnRoot[numOfCols -1].remove()
            this.inMultiNum[this.inMultiNum.length-1].remove();
        };
    },

    //Creates x number of colums
    createMultiCols: function(){
        const numOfCols = Number(this.inputs.inNumOfCols.value);

        for(let i = 0; i < numOfCols; i ++){
           this.createColumn();
        };
    },

};

//Prevents any charecter that is not 0 - 9 being enterd within input fields 
function inputBlock(eventIn) {
    const validChars = RegExp(["[0-9]"]);

    if(validChars.test(eventIn.key) || eventIn.ctrlKey || eventIn.altKey || eventIn.key.length !== 1){
        return        
    } else {
        eventIn.preventDefault();
    };
};

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
console.log()

//Click Events
table.inputs.btnAdd.addEventListener("click", function(){table.createColumn()});
table.inputs.btnRemove.addEventListener("click", function(){table.removeColumn()});
table.inputs.btnCreateCols.addEventListener("click", function(){table.createMultiCols()});

//Input Blocking   
for(let i = 0; i < inputElements.length; i++){
    inputElements[i].addEventListener("keydown", inputBlock);
};