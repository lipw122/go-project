// import {
//     InitialSignalsCombinationOutValue,
//     SignalStatusInfo,
//
//     GoState1,
//     GoState2,
//     GoState3_6_7_16_17,
//     GoState5,
//     GoStateBasic,
// } from "@/assets/ts/interface";
//
// import { removeDuplicatesById, handleCombination, calculateResultAccumulation } from "@/assets/ts/MyUtils";
//
// import Decimal from "decimal.js"
//
//
//
//
//
//
//
//
//
// interface inOutValue{
//     status: number,
//     value: number,
//     accumulationValue: number,
// }
//
//
// const goState1: GoState1 = {
//     Pc_1: 0.9,
//     Pc_2: 0.1,
// };
// const goState3: GoState3_6_7_16_17 = {
//     Pc_0: 0.1,
//     Pc_1: 0.8,
//     Pc_2: 0.1,
// }
// const goState6: GoState3_6_7_16_17 = {
//     Pc_0: 0,
//     Pc_1: 0.9,
//     Pc_2: 0.1,
// }
// const goState7: GoState3_6_7_16_17 = {
//     Pc_0: 0,
//     Pc_1: 0.999,
//     Pc_2: 0.001,
// }
//
//
// const inValue1: Array<inOutValue> = [
//     {status: 0, value: 0, accumulationValue: 0},
//     {status: 1, value: 0.999, accumulationValue: 0.999},
//     {status: 2, value: 0.001, accumulationValue: 1},
// ];
// const inValue2: Array<inOutValue> = [
//     {status: 0, value: 0, accumulationValue: 0},
//     {status: 1, value: 0.99, accumulationValue: 0.99},
//     {status: 2, value: 0.01, accumulationValue: 1},
// ];
// const inValue7_1: Array<inOutValue> = [
//     {status: 0, value: 0, accumulationValue: 0},
//     {status: 1, value: 0.999, accumulationValue: 0.999},
//     {status: 2, value: 0.001, accumulationValue: 1},
// ];
// const inValue7_2: Array<inOutValue> = [
//     {status: 0, value: 0, accumulationValue: 0},
//     {status: 1, value: 0.99, accumulationValue: 0.99},
//     {status: 2, value: 0.01, accumulationValue: 1},
// ];
// const inValues : Array<Array<inOutValue>> = [
//     [
//         {status: 0, value: 0.95, accumulationValue: 0.95},
//         {status: 1, value: 0.0, accumulationValue: 0.95},
//         {status: 2, value: 0.0, accumulationValue: 0.95},
//         {status: 3, value: 0.05, accumulationValue: 1},
//     ],
//     [
//         {status: 0, value: 0, accumulationValue: 0},
//         {status: 1, value: 1, accumulationValue: 1},
//         {status: 2, value: 0, accumulationValue: 1},
//         {status: 3, value: 0, accumulationValue: 1},
//     ],
// ];
// const inValues2 : Array<Array<inOutValue>> = [
//     [
//         {status: 0, value: 0, accumulationValue: 0},
//         {status: 1, value: 0.8379855, accumulationValue: 0.8379855},
//         {status: 2, value: 0.1620145, accumulationValue: 1},
//     ],
//     [
//         {status: 0, value: 0, accumulationValue: 0},
//         {status: 1, value: 0.8379855, accumulationValue: 0.8379855},
//         {status: 2, value: 0.1620145, accumulationValue: 1},
//     ],
// ];
// const inValues10 : Array<Array<inOutValue>> = [
//     [
//         {status: 0, value: 0, accumulationValue: 0},
//         {status: 1, value: 0.85, accumulationValue: 0.85},
//         {status: 2, value: 0.15, accumulationValue: 1},
//     ],
//     [
//         {status: 0, value: 0, accumulationValue: 0},
//         {status: 1, value: 0.9, accumulationValue: 0.9},
//         {status: 2, value: 0.1, accumulationValue: 1},
//     ],
//     [
//         {status: 0, value: 0, accumulationValue: 0},
//         {status: 1, value: 0.7, accumulationValue: 0.7},
//         {status: 2, value: 0.3, accumulationValue: 1},
//     ],
// ];
//
//
// //1.两状态单元
// function out1Values(goState1: GoState1, inValues: Array<inOutValue>) : Array<inOutValue> {
//     const out = [];
//
//     //计算 0 ~ n-1 的累计概率 和 概率
//     for( let i = 0; i < (inValues.length - 1); i++){
//         out.push({
//             status: inValues[i].status,
//             value: inValues[i].value * goState1.Pc_1,
//             accumulationValue: inValues[i].accumulationValue * goState1.Pc_1,
//         });
//     }
//
//     //计算 n 的累计概率 和 概率
//     out.push({
//         status: inValues[ inValues.length - 1 ].status,
//         value: inValues[inValues.length-1].value * goState1.Pc_1 + goState1.Pc_2,
//         accumulationValue: 1,
//     });
//
//     return out;
// }
//
// //2.或门 （未修正！！！！！）
// function out2Values(array: Array<Array<inOutValue>>): Array<inOutValue> {
//     const out = [];
//
//     for (let i = 0; i < array[0].length; i++) {
//         out.push({
//             status: array[0][i].status,
//             value: 0,
//             accumulationValue: 1,
//         });
//     }
//
//     //计算 0 ~ n-1 （1-A）累乘
//     for (let i = 0; i < out.length - 1 ; i++) {
//         for (let j = 0; j < array.length; j++) {
//             //
//             out[i].accumulationValue *= ( 1 - array[j][i].accumulationValue );
//         }
//     }
//     //计算 0 ~ n-1  1 - 累乘
//     for (let i = 0; i < out.length - 1 ; i++) {
//         out[i].accumulationValue = 1 - out[i].accumulationValue;
//     }
//
//
//     //计算状态概率
//     out[0].value = out[0].accumulationValue;
//     for (let i = 1; i < (out.length -1) ; i++) {
//         out[i].value = out[i].accumulationValue - out[i-1].accumulationValue;
//     }
//     let value_n = 1;
//     for (let i = 0; i < array.length; i++) {
//         value_n *= array[i][out.length-1].value;
//     }
//     out[out.length-1].value = value_n;
//
//     return out;
// }
//
// //3.触发发生器 (使用decimal.js)
// function out3Values(goState3: GoState3_6_7_16_17, inValues: Array<inOutValue>) : Array<inOutValue> {
//     const out = [];
//
//     //计算 0 ~ n-1 的累计概率和  1 ~ n-1 的概率
//     for (let i = 0; i < inValues.length - 1; i++) {
//         out.push({
//             status: inValues[i].status,
//             value: new Decimal(inValues[i].value).mul(new Decimal(goState3.Pc_1)).toNumber(),
//             accumulationValue: new Decimal(goState3.Pc_0).add(new Decimal(inValues[i].accumulationValue).mul(new Decimal(goState3.Pc_1))).toNumber() ,
//         });
//     }
//
//     //计算 n 的累计概率和概率
//     out.push({
//         status: inValues[ inValues.length - 1 ].status,
//         value: new Decimal(new Decimal(inValues[ inValues.length - 1 ].value).mul(new Decimal(goState3.Pc_1))).add(new Decimal(goState3.Pc_2)).toNumber(),
//         accumulationValue: 1,
//     });
//
//     //计算 0 的概率
//     out[0].value = new Decimal(goState3.Pc_0).add(new Decimal(inValues[0].value).mul(new Decimal(goState3.Pc_1))).toNumber();
//
//
//     /*
//         //计算 0 ~ n-1 的累计概率和  1 ~ n-1 的概率
//         for (let i = 0; i < inValues.length - 1; i++) {
//             out.push({
//                 status: inValues[i].status,
//                 value: inValues[i].value  * goState3.Pc_1,
//                 accumulationValue: goState3.Pc_0 + inValues[i].accumulationValue * goState3.Pc_1,
//             });
//         }
//
//         //计算 n 的累计概率和概率
//         out.push({
//             status: inValues[ inValues.length - 1 ].status,
//             value: inValues[ inValues.length - 1 ].value * goState3.Pc_1 + goState3.Pc_2,
//             accumulationValue: 1,
//         });*/
//
//     //计算 0 的概率
//     out[0].value = goState3.Pc_0 + inValues[0].value * goState3.Pc_1;
//
//     return out;
// }
//
// //6.有信号而导通的元件
// function out6Values(goState6: GoState3_6_7_16_17, inValues1: Array<inOutValue>, inValues2: Array<inOutValue>) : Array<inOutValue>{
//     const out = [];
//
//     //计算 0 ~ n-1 的累计概率
//     for(let i = 0; i < ( inValues1.length - 1 ); i++){
//
//         const accumulationValue = inValues1[i].accumulationValue *
//             ( goState6.Pc_0 + inValues2[i].accumulationValue * goState6.Pc_1);
//
//         out.push({
//             status: inValues1[i].status,
//             value: 0,
//             accumulationValue: accumulationValue,
//         });
//     }
//
//     //计算 n 的累计概率 和 概率
//     out.push({
//         status: inValues1[inValues1.length-1].status,
//         value: inValues1[inValues1.length - 1].value  +
//             inValues1[inValues1.length - 2].accumulationValue *
//             ( goState6.Pc_2 + inValues2[inValues2.length - 1].value *  goState6.Pc_1),
//         accumulationValue: 1,
//     });
//
//     //计算 0 的概率
//     out[0].value = out[0].accumulationValue;
//
//     //计算 1 ~ n-1 的概率
//     for(let i = 1; i < ( inValues1.length - 2 ); i++){
//         out[i].value = out[i].accumulationValue - out[i-1].accumulationValue;
//     }
//
//     return out;
// }
//
// //7.有信号而关断的元件
// function out7Values(goState7: GoState3_6_7_16_17, inValues1: Array<inOutValue>, inValues2: Array<inOutValue>) : Array<inOutValue> {
//
//     const out = [];
//     //计算 0 ~ n-1 的概率
//     for (let i = 0; i < (inValues1.length-1); i++) {
//         const temp = new Decimal(new Decimal(new Decimal(inValues1[i].value)
//             .mul(new Decimal(1).minus(new Decimal(inValues2[i].accumulationValue))))
//             .mul(new Decimal(goState7.Pc_1))).add(new Decimal(inValues1[i].value)
//             .mul(new Decimal(goState7.Pc_2)))
//             .toNumber();
//         out.push({
//             status: inValues1[i].status,
//             // value: inValues1[i].value * ( 1 - inValues2[i].accumulationValue ) * goState7.Pc_1 + inValues1[i].value * goState7.Pc_2,
//             value: temp,
//             accumulationValue: 1,
//         });
//     }
//
//     //计算 n 的 概率 和 累计概率
//     let temp_num = 0;
//     for (let i = 0; i < inValues1.length; i++) {
//         // temp_num = temp_num + inValues1[i].value * inValues2[i].accumulationValue * goState7.Pc_1;
//         temp_num = new Decimal(temp_num)
//             .add(new Decimal(inValues1[i].value)
//                 .mul(inValues2[i].accumulationValue)
//                 .mul(new Decimal(goState7.Pc_1))).toNumber();
//     }
//     out.push({
//         status: inValues1[inValues1.length-1].status,
//         // value: temp_num + goState7.Pc_0 + inValues1[inValues1.length-1].value * goState7.Pc_2,
//         value: new Decimal(temp_num)
//             .add(new Decimal(goState7.Pc_0))
//             .add(new Decimal(inValues1[inValues1.length-1].value)
//                 .mul(new Decimal(goState7.Pc_2))).toNumber(),
//         accumulationValue: 1,
//     });
//
//     //计算 0 ~ n-1 的 累计概率
//     for (let i = 0; i < (out.length - 1); i++) {
//         let temp_accumulationValue = 0;
//
//         for (let j = 0; j <= i; j++) {
//             // temp_accumulationValue = temp_accumulationValue + inValues1[j].value * inValues2[j].accumulationValue * goState7.Pc_1;
//             temp_accumulationValue = new Decimal(temp_accumulationValue)
//                 .add(new Decimal(new Decimal(inValues1[j].value)
//                     .mul(new Decimal(inValues2[j].accumulationValue))
//                     .mul(new Decimal(goState7.Pc_1))))
//                 .toNumber();
//         }
//
//         // out[i].accumulationValue = inValues1[i].accumulationValue * ( goState7.Pc_1 + goState7.Pc_2 ) - temp_accumulationValue;
//         out[i].accumulationValue = new Decimal(new Decimal(inValues1[i].accumulationValue)
//             .mul(new Decimal(goState7.Pc_1)
//                 .add(new Decimal(goState7.Pc_2))))
//             .minus(new Decimal(temp_accumulationValue))
//             .toNumber();
//     }
//
//     return out;
// }
//
// //10.与门
// function out10Values( array: Array<Array<inOutValue>> ): Array<inOutValue> {
//     const out = [];
//
//     //计算 0 ~ n - 1 的累积概率
//     for (let i = 0; i < array[0].length - 1; i++) {
//         let tempA = 1;
//         for (let j = 0; j < array.length; j++) {
//             tempA = tempA * array[j][i].accumulationValue;
//         }
//         out.push({
//             status: array[0][i].status,
//             value: 0,
//             accumulationValue: tempA,
//         });
//     }
//
//     //计算 n 的累积概率
//     out.push({
//         status: array[0].length-1,
//         value: 0,
//         accumulationValue: 1,
//     });
//
//     //计算 0 的概率
//     out[0].value = out[0].accumulationValue;
//
//     //计算 1 ~ n - 1 的概率
//     for (let i = 1; i < array[0].length - 1; i++) {
//         out[i].value = out[i].accumulationValue - out[i-1].accumulationValue;
//     }
//
//     //计算 n 的概率
//     out[array[0].length-1].value = 1 - out[array[0].length-2].accumulationValue
//
//     return out;
// }
//
//
// console.log('1--------------->');
// console.log( out1Values(goState1, inValue1) );
//
// console.log('2--------------->');
// console.log( out2Values ( inValues2 ) );
//
// console.log('3--------------->');
// console.log( out3Values ( goState3, inValue1 ) );
//
// console.log('6--------------->');
// console.log(out6Values(goState6, inValues[0], inValues[1]));
//
// console.log('7--------------->');
// console.log(out7Values(goState7, inValue7_1, inValue7_2));
//
// console.log('10--------------->');
// console.log( out10Values ( inValues10 ) );
//
//
//
// console.log('test--------------->');
// console.log(new Decimal(0.1).add(new Decimal(0.2)).mul(new Decimal(0.1)).toNumber());
//
// console.log("验证---------------------->");
// const inValue_5_1 = [
//     {status: 0, value: 0, accumulationValue: 0},
//     {status: 1, value: 0.9, accumulationValue: 0.9},
//     {status: 2, value: 0.1, accumulationValue: 1},
// ];
// //共有信号状态值 0 的计算
// const inValue_5_1_0_0 = [
//     {status: 0, value: 0, accumulationValue: 0},
//     {status: 1, value: 0.9, accumulationValue: 0.9},
//     {status: 2, value: 0.1, accumulationValue: 1},
// ];
// //共有信号状态值 0 的计算
// const inValue_5_1_0_1 = [
//     {status: 0, value: 1, accumulationValue: 1},
//     {status: 1, value: 0, accumulationValue: 1},
//     {status: 2, value: 0, accumulationValue: 1},
// ];
//
// //共有信号状态值 1 的计算
// const inValue_5_1_1_0 = [
//     {status: 0, value: 0, accumulationValue: 0},
//     {status: 1, value: 0, accumulationValue: 0},
//     {status: 2, value: 1, accumulationValue: 1},
// ];
// //共有信号状态值 1 的计算
// const inValue_5_1_1_1 = [
//     {status: 0, value: 0, accumulationValue: 0},
//     {status: 1, value: 1, accumulationValue: 1},
//     {status: 2, value: 0, accumulationValue: 1},
// ];
//
//
// const inValue_5_2 = [
//     {status: 0, value: 0, accumulationValue: 0},
//     {status: 1, value: 0.9, accumulationValue: 0.9},
//     {status: 2, value: 0.1, accumulationValue: 1},
// ];
// const goState_6_3 = {
//     Pc_0: 0,
//     Pc_1: 0.9,
//     Pc_2: 0.1,
// };
// const goState_1_4 = {
//     Pc_1: 0.9,
//     Pc_2: 0.1,
// }
// const outValue_6_3 = out6Values(goState_6_3, inValue_5_1, inValue_5_2);
// const outValue_1_4 = out1Values(goState_1_4, inValue_5_1);
//
// //状态值 0 的计算
// const outValue_6_3_0_0 = out6Values(goState_6_3, inValue_5_1_0_0, inValue_5_2);
// const outValue_1_4_0_0 = out1Values(goState_1_4, inValue_5_1_0_0);
// const outValue_6_3_0_1 = out6Values(goState_6_3, inValue_5_1_0_1, inValue_5_2);
// const outValue_1_4_0_1 = out1Values(goState_1_4, inValue_5_1_0_1);
//
// //状态值 1 的计算
// const outValue_6_3_1_0 = out6Values(goState_6_3, inValue_5_1_1_0, inValue_5_2);
// const outValue_1_4_1_0 = out1Values(goState_1_4, inValue_5_1_1_0);
// const outValue_6_3_1_1 = out6Values(goState_6_3, inValue_5_1_1_1, inValue_5_2);
// const outValue_1_4_1_1 = out1Values(goState_1_4, inValue_5_1_1_1);
//
// console.log(outValue_6_3);
// console.log(outValue_1_4);
//
// const outValue_2_5 = out2Values([outValue_6_3, outValue_1_4]);
//
// const outValue_2_5_0_0 = out2Values([outValue_6_3_0_0, outValue_1_4_0_0]);
// const outValue_2_5_0_1 = out2Values([outValue_6_3_0_1, outValue_1_4_0_1]);
//
// const outValue_2_5_1_0 = out2Values([outValue_6_3_1_0, outValue_1_4_1_0]);
// const outValue_2_5_1_1 = out2Values([outValue_6_3_1_1, outValue_1_4_1_1]);
//
//
// console.log("修正状态值 0 ------------>");   //As(0) = 0
// const Ar_0 = ( 1 - 0 ) * outValue_2_5_0_0[0].accumulationValue + 0 * outValue_2_5_0_1[0].accumulationValue;
// console.log("修正状态值 1 ------------>");   //As(1) = 0.9
// const Ar_1 = ( 1 - 0.9 ) * outValue_2_5_1_0[1].accumulationValue + 0.9 * outValue_2_5_1_1[1].accumulationValue;
//
// console.log("未修正---->");
// console.log(outValue_2_5);
// console.log( "修正Ar(0):" + Ar_0 );
// console.log( "修正Ar(1):" + Ar_1 );
//
//
// class A {
//     id: string;
//     print1() {
//         console.log("这是A");
//     }
// }
// class B extends A {
//     id: string;
//     print1() {
//         console.log("这是B");
//         super.print1();
//         this.id = "B_id";
//     }
// }
// abstract class C {
//     abstract print2(): void;
//     abstract print3(): void;
//     prePrint() {
//         this.print2();
//     }
// }
// class D extends C {
//     print2(): void {
//         console.log("D_2")
//     }
//
//     print3(): void {
//         console.log("D_3");
//     }
//
// }
// const d = new D();
// d.prePrint();
//
//
//
//
//
//
