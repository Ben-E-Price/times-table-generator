const numberInputs = [5, 10, 15];

//User input elements
const userInput = {
    btnSubmit: document.querySelector("#btn-submit"),
    numInput: document.querySelector("#in-multi-num"),
    startInput: document.querySelector("#in-pos-start"),
    endInput: document.querySelector("#in-pos-end"),
};

//Table elements + functionality
const table = {
    btnAdd: document.querySelector("#btn-add-col"),
    btnRemove: document.querySelector("#btn-remove-col"),
    tableBody: document.querySelector("#table-body"),
    // columnRoot: document.querySelectorAll(".column-root"),
    columnRoot: document.getElementsByClassName("column-root"),

    //Creates column
    createColumn: function(){
        const length = this.columnRoot.length
        const cloneColumn = this.columnRoot[1].cloneNode(true);
        this.tableBody.appendChild(cloneColumn);
    },

    //Removes columns - Prevents intial 2 being removed
    removeColumn: function(){
        const numOfCols = this.columnRoot.length;
        if(numOfCols > 2){
            this.columnRoot[numOfCols -1].remove()
        };
    },
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
console.log(timeTable, table.columnRoot)

//Click Events
table.btnAdd.addEventListener("click", function(){table.createColumn()});
table.btnRemove.addEventListener("click", function(){table.removeColumn()});