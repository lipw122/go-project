import {GoFlowStateBasic} from "@/assets/ts/interface";


export abstract class BasicGoFlowCalculate {
    id: string;
    basic: GoFlowStateBasic;

    timePoint: number;  //当前时间点
    allTimePointValueArray: number[];   //每个时间点的持续时间（数组）


    outValue: number;
    //运算符 1、3、
    inValue: number;
    //运算符 2、10、
    inValueArray: number[];
    //运算符 6、7、
    inValue1: number;
    inValue2: number;  // 操作符39的导通信号
    inValue3: number;  // 操作符39的关闭信号


    //[1]运算符通用计算
    abstract calculateOutValues(): number;

    //[2](暂不考虑)前序工作已处理好，运算最终结果
    calculateCombinationOutValuesResult (): void {
        return;
    }


}