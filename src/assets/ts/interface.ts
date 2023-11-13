


interface GoStateBasic {
    deviceName: any,
    goType: number,
    goNumber: any,
}
interface GoState3_6_7_16_17 {
    Pc_0: any,
    Pc_1: any,
    Pc_2: any,
}
interface GoState1 {
    Pc_1: any,
    Pc_2: any,
}
interface GoState2 {
    inSignalsNumber: any,
}
interface GoState4 {
    signalNumber: any,
    signalCombinationValues: any,
    signalStatusValues: any,
}
interface GoState5 {
    signalStatusNumber: any,
    signalStatusValues: any,
}
interface GoState8 {
    statusNumber: any,
    statusValues: any,
}
interface GoState9 {
    differenceNumber: any,
    differenceValues: any,
}
interface GoState10 {
    inSignalsNumber: any,
}
interface GoState11 {
    inSignalsNumber: any,
    succeedNumber: any,
}
interface GoState12 {
    outSignalsNumber: any,
    outStatusValues: any,
}
interface GoState14 {
    inSignalsNumber: any,
    linearCoefficients: any,
}
interface GoState15 {
    V1: any,
    V2: any,
    V3: any,
    V4: any,
    P1: any,
    P2: any,
}

/*interface inOutValue{
    status: number,
    value: number,
    accumulationValue: number,
}*/

//initialSignalsCombinationOutValues
//statusValues
//[
//  { combinationStatusValues: [ { id: statusNumber: statusValue: }, { id: statusNumber: statusValue: }], statusValues: [ 0.9, 0.1 ] },
//  { combinationStatusValues: [ { id: statusNumber: statusValue: } ], statusValues: [ 0.9, 0.1 ] }
//  { combinationStatusValues: [ { id: statusNumber: statusValue: } ], statusValues: [ 0.9, 0.1 ] }
// ]
interface SignalStatusInfo {
    id: string,
    statusNumber: number,
    statusAccumulationValue: number,
    initialSignalAccumulationValue: number,
}
interface InitialSignalsCombinationOutValue {
    combinationStatusInfos: Array<SignalStatusInfo>;
    oneStatusAccumulationValueOutValue: number;
}


export {
    GoStateBasic,
    GoState3_6_7_16_17,
    GoState1,
    GoState2,
    GoState4,
    GoState5,
    GoState8,
    GoState9,
    GoState10,
    GoState11,
    GoState12,
    GoState14,
    GoState15,

    // inOutValue,
    SignalStatusInfo,
    InitialSignalsCombinationOutValue,

}