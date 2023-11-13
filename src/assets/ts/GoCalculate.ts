
import {
    // inOutValue,
    InitialSignalsCombinationOutValue,
    SignalStatusInfo,

    GoState1,
    GoState2,
    GoState3_6_7_16_17,
    GoState5,
    GoStateBasic,
} from "@/assets/ts/interface";

import { removeDuplicatesById, handleCombination, calculateResultAccumulation } from "@/assets/ts/MyUtils";

import Decimal from "decimal.js"
import {BasicGoCalculate} from "@/assets/ts/BasicGoCalculate";


interface inOutValue{
    status: number,
    value: number,
    accumulationValue: number,
}

class GoCalculate1 extends BasicGoCalculate{

    goState: GoState1;

    //[1]运算符通用计算
    calculateOutValues(): Array<inOutValue>{
        const out = [];
        //计算 0 ~ n-1 的累计概率 和 概率
        for( let i = 0; i < (this.inValues.length - 1); i++){
            out.push({
                status: Number(this.inValues[i].status),
                value: new Decimal(this.inValues[i].value).mul( new Decimal(this.goState.Pc_1)).toNumber(),
                accumulationValue: new Decimal(this.inValues[i].accumulationValue).mul(this.goState.Pc_1).toNumber(),
            });
        }

        //计算 n 的累计概率 和 概率
        out.push({
            status: Number(this.inValues[ this.inValues.length - 1 ].status),
            value: (new Decimal(this.inValues[this.inValues.length-1].value).mul(new Decimal(this.goState.Pc_1))).add(new Decimal(this.goState.Pc_2)).toNumber(),
            accumulationValue: 1,
        });

        return out;
    }


    //[2.1]设置输入状态，并且如果可以，    计算输出状态
    setInValues( _inValues: Array<inOutValue> ): void {
        this.inValues = _inValues;
        this.outValues = this.calculateOutValues();
    }
    //[2.2]设置输入状态，并且如果可以，    计算 组合的 输出状态
    setAmendCommonSignalUniversalInValues( _inValues: Array<inOutValue>,
                                           _combinationStatusInfos: Array<SignalStatusInfo> ): void {
        //设置输入信号，并计算输出信号
        this.inValues = _inValues;
        const outValues = this.calculateOutValues();
        this.outValues = outValues;

        //添加 initialSignalsCombinationOutValues
        let _oneStatusAccumulationValueOutValue: number;
        for (let i = 0; i < outValues.length; i++) {
            if ( outValues[i].status === _combinationStatusInfos[0].statusNumber) {
                _oneStatusAccumulationValueOutValue = outValues[i].accumulationValue;
                break;
            }
        }
        this.initialSignalsCombinationOutValues.push({
            combinationStatusInfos: _combinationStatusInfos,
            oneStatusAccumulationValueOutValue: _oneStatusAccumulationValueOutValue,
        });
    }


}

class GoCalculate2 extends BasicGoCalculate{

    goState: GoState2;

    commonSignal: Array<any> = [];    //共有信号ID

    //[1]运算符通用计算
    calculateOutValues(): Array<inOutValue> {
        const out = [];

        for (let i = 0; i < this.inValuesArray[0].length; i++) {
            out.push({
                status: this.inValuesArray[0][i].status,
                value: 0,
                accumulationValue: 1,
            });
        }

        //计算 0 ~ n-1 （1-A）累乘
        for (let i = 0; i < out.length - 1 ; i++) {
            for (let j = 0; j < this.inValuesArray.length; j++) {
                //
                // out[i].accumulationValue = out[i].accumulationValue * ( 1 - this.inValuesArray[j][i].accumulationValue );
                out[i].accumulationValue = new Decimal(out[i].accumulationValue)
                    .mul(new Decimal(1).minus(this.inValuesArray[j][i].accumulationValue)).toNumber();
            }
        }
        //计算 0 ~ n-1  1 - 累乘
        for (let i = 0; i < out.length - 1 ; i++) {
            out[i].accumulationValue = new Decimal(1).minus(out[i].accumulationValue).toNumber();
        }


        //计算状态概率
        out[0].value = out[0].accumulationValue;
        for (let i = 1; i < (out.length -1) ; i++) {
            out[i].value = new Decimal(out[i].accumulationValue).minus(out[i-1].accumulationValue).toNumber() ;
        }
        let value_n = 1;
        for (let i = 0; i < this.inValuesArray.length; i++) {
            value_n = new Decimal(value_n).mul(this.inValuesArray[i][out.length-1].value).toNumber();
        }
        out[out.length-1].value = value_n;

        return out;

    }


    //[2.1]设置输入信号
    setInValues( _inValues: Array<inOutValue> ): void {
        this.inValuesArray.push( _inValues );
        if ( this.inValuesArray.length >= this.preAdjacentNodes.length) {
            this.outValues = this.calculateOutValues();
        }
    }
    //[2.2]设置输入状态，并且如果可以，    计算 组合的 输出状态
    setAmendCommonSignalUniversalInValues( _inValues: Array<inOutValue>,
                                           _combinationStatusInfos: Array<SignalStatusInfo> ): void {
        this.inValuesArray.push( _inValues );
        // console.log(this.inValuesArray.length);
        // console.log(this.preAdjacentNodes.length);
        // console.log( this.inValuesArray );
        if ( this.inValuesArray.length === this.preAdjacentNodes.length) {
            // console.log("进入运算");
            this.outValues = this.calculateOutValues();
            // console.log(this.outValues);
            const outValues = this.outValues;

            //添加 initialSignalsCombinationOutValues
            let _oneStatusAccumulationValueOutValue: number;
            for (let i = 0; i < outValues.length; i++) {
                if ( outValues[i].status === _combinationStatusInfos[0].statusNumber) {
                    _oneStatusAccumulationValueOutValue = outValues[i].accumulationValue;
                    break;
                }
            }
            this.initialSignalsCombinationOutValues.push({
                combinationStatusInfos: _combinationStatusInfos,
                oneStatusAccumulationValueOutValue: _oneStatusAccumulationValueOutValue,
            });

        }

    }



    //通过 initialSignals 计算 commonSignal
    findCommonSignal ( arr: string[] ): string[]  {
        const duplicates: string[] = [];
        const countMap: { [key: string]: number } = {};

        for (const str of arr) {
            countMap[str] = countMap[str] ? countMap[str] + 1 : 1;
            if (countMap[str] === 2) {
                duplicates.push(str);
            }
        }

        return duplicates;
    }

}

class GoCalculate3 extends BasicGoCalculate {

    goState: GoState3_6_7_16_17;

    //[1]运算符通用计算
    calculateOutValues(): Array<inOutValue> {
        const out = [];

        //计算 0 ~ n-1 的累计概率和  1 ~ n-1 的概率
        for (let i = 0; i < this.inValues.length - 1; i++) {
            out.push({
                status: Number(this.inValues[i].status),
                value: new Decimal(this.inValues[i].value).mul(new Decimal(this.goState.Pc_1)).toNumber(),
                accumulationValue: new Decimal(this.goState.Pc_0).add(new Decimal(this.inValues[i].accumulationValue).mul(new Decimal(this.goState.Pc_1))).toNumber() ,
            });
        }

        //计算 n 的累计概率和概率
        out.push({
            status: this.inValues[ this.inValues.length - 1 ].status,
            value: new Decimal(new Decimal(this.inValues[ this.inValues.length - 1 ].value).mul(new Decimal(this.goState.Pc_1))).add(new Decimal(this.goState.Pc_2)).toNumber(),
            accumulationValue: 1,
        });

        //计算 0 的概率
        out[0].value = new Decimal(this.goState.Pc_0).add(new Decimal(this.inValues[0].value).mul(new Decimal(this.goState.Pc_1))).toNumber();

        //计算 0 的概率
        out[0].value = new Decimal(this.goState.Pc_0).add(new Decimal(this.inValues[0].value).mul(new Decimal(this.goState.Pc_1))).toNumber();

        return out;

    }

    //[2.1]设置输入状态，并且如果可以，    计算输出状态
    setInValues( _inValues: Array<inOutValue> ): void {
        this.inValues = _inValues;
        this.outValues = this.calculateOutValues();
    }
    //[2.2]设置输入状态，并且如果可以，    计算 组合的 输出状态
    setAmendCommonSignalUniversalInValues( _inValues: Array<inOutValue>,
                                           _combinationStatusInfos: Array<SignalStatusInfo> ): void {
        this.inValues = _inValues;
        this.outValues = this.calculateOutValues();
        const outValues = this.outValues;

        //添加 initialSignalsCombinationOutValues
        let _oneStatusAccumulationValueOutValue: number;
        for (let i = 0; i < outValues.length; i++) {
            if ( outValues[i].status === _combinationStatusInfos[0].statusNumber) {
                _oneStatusAccumulationValueOutValue = outValues[i].accumulationValue;
                break;
            }
        }
        this.initialSignalsCombinationOutValues.push({
            combinationStatusInfos: _combinationStatusInfos,
            oneStatusAccumulationValueOutValue: _oneStatusAccumulationValueOutValue,
        });

    }


}

class GoCalculate5 {
    id: string;
    basic: GoStateBasic;
    goState: GoState5;
    adjacentNodes: Array<any>;
    preAdjacentNodes: Array<any> = [];

    initialSignal: any;
    noDuplicateInitialSignals: Array<any> = [];
    initialSignalsCombinationOutValues: Array<InitialSignalsCombinationOutValue> = [];

    tempGoState: GoState5;

    private outValues: Array<inOutValue>;
    calculateOutValues(): Array<inOutValue> {
        const out = [];

        out.push({
            status: this.goState.signalStatusValues[0].statusValue,
            value: Number(this.goState.signalStatusValues[0].value),
            accumulationValue: Number(this.goState.signalStatusValues[0].value),
        });
        for (let j = 1; j < this.goState.signalStatusValues.length; j++) {
            out.push({
                status: this.goState.signalStatusValues[j].statusValue,
                value: Number(this.goState.signalStatusValues[j].value),
                accumulationValue: Number(this.goState.signalStatusValues[j].value) + Number(out[j-1].accumulationValue),
            });
        }

        return out;
    }

    //组合初始信号 计算
    setTempOutValues( _combinationStatusInfos: Array<SignalStatusInfo> ) {

        this.outValues = this.calculateAmendProcessOutValues( _combinationStatusInfos );
        // console.log( "this.outValues: " );
        // console.log( this.outValues );

    }
    //组合信号 计算 输出信号
    calculateAmendProcessOutValues( _combinationStatusInfos: Array<SignalStatusInfo> ): Array<inOutValue> {
        const out = [];

        out.push({
            status: this.goState.signalStatusValues[0].statusValue,
            value: Number(this.goState.signalStatusValues[0].value),
            accumulationValue: Number(this.goState.signalStatusValues[0].value),
        });
        for (let j = 1; j < this.goState.signalStatusValues.length; j++) {
            out.push({
                status: this.goState.signalStatusValues[j].statusValue,
                value: Number(this.goState.signalStatusValues[j].value),
                accumulationValue: Number(this.goState.signalStatusValues[j].value) + Number(out[j-1].accumulationValue),
            });
        }

        for (let i = 0; i < out.length; i++) {
            if ( out[i].status === _combinationStatusInfos[0].statusNumber) {
                for (let j = 0; j < _combinationStatusInfos.length; j++) {
                    if ( this.id === _combinationStatusInfos[j].id ) {
                        out[i].accumulationValue = _combinationStatusInfos[j].statusAccumulationValue;
                        break;
                    }
                }
                break;
            }
        }

        return out;
    }


    //[2]前序工作已处理好，运算最终结果
    calculateCombinationOutValuesResult (): void {
        console.log("前序工作已处理好，运算最终结果---->");

        for (let i = 0; i < this.goState.signalStatusNumber; i++) {
            this.outValues.push({
                status: i,
                value: this.goState.signalStatusValues[i].value,
                accumulationValue: 0,
            });
        }

    }

    //获取输出状态
    getOutValues(): Array<inOutValue> {
        return this.outValues;
    }
    //设置输入状态，并且如果可以，    计算输出状态
    /*setInValues() {
        this.outValues = this.calculateOutValues();
    }*/
    setOutValues(): void {
        this.outValues = this.calculateOutValues();
        this.initialSignal = {
            id: this.id,
            basic: this.basic,
            goState: this.goState,
        };
    }

    //清空输出信号
    clearOutValues(): void {
        this.outValues = [];
    }
}

class GoCalculate6 extends BasicGoCalculate {

    goState: GoState3_6_7_16_17;

    //[1]运算符通用计算
    calculateOutValues(): Array<inOutValue> {
        const out = [];

        //计算 0 ~ n-1 的累计概率
        for(let i = 0; i < ( this.inValues1.length - 1 ); i++){

            /*const accumulationValue = this.inValues1[i].accumulationValue *
                ( this.goState.Pc_0 + this.inValues2[i].accumulationValue * this.goState.Pc_1);*/

            const accumulationValue = new Decimal(this.inValues1[i].accumulationValue)
                    .mul(new Decimal(this.goState.Pc_0).add(new Decimal(this.inValues2[i].accumulationValue).mul(this.goState.Pc_1))).toNumber();

            out.push({
                status: this.inValues1[i].status,
                value: 0,
                accumulationValue: accumulationValue,
            });
        }

        //计算 n 的累计概率 和 概率
        out.push({
            status: this.inValues1[this.inValues1.length-1].status,
            /*value: this.inValues1[this.inValues1.length - 1].value  +
                this.inValues1[this.inValues1.length - 2].accumulationValue *
                ( this.goState.Pc_2 + this.inValues2[this.inValues2.length - 1].value *  this.goState.Pc_1),*/
            value: new Decimal(this.inValues1[this.inValues1.length - 1].value)
                .add(new Decimal(this.inValues1[this.inValues1.length - 2].accumulationValue)
                    .mul(new Decimal(this.goState.Pc_2)
                        .add( new Decimal(this.inValues2[this.inValues2.length - 1].value)
                            .mul(new Decimal(this.goState.Pc_1)) ))).toNumber(),
            accumulationValue: 1,
        });

        //计算 0 的概率
        out[0].value = out[0].accumulationValue;

        //计算 1 ~ n-1 的概率
        for(let i = 1; i < ( this.inValues1.length - 1 ); i++){
            /*console.log(out[i].accumulationValue);
            console.log(out[i-1].accumulationValue);*/
            out[i].value = out[i].accumulationValue - out[i-1].accumulationValue;
        }

        return out;
    }


    //[2.1]设置输入状态1，并且如果可以，    计算输出状态
    setInValues1( _inValues1: Array<inOutValue> ): void {
        this.inValues1 = _inValues1;
        if ( this.inValues2 != null){
            this.outValues = this.calculateOutValues();
        }
    }
    //[2.2]设置输入状态2，并且如果可以，    计算输出状态
    setInValues2( _inValues2: Array<inOutValue> ): void {
        this.inValues2 = _inValues2;
        if ( this.inValues1 != null){
            this.outValues = this.calculateOutValues();
        }
    }
    //[2.3]设置输入状态，并且如果可以，    计算 组合的 输出状态
    setAmendCommonSignalUniversalInValues1( _inValues1: Array<inOutValue>,
                                           _combinationStatusInfos: Array<SignalStatusInfo> ): void {
        this.inValues1 = _inValues1;
        // console.log("setAmendCommonSignalUniversalInValues1");
        // console.log(this.inValues1);
        // console.log(this.inValues2);
        // console.log( this.inValues1.length === this.inValues2.length );
        if ( this.inValues2 != null && this.inValues1.length === this.inValues2.length ){

            this.outValues = this.calculateOutValues();

            const outValues = this.outValues;

            //添加 initialSignalsCombinationOutValues
            let _oneStatusAccumulationValueOutValue: number;
            for (let i = 0; i < outValues.length; i++) {
                if ( outValues[i].status === _combinationStatusInfos[0].statusNumber) {
                    _oneStatusAccumulationValueOutValue = outValues[i].accumulationValue;
                    break;
                }
            }
            this.initialSignalsCombinationOutValues.push({
                combinationStatusInfos: _combinationStatusInfos,
                oneStatusAccumulationValueOutValue: _oneStatusAccumulationValueOutValue,
            });

        }


    }
    //[2.4]设置输入状态，并且如果可以，    计算 组合的 输出状态
    setAmendCommonSignalUniversalInValues2( _inValues2: Array<inOutValue>,
                                            _combinationStatusInfos: Array<SignalStatusInfo> ): void {
        this.inValues2 = _inValues2;
        // console.log("setAmendCommonSignalUniversalInValues2");
        // console.log(this.inValues1);
        // console.log(this.inValues2);
        // console.log( this.inValues1.length === this.inValues2.length );
        if ( this.inValues1 != null && this.inValues1.length === this.inValues2.length ){

            this.outValues = this.calculateOutValues();

            const outValues = this.outValues;

            //添加 initialSignalsCombinationOutValues
            let _oneStatusAccumulationValueOutValue: number;
            for (let i = 0; i < outValues.length; i++) {
                if ( outValues[i].status === _combinationStatusInfos[0].statusNumber) {
                    _oneStatusAccumulationValueOutValue = outValues[i].accumulationValue;
                    break;
                }
            }
            this.initialSignalsCombinationOutValues.push({
                combinationStatusInfos: _combinationStatusInfos,
                oneStatusAccumulationValueOutValue: _oneStatusAccumulationValueOutValue,
            });

        }

    }


}

class GoCalculate7 extends BasicGoCalculate {

    goState: GoState3_6_7_16_17;

    //[1]运算符通用计算
    calculateOutValues(): Array<inOutValue> {
        const out = [];
        //计算 0 ~ n-1 的概率
        for (let i = 0; i < (this.inValues1.length-1); i++) {
            const temp = new Decimal(new Decimal(new Decimal(this.inValues1[i].value)
                .mul(new Decimal(1).minus(new Decimal(this.inValues2[i].accumulationValue))))
                .mul(new Decimal(this.goState.Pc_1))).add(new Decimal(this.inValues1[i].value)
                .mul(new Decimal(this.goState.Pc_2)))
                .toNumber();
            out.push({
                status: this.inValues1[i].status,
                // value: inValues1[i].value * ( 1 - inValues2[i].accumulationValue ) * goState7.Pc_1 + inValues1[i].value * goState7.Pc_2,
                value: temp,
                accumulationValue: 1,
            });
        }

        //计算 n 的 概率 和 累计概率
        let temp_num = 0;
        for (let i = 0; i < this.inValues1.length; i++) {
            // temp_num = temp_num + inValues1[i].value * inValues2[i].accumulationValue * goState7.Pc_1;
            temp_num = new Decimal(temp_num)
                .add(new Decimal(this.inValues1[i].value)
                    .mul(this.inValues2[i].accumulationValue)
                    .mul(new Decimal(this.goState.Pc_1))).toNumber();
        }
        out.push({
            status: this.inValues1[this.inValues1.length-1].status,
            // value: temp_num + goState7.Pc_0 + inValues1[inValues1.length-1].value * goState7.Pc_2,
            value: new Decimal(temp_num)
                .add(new Decimal(this.goState.Pc_0))
                .add(new Decimal(this.inValues1[this.inValues1.length-1].value)
                    .mul(new Decimal(this.goState.Pc_2))).toNumber(),
            accumulationValue: 1,
        });

        //计算 0 ~ n-1 的 累计概率
        for (let i = 0; i < (out.length - 1); i++) {
            let temp_accumulationValue = 0;

            for (let j = 0; j <= i; j++) {
                // temp_accumulationValue = temp_accumulationValue + inValues1[j].value * inValues2[j].accumulationValue * goState7.Pc_1;
                temp_accumulationValue = new Decimal(temp_accumulationValue)
                    .add(new Decimal(new Decimal(this.inValues1[j].value)
                        .mul(new Decimal(this.inValues2[j].accumulationValue))
                        .mul(new Decimal(this.goState.Pc_1))))
                    .toNumber();
            }

            // out[i].accumulationValue = inValues1[i].accumulationValue * ( goState7.Pc_1 + goState7.Pc_2 ) - temp_accumulationValue;
            out[i].accumulationValue = new Decimal(new Decimal(this.inValues1[i].accumulationValue)
                .mul(new Decimal(this.goState.Pc_1)
                    .add(new Decimal(this.goState.Pc_2))))
                .minus(new Decimal(temp_accumulationValue))
                .toNumber();
        }
        return out;
    }



    //[2.1]设置输入状态1，并且如果可以，    计算输出状态
    setInValues1( _inValues1: Array<inOutValue> ): void {
        this.inValues1 = _inValues1;
        if ( this.inValues2 != null){
            this.outValues = this.calculateOutValues();
        }
    }
    //[2.2]设置输入状态2，并且如果可以，    计算输出状态
    setInValues2( _inValues2: Array<inOutValue> ): void {
        this.inValues2 = _inValues2;
        if ( this.inValues1 != null){
            this.outValues = this.calculateOutValues();
        }
    }
    //[2.3]设置输入状态，并且如果可以，    计算 组合的 输出状态
    setAmendCommonSignalUniversalInValues1( _inValues1: Array<inOutValue>,
                                            _combinationStatusInfos: Array<SignalStatusInfo> ): void {
        this.inValues1 = _inValues1;
        // console.log("setAmendCommonSignalUniversalInValues1");
        // console.log(this.inValues1);
        // console.log(this.inValues2);
        // console.log( this.inValues1.length === this.inValues2.length );
        if ( this.inValues2 != null && this.inValues1.length === this.inValues2.length ){

            this.outValues = this.calculateOutValues();

            const outValues = this.outValues;

            //添加 initialSignalsCombinationOutValues
            let _oneStatusAccumulationValueOutValue: number;
            for (let i = 0; i < outValues.length; i++) {
                if ( outValues[i].status === _combinationStatusInfos[0].statusNumber) {
                    _oneStatusAccumulationValueOutValue = outValues[i].accumulationValue;
                    break;
                }
            }
            this.initialSignalsCombinationOutValues.push({
                combinationStatusInfos: _combinationStatusInfos,
                oneStatusAccumulationValueOutValue: _oneStatusAccumulationValueOutValue,
            });

        }


    }
    //[2.4]设置输入状态，并且如果可以，    计算 组合的 输出状态
    setAmendCommonSignalUniversalInValues2( _inValues2: Array<inOutValue>,
                                            _combinationStatusInfos: Array<SignalStatusInfo> ): void {
        this.inValues2 = _inValues2;
        // console.log("setAmendCommonSignalUniversalInValues2");
        // console.log(this.inValues1);
        // console.log(this.inValues2);
        // console.log( this.inValues1.length === this.inValues2.length );
        if ( this.inValues1 != null && this.inValues1.length === this.inValues2.length ){

            this.outValues = this.calculateOutValues();

            const outValues = this.outValues;

            //添加 initialSignalsCombinationOutValues
            let _oneStatusAccumulationValueOutValue: number;
            for (let i = 0; i < outValues.length; i++) {
                if ( outValues[i].status === _combinationStatusInfos[0].statusNumber) {
                    _oneStatusAccumulationValueOutValue = outValues[i].accumulationValue;
                    break;
                }
            }
            this.initialSignalsCombinationOutValues.push({
                combinationStatusInfos: _combinationStatusInfos,
                oneStatusAccumulationValueOutValue: _oneStatusAccumulationValueOutValue,
            });

        }
    }


}

class GoCalculate10 extends BasicGoCalculate {

    goState: GoState2;

    commonSignal: Array<any> = [];    //共有信号ID

    //[1]运算符通用计算
    calculateOutValues(): Array<inOutValue> {
        const out = [];

        //计算 0 ~ n - 1 的累积概率
        for (let i = 0; i < this.inValuesArray[0].length - 1; i++) {
            let tempA = 1;
            for (let j = 0; j < this.inValuesArray.length; j++) {
                tempA = tempA * this.inValuesArray[j][i].accumulationValue;
            }
            out.push({
                status: this.inValuesArray[0][i].status,
                value: 0,
                accumulationValue: tempA,
            });
        }

        //计算 n 的累积概率
        out.push({
            status: this.inValuesArray[0].length-1,
            value: 0,
            accumulationValue: 1,
        });

        //计算 0 的概率
        out[0].value = out[0].accumulationValue;

        //计算 1 ~ n - 1 的概率
        for (let i = 1; i < this.inValuesArray[0].length - 1; i++) {
            out[i].value = out[i].accumulationValue - out[i-1].accumulationValue;
        }

        //计算 n 的概率
        out[this.inValuesArray[0].length-1].value = 1 - out[this.inValuesArray[0].length-2].accumulationValue

        return out;
    }


    //[2.1]设置输入信号
    setInValues( _inValues: Array<inOutValue> ): void {
        this.inValuesArray.push( _inValues );
        if ( this.inValuesArray.length >= this.preAdjacentNodes.length) {
            this.outValues = this.calculateOutValues();
        }
    }
    //[2.2]设置输入状态，并且如果可以，    计算 组合的 输出状态
    setAmendCommonSignalUniversalInValues( _inValues: Array<inOutValue>,
                                           _combinationStatusInfos: Array<SignalStatusInfo> ): void {
        this.inValuesArray.push( _inValues );
        // console.log(this.inValuesArray.length);
        // console.log(this.preAdjacentNodes.length);
        // console.log( this.inValuesArray );
        if ( this.inValuesArray.length === this.preAdjacentNodes.length) {
            // console.log("进入运算");
            this.outValues = this.calculateOutValues();
            // console.log(this.outValues);
            const outValues = this.outValues;

            //添加 initialSignalsCombinationOutValues
            let _oneStatusAccumulationValueOutValue: number;
            for (let i = 0; i < outValues.length; i++) {
                if ( outValues[i].status === _combinationStatusInfos[0].statusNumber) {
                    _oneStatusAccumulationValueOutValue = outValues[i].accumulationValue;
                    break;
                }
            }
            this.initialSignalsCombinationOutValues.push({
                combinationStatusInfos: _combinationStatusInfos,
                oneStatusAccumulationValueOutValue: _oneStatusAccumulationValueOutValue,
            });

        }
    }

}



export {

    GoCalculate1,
    GoCalculate2,
    GoCalculate3,
    GoCalculate5,
    GoCalculate6,
    GoCalculate7,
    GoCalculate10,

}