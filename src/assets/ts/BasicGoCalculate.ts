
import {  GoStateBasic, InitialSignalsCombinationOutValue } from "@/assets/ts/interface";
interface inOutValue{
    status: number,
    value: number,
    accumulationValue: number,
}

import { calculateResultAccumulation, handleCombination } from "@/assets/ts/MyUtils";

export abstract class BasicGoCalculate {
    id: string;
    basic: GoStateBasic;

    initialSignals: Array<any> = [];    //5信号发生器不一样
    noDuplicateInitialSignals: Array<any> = [];     //5信号发生器不一样
    initialSignalsCombinationOutValues: Array<InitialSignalsCombinationOutValue> = [];  //5信号发生器不一样

    adjacentNodes: Array<any>;
    preAdjacentNodes: Array<any> = [];

    //
    outValues: Array<inOutValue>;
    //运算符 1、3、
    inValues: Array<inOutValue>;
    //运算符 2、10、
    inValuesArray: Array<Array<inOutValue>> = [];
    //运算符 6、7、
    inValues1: Array<inOutValue>;
    inValues2: Array<inOutValue>;

    //[1]运算符通用计算
    abstract calculateOutValues(): Array<inOutValue>;

    //[2]前序工作已处理好，运算最终结果
    calculateCombinationOutValuesResult (): void {
        console.log("前序工作已处理好，运算最终结果---->");

        const processedCombinationOutValues = handleCombination( this.initialSignalsCombinationOutValues, this.noDuplicateInitialSignals);

        // console.log( processedCombinationOutValues );

        const resultAccumulation = calculateResultAccumulation( processedCombinationOutValues );

        // console.log( resultAccumulation );

        for (let i = 0; i < resultAccumulation.length; i++) {
            this.outValues.push({
                status: i,
                value: 0,
                accumulationValue: resultAccumulation[i],
            });
        }

    }


    //[1.1]清空输出信号
    clearOutValues(): void {
        this.outValues = [];
    }
    //[1.2]清空输入信号
    clearInValues(): void {
        this.inValues = [];
        this.inValuesArray = [];
        this.inValues1 = [];
        this.inValues2 = [];
    }

    //[2]传递初始信号
    addInitialSignal( _initialSignal): void {
        this.initialSignals.push( _initialSignal );
    }
    addInitialSignals( _initialSignals): void {
        for (let i = 0; i < _initialSignals.length; i++) {
            this.initialSignals.push( _initialSignals[i] );
        }
    }

}