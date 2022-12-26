`use strict`;
const inputBlocking = {
    //Stores elements requiring blocking
    inputs: [
        {
            element: document.getElementsByClassName("num-input"),
            eventType: "keydown"
        },

        {
            element: document.getElementsByClassName("btn-clk-blk"),
            eventType: "click"
        },  
    ],

    tableCreated: false,

    //Prevents elements functionality executing
    block: function(eventIn) {
        const eventType = eventIn.type;

        //Checks + blocks ilegal chars on keydown events
        function charBlock(eventIn){
            //Legal charecters
            const validChars = RegExp(["[0-9]"]);

            //Applys error styling
            function errorStyle(eventIn){
                const element = eventIn.target;
                error.timedClass(element, 0.5);
            };

            if(validChars.test(eventIn.key) || eventIn.ctrlKey || eventIn.altKey || eventIn.key.length !== 1){
                return        
            } else {
                eventIn.preventDefault();
                errorStyle(eventIn);
            };
        };



        if(eventType === "keydown"){
           charBlock(eventIn);
        };
        
        //Blocks button inputs once a table is created
        if(eventType === "click" && this.tableCreated) {
            eventIn.stopImmediatePropagation()
        };

    },
    

    addEvent: function(element, eventType){
        element.addEventListener(eventType, (event) => {
            this.block(event);
        });
    },
};

//User input elements
const calcInputs = {
    btnCalc: document.querySelector("#btn-calc"),
    numInput: document.querySelector("#in-multi-num"),
    startInput: document.querySelector("#in-pos-start"),
    endInput: document.querySelector("#in-pos-end"),

    getPostInputs: function(){ 
     return new Map().set("startInput", Number(this.startInput.value))
     .set("endInput", Number(this.endInput.value));
    },
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

    colHeader: {
        //Creates keypair containing the current columns header
        getColHeader: function(col){
            this.currentHead = col.firstElementChild
        },

        //Set header on inital column creation
        setInitalCreation: function(currentCol, num){
           this.getColHeader(currentCol);
           this.currentHead.textContent = `Column ${num}`;
        },

        //Set headers on table calcualtion/row creation
        setMultiValue: function(currentCol, num){
            this.getColHeader(currentCol);
            this.currentHead.textContent = `${num}`;
        },
    },

    colLimit: 10,

    //Creates column
    createColumn: function(){
        const length = this.columnRoot.length;
        const colLimit = this.colLimit;

        //Creates table column elements
        const createTalbeElement = (event) => {
            const cloneColumn = this.columnRoot[1].cloneNode(true);
            this.colHeader.setInitalCreation(cloneColumn, length);
            this.tableBody.appendChild(cloneColumn);
        };

        //Creates multiplication input elements
        const createInputElements = () => {
            const cloneInMultiNum = this.inMultiNumCont[0].cloneNode(true);
            cloneInMultiNum.addEventListener("keydown", function(event){inputBlocking.block(event)});
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

        //Blocks/Allows column creation dependent on "colNumInput" 
        function validColNumCheck(colNumInput, colLimit) {
            colLimit -= table.columnRoot.length -1; //Accounts for current number of columns

            return colNumInput > colLimit ? false : true;
        };

        //Creates columns if "numOfCols" < colLimit
        if(validColNumCheck(numOfCols, this.colLimit)) {
            for(let i = 0; i < numOfCols; i ++){
               this.createColumn();
            };
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

    //Remove all rows
    removeRows: function(){
        const rowElements = document.getElementsByTagName("td");
        
        //Removes all rows - Starts at last row element
        for(let i = rowElements.length - 1; i >= 0; i--){
            rowElements[i].remove();
        };
    },

    //Removes x number of columns
    resetTable: function(){
        this.removeRows();

        for(const col in this.columnRoot){
            this.removeColumn();
        };

        inputBlocking.tableCreated = false; //Re-enables button click events
        this.colHeader.setInitalCreation(this.columnRoot[1], 1);// Resets column header value
    },

};

const error = {
    errorClass: "in-error",

    addClass: function(element) {
        element.classList.add(this.errorClass);
    },

    removeClass: function(element){
        element.classList.remove(this.errorClass);
    },

    //Adds - removes class on timer
    timedClass: function(element, removeTime) {
        removeTime = removeTime * 1000;
        
        this.addClass(element);
        const timer = setTimeout(this.removeClass(element), removeTime);
    },

    //Required feilds check

    //Column creation number
};

//Calculates row content - Adds rows to UI
function calcRows(){
    let startPos = 0;
    let endPos = 0;

    //Retrieves user inputs - Returns as an array
    function getMultiNumInputs(){
        const inputFields = document.querySelectorAll(".in-multi-num");
        const numberInputs = [];

        inputFields.forEach(function(event, index){
            numberInputs[index] = Number(inputFields[index].value)
        });

        return numberInputs
    };

    //Calcualtes the number of mutiplication positions
    function calcNumOfPost(inputMap){
        startPos = inputMap.get("startInput");
        endPos = inputMap.get("endInput"); 

        //Error Check inverts values - 
        //If endPos < startPos, values are inverted ensures number of positions created is correct
        if (endPos < startPos){
            const tempStart = startPos;
            startPos = endPos;
            endPos = tempStart;
        };
        
        return startPos <= 1? endPos: endPos - startPos +1;
    };

    //Creates an array of mutiplication tables
    function createTimesTable(numberInputs, numOfPost){
        let timeTable = [];
        
        //Creates multiples of multiplyNum value 
        function multiplyNumbers(multiplyNum, numOfPost){
            let singleTimeTable = [];
            let positionValue = multiplyNum * startPos;

            for(let i = 0; i < numOfPost; i++){
                singleTimeTable[i] = positionValue;
                positionValue = positionValue + multiplyNum
            };

            return singleTimeTable;
        };

        //Inserts individual number mutiplication tables into timeTable - Runs for each input
        for(const num in numberInputs){  
            let multiNum = numberInputs[num];
            timeTable[num] = multiplyNumbers(multiNum, numOfPost); 
        };

        return timeTable;
    };

    //Generates the required number of rows, appending to columns
    function generateRows(numOfPost, timeTable) {

        //Creates a new row td element - Adds class + sets text content
        function createRow(currentValue){
            const newRow = document.createElement("td");
            newRow.classList.add("row");
            newRow.textContent = currentValue;
            return newRow
        };

        //Executes on each columns
        for(let i = 0; i < table.columnRoot.length; i++){
            const currentColumn = table.columnRoot[i];
            const currentTable = timeTable[i - 1];
            
            //Account for fisrt column
            if(currentColumn.id === "pos-col"){
                for(let i = 0; i < numOfPost; i++){
                    currentColumn.appendChild(createRow(startPos + i));
                };
            } else {
                //Set header to mutiplication value
                table.colHeader.setMultiValue(currentColumn, numInputs[i - 1]);

                // Executes for each required row
                for(let i = 0; i < numOfPost; i++){
                    currentColumn.appendChild(createRow(currentTable[i]));
                };
            };
        };
    };

    
    const numOfPost = calcNumOfPost(calcInputs.getPostInputs());
    const numInputs = getMultiNumInputs();

    generateRows(numOfPost, createTimesTable(numInputs, numOfPost));
    inputClear();
    inputBlocking.tableCreated = true;
};

//Clear value content from all inputs
function inputClear() {
    const inputs = document.getElementsByClassName("num-input");

    for(const input of inputs){
        input.value = "";
    };
};

//Input Blocking - Must be declared before other events due to "event.stopImmediatePropagation"
for(const object of inputBlocking.inputs){
    const currentType = object.eventType;

    for(const element of object.element){
        inputBlocking.addEvent(element, currentType);
    };
};

//Click Events
table.inputs.btnAdd.addEventListener("click", function(){table.createColumn()});
table.inputs.btnRemove.addEventListener("click", function(){table.removeColumn()});
table.inputs.btnCreateCols.addEventListener("click", function(){table.createMultiCols()});
table.inputs.btnResetCols.addEventListener("click", function(){table.resetTable()});

calcInputs.btnCalc.addEventListener("click", calcRows);