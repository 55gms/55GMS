function CQuestionGenerator(){
    
    this._init = function(){
        
    };
    
    this.getNewMathQuestionFromOperation = function(szOp){
        var iQuestionType = MATH_OPERATION.indexOf(szOp);
        
        var oQuestionData = this._generateQuestion(iQuestionType);

        var aAnswers = this._generateAnswers(oQuestionData.cypher, oQuestionData.correctanswer);
        
        return {cypher:oQuestionData.cypher, operation:oQuestionData.operation, correctanswer:oQuestionData.correctanswer, answers: aAnswers};
    };
    
    this.getNewMathQuestion = function(){
        var iQuestionType = Math.floor( Math.random()*4 );
        var oQuestionData = this._generateQuestion(iQuestionType);

        var aAnswers = this._generateAnswers(oQuestionData.cypher, oQuestionData.correctanswer);
        
        return {cypher:oQuestionData.cypher, operation:oQuestionData.operation, correctanswer:oQuestionData.correctanswer, answers: aAnswers};
    };
    
    ////////////QUESTION GENERATION
    this._generateQuestion = function(iQuestionType){
        var oQuestionData;

        switch(iQuestionType){
            case MATH_QUESTION_ADDITION:{
                    oQuestionData = this._getAdditionProblem();
                    break;
            }
            case MATH_QUESTION_SUBTRACTION:{
                    oQuestionData = this._getSubtractionProblem();
                    break;
            }
            case MATH_QUESTION_MULTIPLICATION:{
                    oQuestionData = this._getMultiplicationProblem();
                    break;
            }
            case MATH_QUESTION_DIVISION:{
                    oQuestionData = this._getDivisionProblem();
                    break;
            }
        }
        
        return oQuestionData;
    };
    
    this._getAdditionProblem = function(){
        //Any 2 digit numbers where the sum is less than 100.
        var iRes = randomFloatBetween(20,99, 0);

        var iFirstNum = randomFloatBetween(10,iRes-10, 0);
        var iSecondNum = iRes - iFirstNum;
        
        return {cypher:[iFirstNum, iSecondNum], operation:MATH_OPERATION[MATH_QUESTION_ADDITION], correctanswer: iRes};
    };
    
    this._getSubtractionProblem = function(){
        var iProblemType = randomFloatBetween(0,1,0);
        var iFirstNum;
        var iSecondNum;
        switch(iProblemType){
            case 0:{
                    //Any 2 digit number minus Any 1 digit number
                    iFirstNum = randomFloatBetween(10,99,0);
                    //iSecondNum = randomFloatBetween(1,9,0);
                    iSecondNum = randomFloatBetween(6,9,0);
                    break;
            }
            case 1:{
                    //Any 2 digit numbers minus Any 2 digit number where both digits of the first number are larger than the digits in the second number
                    var iFirstDigitOfFirstNum = randomFloatBetween(2,9,0);  //START FROM 2, TO GRANT THAT THE SECOND NUMBER CAN BE LESSER AND WITH 2 DIGITS
                    var iSecondDigitOfFirstNum = randomFloatBetween(1,9,0);
                    
                    var iFirstDigitOfSecondNum = randomFloatBetween(1,iFirstDigitOfFirstNum-1,0);
                    var iSecondDigitOfSecondNum = randomFloatBetween(0,iSecondDigitOfFirstNum-1,0);
                    
                    iFirstNum = parseInt( iFirstDigitOfFirstNum + "" + iSecondDigitOfFirstNum );
                    iSecondNum = parseInt( iFirstDigitOfSecondNum + "" + iSecondDigitOfSecondNum );
                    break;
            }
        }
        
        var iRes = iFirstNum - iSecondNum;
        
        return {cypher:[iFirstNum, iSecondNum], operation:MATH_OPERATION[MATH_QUESTION_SUBTRACTION], correctanswer: iRes};
    };
    
    this._getMultiplicationProblem = function(){
        var iProblemType = randomFloatBetween(0,3,0);
        var iFirstNum;
        var iSecondNum;
        switch(iProblemType){
            case 0:{
                    //Any 2 digit number under 50 times 2
                    iFirstNum = randomFloatBetween(10,50,0);
                    iSecondNum = 2;
                    break;
            }
            case 1:{
                    //Any number up to 20 times 2, 3, 4, or 5
                    iFirstNum = randomFloatBetween(2,20,0);
                    iSecondNum = randomFloatBetween(2,5,0);
                    break;
            }
            case 2:{
                    //Any 2 digit number under 50 ending in 0 times any single digit number
                    iFirstNum = randomFloatBetween(1,5,0) * 10;
                    iSecondNum = randomFloatBetween(2,9,0);
                    break;
            }
            case 3:{
                    //Any number between 6 and 11 times any number between 6 and 9
                    iFirstNum = randomFloatBetween(6,11,0);
                    iSecondNum = randomFloatBetween(6,9,0);
                    break;
            }
        }
        
        var iRes = iFirstNum*iSecondNum;
        
        return {cypher:[iFirstNum, iSecondNum], operation:MATH_OPERATION[MATH_QUESTION_MULTIPLICATION], correctanswer: iRes};
    };
    
    this._getDivisionProblem = function(){
        var iProblemType = randomFloatBetween(0,2,0);
        var iFirstNum;
        var iSecondNum;

        switch(iProblemType){
            case 0:{
                    //Inverse of the multiplication rule – any two digit number divided by 2,3,4, or 5 where the answer is between 10 and 15 (inclusive). 
                    var iRes = randomFloatBetween(10,15,0);
                    iSecondNum = randomFloatBetween(2,5,0);
                    iFirstNum = iRes * iSecondNum;
                    break;
            }
            case 1:{
                    //Any 2 digit number divided by any single digit number over 4 where the result is 10 or less 
                    var iRes = randomFloatBetween(2,10,0);
                    iSecondNum = randomFloatBetween(5,9,0);
                    iFirstNum = iRes * iSecondNum;
                    break;
            }
            case 2:{
                    //Any 2 digit number divided by any 2 digit number where the answer is 2, 3, or 4
                    var iRes = randomFloatBetween(2,4,0);
                    iSecondNum = randomFloatBetween(10,25,0);
                    iFirstNum = iRes * iSecondNum;

                    break;
            }
            /*
            case 3:{
                    //Any 2 or 3 digit number ending in 0, divided by any 2 digit number where the result is 10 or less.
                    var iFirstNum = randomFloatBetween(1,99,0)*10;

                    //USING FACTORS, WE'LL GRANT AN INTEGER NUMBER AS RESULTS. REMOVE 1, SELF NUMBER AND 3 CYPHERS
                    var aFactors = getFactors(iFirstNum);
                    aFactors.shift();
                    aFactors.pop();
                    for(var i=0; i<aFactors.length; i++){
                        if(aFactors[i] >= 100){
                            aFactors.splice(i,1);
                            i--;
                        }
                    }

                    ///WE NEED ONLY RESULTS EQUAL-LESS THEN 10
                    var aSecondsNum = new Array();
                    for(var i=0; i<aFactors.length; i++){
                        var iResult = iFirstNum/aFactors[i];
                        if(iResult<=10){
                            aSecondsNum.push(aFactors[i])
                        }
                    }

                    var iRandomIndex = Math.floor( aSecondsNum.length*Math.random() );
                    var iSecondNum = aSecondsNum[ iRandomIndex ];
                    var iRes = iFirstNum/iSecondNum;
                    
                    break;
            }*/
        }
        
        return {cypher:[iFirstNum, iSecondNum], operation:MATH_OPERATION[MATH_QUESTION_DIVISION], correctanswer: iRes};
    };

    ////////////ANSWER GENERATION
    this._generateAnswers = function(aScores, iCorrectAnswer) {
        //trace("aScores:"+aScores);
        var iEasyNumbersCount = 0;
        for (var i = 0; i < aScores.length; i++) {
            //trace("aScores:"+aScores[i]);
            if (aScores[i] % 10 === 0) {
                iEasyNumbersCount++;
            }
        }

        if(iCorrectAnswer % 10 === 0 ){
            iEasyNumbersCount++;
        }

        /*
        var iCorrectAnswer = 0;
        for(var i=0; i< aScores.length; i++) {
            iCorrectAnswer += parseInt(aScores[i]);
        }
        */

        var aRandomAnswers = new Array();
        //trace("iEasyNumbersCount" + iEasyNumbersCount);

        if (iEasyNumbersCount > 1) {
            //console.log("ALG2")
            aRandomAnswers = this._algorithm2(iCorrectAnswer);
        } else {
            //console.log("ALG1")
            aRandomAnswers = this._algorithm1(iCorrectAnswer);
        }

        return aRandomAnswers;
    };

    this._algorithm1 = function(iCorrectAnswer) {
        var iFirstDigit = Math.floor( (iCorrectAnswer / 10) );
        //trace("iFirstDigit:" + iFirstDigit);

        var iSecondDigit = iCorrectAnswer % 10;
        //trace("iSecondDigit:" + iSecondDigit);

        /// DECIDE THE SECOND DIGITS TO MODIFY
        var iRandomSecondDigit;

        do {
            ////ENSURE THERE ARE NO 0 AS ANSWER
            var iStartNum = 0;
            if(iFirstDigit === 0){
                iStartNum = 1;
            }
            ////////////////////////////////////
            iRandomSecondDigit = randomFloatBetween(iStartNum,10,0);
        } while (iRandomSecondDigit === iSecondDigit);

        /// DECIDE THE FIRST DIGITS TO MODIFY (WE CAN'T GO RANDOM, BECAUSE WE HAVE TO STAY IN RANGE OF +/-10) . 
        var iRandomFirstDigit;
        if (iRandomSecondDigit > iSecondDigit) {
            iRandomFirstDigit = iFirstDigit - 1;
            if (iRandomFirstDigit < 0) {
                //trace("LESSTHEN0");
                iRandomFirstDigit = iFirstDigit + 1;
            }
        } else {
            iRandomFirstDigit = iFirstDigit + 1;
        }

        ////ENSURE THERE ARE NO 0 AS ANSWER
        while(iRandomFirstDigit === iFirstDigit || (iSecondDigit === 0 && iRandomFirstDigit === 0)){
            iRandomFirstDigit = randomFloatBetween(1,10,0);
        }
        ////////////////////////////////////

        ////GENERATE 4 DIFFERENT ANSWER
        var aRandomAnswers = new Array();
        aRandomAnswers[0] = iCorrectAnswer;
        aRandomAnswers[1] = iFirstDigit * 10 + iRandomSecondDigit;
        aRandomAnswers[2] = iRandomFirstDigit * 10 + iSecondDigit;
        aRandomAnswers[3] = iRandomFirstDigit * 10 + iRandomSecondDigit;

        //aRandomAnswers.shuffleList();
        shuffle(aRandomAnswers);

        return aRandomAnswers;
    };

    this._algorithm2 = function(iCorrectAnswer) {
        var iFirstDigit = Math.floor( (iCorrectAnswer / 10) );
        //trace("iFirstDigit:" + iFirstDigit);

        var iSecondDigit = iCorrectAnswer % 10;
        //trace("iSecondDigit:" + iSecondDigit);

        

        var iRandomDigit;
        var iMinLimit;
        var iMaxLimit;
        if (iFirstDigit - 3 < 0) {
            iMinLimit = 1;
            iMaxLimit = 4;
        } else {
            iMinLimit = iFirstDigit - 2;
            iMaxLimit = iFirstDigit + 2;
        }

        var aRangeNumbers = new Array();
        aRangeNumbers[0] = iFirstDigit;
        var iProtection = 0;

        for (var i = 1; i < 4; i++) {
            do {
                iProtection++;

                iRandomDigit = randomFloatBetween(iMinLimit, iMaxLimit, 0) ;
                if (iProtection > 100) {
                    break;
                }
            } while (this._isADouble(iRandomDigit, aRangeNumbers));

            aRangeNumbers[i] = iRandomDigit;
            iProtection = 0;
        }

        //aRangeNumbers.shuffleList();
        shuffle(aRangeNumbers);
        for (var i = 0; i < 4; i++) {
            aRangeNumbers[i] = aRangeNumbers[i] * 10 + iSecondDigit;
        }


        return aRangeNumbers;
    };

    this._isADouble = function(iNum, aArrayNumber) {
        for (var i = 0; i < aArrayNumber.length; i++) {
            if (aArrayNumber[i] === iNum) {
                //trace("true:" + aArrayNumber[i] + " " + iNum);
                return true;
            }
        }

        //trace("false:" + iNum);

        return false;
    };

    this.getWrongAnswer = function(iNum, aArrayNumber) {

    };
    
    this._init();
}


