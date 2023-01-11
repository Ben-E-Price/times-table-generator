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
                error.timedClass(element, 0.25);
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

    currentColumns: function(){
        return this.columnRoot.length
    },

    //Creates limit based on current number of columns already present
    currentLimit : function(){
        return this.colLimit - this.currentColumns() + 1; //Accounts for current number of columns
    },

    //Creates column
    createColumn: function(){
        const length = this.currentColumns();
        const colLimit = this.colLimit;
        const errorString = `Error maximun number of columns created`;

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
        } else {
            this.validColNumCheck(length, errorString);
        };

    },

    //Creates x number of colums
    createMultiCols: function(){
        const numOfColsCreate = Number(this.inputs.inNumOfCols.value);
        const errorString = `Error you may only create ${this.colLimit} columns, Please enter ${this.currentLimit()} or less`

        //Creates columns if "numOfCols" < colLimit
        if(this.validColNumCheck(numOfColsCreate, errorString)) {
            for(let i = 0; i < numOfColsCreate; i ++){
               this.createColumn();
            };
        };
    },

    //Blocks/Allows column creation dependent on "colLimit" 
    validColNumCheck(colNumIn, errorMsg) {
        const colLimit = this.currentLimit();
        
        //Display error message
        function colError(errorMsg) {
            alert(errorMsg);
            return false;
        };

        return colNumIn > colLimit ? colError(errorMsg) : true;
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
        setTimeout(() => this.removeClass(element), removeTime);
    },
};

const stickyElements = {

    tableElements: {
        boundingArea: document.querySelector("#table-wrapper"),
        sticky: document.getElementsByTagName("th"),
        currentPos: 0,
    },

    observer: new IntersectionObserver(function(entries){
        console.log("observer called", entries);

    }, {
        root: document.getElementById("table-wrapper"),
        rootMargin: "-31px",
        threshold: 0.1,
    }),

    stick: function(stickyObject) {
        console.log(stickyObject)
        
        //Returns Y position coordinates of passed element
        function getYPos(element) {
            return element.getBoundingClientRect().y
        };

        //Sets elements CSS top propertie value
        function setStickyPos(elements, position) {
            for(element of elements) {
                element.style.top = `${String(position)}px`
            };
        };

        const boundingTop = getYPos(stickyObject.boundingArea);
        const stickyElTop = getYPos(stickyObject.sticky[0]);
        const relativePos = boundingTop - stickyElTop

        //If false/ <= 0
        if(!relativePos){
            setStickyPos(stickyObject.sticky, stickyObject.currentPos);
        } else {
            stickyObject.currentPos += -1 //Increment position upwards
            setStickyPos(stickyObject.sticky, stickyObject.currentPos);
        };
    },

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

    //Checks all required inputs contain a value
    function checkReqInputs() {
        const reqElements = document.getElementsByClassName("req-field");

        //Create list of empty elements
        const emptyElements = Array.from(reqElements).filter((element) => {
            if(element.textLength === 0){
                error.addClass(element);
                return element;
            } else {
                error.removeClass(element);
                return false;
            };
        });

        //True if empty - False if contains elements
        return emptyElements.length === 0 ? true : false;
    };

    const numOfPost = calcNumOfPost(calcInputs.getPostInputs());
    const numInputs = getMultiNumInputs();

    //Creates table if all required inputs contain values
    if(checkReqInputs()) {
        generateRows(numOfPost, createTimesTable(numInputs, numOfPost));
        inputClear();
        inputBlocking.tableCreated = true;
    };
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

//Sticky Table
// stickyElements.tableElements.boundingArea.addEventListener("scroll", function(){stickyElements.stick(stickyElements.tableElements)});
// document.addEventListener("keydown", function(){stickyElements.stick(stickyElements.tableElements)});

document.addEventListener("keydown", function(){});
// stickyElements.observer.observe(stickyElements.tableElements.sticky);

for(element of stickyElements.tableElements.sticky) {
    stickyElements.observer.observe(element)
};