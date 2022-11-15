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
        btnResetCols: document.querySelector("#btn-reset-table"),
        inNumOfCols: document.querySelector("#in-num-of-cols"),
    },
    
    inMultiNumCont: document.getElementsByClassName("multi-num-cont"),
    inMultiNumRoot: document.querySelector("#multi-num-in-wrapper"),
    tableBody: document.querySelector("#table-body"),
    columnRoot: document.getElementsByClassName("column-root"),

    //Creates column
    createColumn: function(){
        const length = this.columnRoot.length
        const colLimit = 10;

        //Creates table column elements
        const createTalbeElement = () => {
            const cloneColumn = this.columnRoot[1].cloneNode(true);
            this.tableBody.appendChild(cloneColumn);
        };

        //Creates multiplication input elements
        const createInputElements = () => {
            const cloneInMultiNum = this.inMultiNumCont[0].cloneNode(true);
            cloneInMultiNum.addEventListener("keydown", inputBlock);
            this.inMultiNumRoot.appendChild(cloneInMultiNum);
        };

        //Limits the number of columns that can be created
        if(length <= colLimit){
            createTalbeElement();
            createInputElements();
        };

    },

    //Creates x number of colums
    createMultiCols: function(){
        const numOfCols = Number(this.inputs.inNumOfCols.value);

        for(let i = 0; i < numOfCols; i ++){
           this.createColumn();
        };
    },

    //Removes columns - Prevents intial 2 being removed
    removeColumn: function(){
        const numOfCols = this.columnRoot.length;
        
        if(numOfCols > 2){
            this.columnRoot[numOfCols -1].remove()
            this.inMultiNumCont[this.inMultiNumCont.length-1].remove();
        };
    },

    //Removes x number of columns
    resetTable: function(){
        for(const col in this.columnRoot){
            this.removeColumn();
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

//Calculates row content - Adds rows to UI
function calculateRows(){

    //Retrieves user inputs - Returns as an array
    function getMultiNumInputs(){
        const inputFields = document.querySelectorAll(".in-multi-num");
        const numberInputs = [];

        for(const input in inputFields){
            numberInputs[input] = inputFields[input].value;
        };

        return numberInputs
    };

    //Creates an array of mutiplication tables
    function createTimesTable(numberInputs, startPos, endPos){
        startPos = startPos -1;
        const numOfPostions = endPos - startPos;
        let timeTable = [];
        
        //Creates multiples of multiplyNum value 
        function multiplyNumbers(multiplyNum, numOfPostions){
            let singleTimeTable = [];
            let positionValue = multiplyNum;

            for(let i = 0; i < numOfPostions; i++){
                singleTimeTable[i] = positionValue;
                positionValue = positionValue + multiplyNum
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
};

//Click Events
table.inputs.btnAdd.addEventListener("click", function(){table.createColumn()});
table.inputs.btnRemove.addEventListener("click", function(){table.removeColumn()});
table.inputs.btnCreateCols.addEventListener("click", function(){table.createMultiCols()});
table.inputs.btnResetCols.addEventListener("click", function(){table.resetTable()});

//Input Blocking   
for(const input of inputElements){
    input.addEventListener("keydown", inputBlock);
}