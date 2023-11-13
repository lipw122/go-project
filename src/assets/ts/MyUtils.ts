import Decimal from "decimal.js";

/*
试验：
const attributeCounts: number[] = [2, 3, 2];
const result: number[][] = attributePermutations(attributeCounts);
console.log(result);
[ [0, 0, 0], [0, 0, 1], [0, 1, 0], [0, 1, 1], [0, 2, 0], [0, 2, 1], [1, 0, 0], [1, 0, 1], [1, 1, 0], [1, 1, 1], [1, 2, 0], [1, 2, 1]]
*/
export default  function(attributeCounts : number[]) : number[][] {
    const allPermutations : number[][] = [];

    function generatePermutations(currentPermutation : number[], index : number) {
        if (currentPermutation.length === attributeCounts.length) {
            allPermutations.push(currentPermutation.slice());
            return;
        }
        const attributeCount = attributeCounts[index];
        for (let i = 0; i < attributeCount; i++) {
            currentPermutation.push(i);
            generatePermutations(currentPermutation, index + 1);
            currentPermutation.pop();
        }
    }
    generatePermutations([], 0);

    return allPermutations;
}



export function generateVariableCombinations(n: number, m: number): { [variable: string]: number[][] } {
    const combinations: { [variable: string]: number[][] } = {};

    //回溯函数
    const backtrack = (currentCombination: number[], variableIndex: number) => {
        if (currentCombination.length === n) {
            /*combinations[`status_${variableIndex + 1}`] = combinations[`status_${variableIndex + 1}`] || [];
            combinations[`status_${variableIndex + 1}`].push(currentCombination.slice());*/
            combinations[`status_${variableIndex}`] = combinations[`status_${variableIndex}`] || [];
            combinations[`status_${variableIndex}`].push(currentCombination.slice());

            return;
        }

        for (let i = 0; i <= 1; i++) {
            currentCombination.push(i);
            backtrack(currentCombination, variableIndex);
            currentCombination.pop();
        }
    };

    //每一个状态调用一次回溯函数
    for (let i = 0; i < m; i++) {
        backtrack([], i);
    }

    return combinations;
}

// Example usage:
const n = 3; // Number of objects
const m = 2; // Number of variables per object
const variableCombinations = generateVariableCombinations(n, m);
// console.log(variableCombinations);



export function removeDuplicatesById(objects: Array<any>): Array<any> {
    const uniqueIds = new Set<string>();
    return objects.filter(obj => {
        if (uniqueIds.has(obj.id)) {
            return false;
        } else {
            uniqueIds.add(obj.id);
            return true;
        }
    });
}


//整理组合当前运算符的状态组合
export function handleCombination( _initialSignalsCombinationOutValues, _noDuplicateInitialSignals: Array<any> ) {
    const newCombinationOutValues = []
    for (let i = 0; i < _initialSignalsCombinationOutValues.length; i++) {

        newCombinationOutValues.push({
            combinationStatusInfos: [],
            oneStatusAccumulationValueOutValue:
            _initialSignalsCombinationOutValues[i].oneStatusAccumulationValueOutValue,
        })

        for (let j = 0; j < _initialSignalsCombinationOutValues[i].combinationStatusInfos.length; j++) {

            for (let k = 0; k < _noDuplicateInitialSignals.length; k++) {

                if ( _initialSignalsCombinationOutValues[i].combinationStatusInfos[j].id
                    === _noDuplicateInitialSignals[k].id ){
                    newCombinationOutValues[i].combinationStatusInfos.push(
                        _initialSignalsCombinationOutValues[i].combinationStatusInfos[j] );
                }

            }

        }

    }

    // console.log( newCombinationOutValues );


    const uniqueObjects = [];
    const seenObjects = new Set<string>();

    for (const obj of newCombinationOutValues) {
        const objString = JSON.stringify(obj);

        if (!seenObjects.has(objString)) {
            seenObjects.add(objString);
            uniqueObjects.push(obj);
        }
    }

    // console.log( uniqueObjects );

    const combinationNumber = uniqueObjects.length;     //组合数量
    const n = _noDuplicateInitialSignals.length;    //信号数量
    //all = m * 2^n
    const m = combinationNumber / ( Math.pow( 2, n ) );    //状态数量
    // console.log(m);
    // console.log(n);
    // console.log(combinationNumber);
    const processedCombinationOutValues = [];
    for (let i = 0; i < m; i++) {
        const oneStatus = [];
        for (let j = 0; j < combinationNumber; j++) {
            if ( uniqueObjects[j].combinationStatusInfos[0].statusNumber === i ) {
                oneStatus.push( uniqueObjects[j] );
            }
        }
        processedCombinationOutValues.push( oneStatus );
        // console.log( oneStatus );
    }

    return  processedCombinationOutValues;
}

//计算每个运算符的最终累计概率
export function calculateResultAccumulation( _processedCombinationOutValues: Array<any> ) {

    const resultAccumulation = [];
    for (let i = 0; i < _processedCombinationOutValues.length; i++) {
        let tempNum = 0;
        //每一个状态的所有情况    processedCombinationOutValues[i]
        for (let j = 0; j < _processedCombinationOutValues[i].length; j++) {

            //每一种情况的运算
            let onePart = 1;
            for (let k = 0;
                 k < _processedCombinationOutValues[i][j].combinationStatusInfos.length;
                 k++) {

                // console.log( processedCombinationOutValues[i][j].combinationStatusInfos[k] );
                if ( _processedCombinationOutValues[i][j].combinationStatusInfos[k].statusAccumulationValue === 0 ) {
                    // console.log( 1 - processedCombinationOutValues[i][j].combinationStatusInfos[k].initialSignalAccumulationValue );
                    // onePart *= ( 1 - _processedCombinationOutValues[i][j].combinationStatusInfos[k].initialSignalAccumulationValue );
                    onePart = new Decimal(onePart)
                        .mul(new Decimal(new Decimal(1)
                            .minus(_processedCombinationOutValues[i][j].combinationStatusInfos[k].initialSignalAccumulationValue)))
                        .toNumber();
                }
                else if ( _processedCombinationOutValues[i][j].combinationStatusInfos[k].statusAccumulationValue === 1 ) {
                    // console.log( processedCombinationOutValues[i][j].combinationStatusInfos[k].initialSignalAccumulationValue );

                    // onePart *= _processedCombinationOutValues[i][j].combinationStatusInfos[k].initialSignalAccumulationValue;

                    onePart = new Decimal(onePart)
                        .mul(new Decimal(_processedCombinationOutValues[i][j].combinationStatusInfos[k].initialSignalAccumulationValue))
                        .toNumber();
                }

            }

            // onePart *= _processedCombinationOutValues[i][j].oneStatusAccumulationValueOutValue;
            onePart = new Decimal(onePart)
                .mul(new Decimal(_processedCombinationOutValues[i][j].oneStatusAccumulationValueOutValue))
                .toNumber();
            // console.log(onePart);

            tempNum = new Decimal(tempNum).add(new Decimal(onePart)).toNumber();
            // console.log( tempNum );


        }

        resultAccumulation.push(tempNum);

    }

    return resultAccumulation;

}
