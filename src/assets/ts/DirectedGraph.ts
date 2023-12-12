import {GoCalculate5} from "@/assets/ts/GoCalculate";
import {generateVariableCombinations, removeDuplicatesById} from "@/assets/ts/MyUtils";
import {SignalStatusInfo} from "@/assets/ts/interface";
import Decimal from "decimal.js"

class GoGraph {
    private nodes;
    // private inputNodes = [];
    // private operationNodes = [];
    // private edges: Array<any>;
    // private adjacentNodes: Array<any>;

    constructor() {
        this.nodes = new Map();
        /*this.inputNodes = new Map();
        this.operationNodes = new Map();*/
    }

    getNodes() {
        return this.nodes;
    }

    clearNode():void {
        this.nodes.clear();
    }

    addNode(node):void {
        this.nodes.set(node.id, node);
    }

    connectNodes(sourceId, targetId, targetPort):void {
        const node1 = this.nodes.get(sourceId);
        const node2 = this.nodes.get(targetId);

        /*console.log(node1);
        console.log(node2);*/
        if (node1 && node2) {
            let isHas = false;
            //判断  adjacentNodes 是否存在 要加入的节点
            for (let i = 0; i < node1.adjacentNodes.length; i++) {
                if( node1.adjacentNodes[i].id === node2.id){
                    isHas = true;
                }
            }
            if(!isHas){
                // node1.adjacentNodes.push(node2);
                node1.adjacentNodes.push( {'id': targetId, 'port': targetPort} );
            }

            //判断  preAdjacentNodes 是否存在 要加入的节点
            isHas = false;
            for (let i = 0; i < node2.preAdjacentNodes.length; i++) {
                if( node2.preAdjacentNodes[i].id === node1.id){
                    isHas = true;
                }
            }
            if(!isHas){
                // node1.adjacentNodes.push(node2);
                node2.preAdjacentNodes.push( {'id': sourceId, 'port': "targetPort未设置"} );
            }

        }
    }

    //[2.1] 基础运算
    calculate():void {

        const inputNodeMap = new Map();
        const operationNodeMap = new Map();

        this.nodes.forEach( ( value, key )=>{
            if ( value.basic.goType === 5 ) {
                inputNodeMap.set( key, value );
            }
            else {
                operationNodeMap.set( key, value );
            }
        });

        //【第一步】循环计算 初始 所有信号发生器
        inputNodeMap.forEach( ( inputNodeMapValue, inputNodeMapKey )=>{

            //计算所有的 信号发生器5   规范 outValues
            inputNodeMapValue.setOutValues();

            //循环所有 inputNode[i].adjacentNodes 中的所有id
            for (let k = 0; k < inputNodeMapValue.adjacentNodes.length; k++) {

                const tempOperationNode = operationNodeMap.get( inputNodeMapValue.adjacentNodes[k].id );

                if ( inputNodeMapValue.adjacentNodes[k].port === "in") {
                    tempOperationNode.setInValues( inputNodeMapValue.getOutValues() );
                    //传递初始信号
                    tempOperationNode.addInitialSignal( inputNodeMapValue.initialSignal );
                }
                else if ( inputNodeMapValue.adjacentNodes[k].port === "in1") {
                    tempOperationNode.setInValues1( inputNodeMapValue.getOutValues() );
                    //传递初始信号
                    tempOperationNode.addInitialSignal( inputNodeMapValue.initialSignal );
                }
                else if ( inputNodeMapValue.adjacentNodes[k].port === "in2") {
                    tempOperationNode.setInValues2( inputNodeMapValue.getOutValues() );
                    //传递初始信号
                    tempOperationNode.addInitialSignal( inputNodeMapValue.initialSignal );
                }

            }


        });

        //【第二步】循环计算 初始 所有 非 信号发生器
        let calculateWhile = 0;
        while ( operationNodeMap.size > 0) {
            calculateWhile++;

            //循环所有运算节点
            operationNodeMap.forEach( ( operationNodeMapValue, operationNodeMapKey )=>{

                //如果该节点 outValues 不为空，则循环将 outValues 添加到 邻接节点的 inValues
                if ( operationNodeMapValue.outValues && operationNodeMapValue.outValues.length > 0 ) {
                    //遍历所有后续节点
                    for (let j = 0; j < operationNodeMapValue.adjacentNodes.length; j++) {

                        const tempOperationNode = operationNodeMap.get( operationNodeMapValue.adjacentNodes[j].id );

                        if ( operationNodeMapValue.adjacentNodes[j].port === 'in' ) {
                            tempOperationNode.setInValues(operationNodeMapValue.getOutValues());
                            tempOperationNode.addInitialSignals( operationNodeMapValue.initialSignals );
                        }
                        else if ( operationNodeMapValue.adjacentNodes[j].port === 'in1' ) {
                            tempOperationNode.setInValues1(operationNodeMapValue.getOutValues());
                            tempOperationNode.addInitialSignals( operationNodeMapValue.initialSignals );
                        }
                        else if ( operationNodeMapValue.adjacentNodes[j].port === 'in2' ) {
                            tempOperationNode.setInValues2(operationNodeMapValue.getOutValues());
                            tempOperationNode.addInitialSignals( operationNodeMapValue.initialSignals );
                        }

                        operationNodeMap.delete( operationNodeMapKey );

                    }
                }

            });

            if ( calculateWhile > 1000){
                break;
            }

        }

    }
    //[2.2] _combinationStatusInfos运算
    calculateCombination( _combinationStatusInfos: Array<SignalStatusInfo> ): void {

        const inputNodeMap = new Map();
        const operationNodeMap = new Map();

        this.nodes.forEach( ( value, key )=>{
            if ( value.basic.goType === 5 ) {
                inputNodeMap.set( key, value );
            }
            else {
                operationNodeMap.set( key, value );
            }
        });


        //【第一步】循环计算 （组合） 所有信号发生器
        inputNodeMap.forEach( ( inputNodeMapValue, inputNodeMapKey )=>{

            inputNodeMapValue.setTempOutValues( _combinationStatusInfos );

            //循环所有 inputNode[i].adjacentNodes 中的所有id
            for (let k = 0; k < inputNodeMapValue.adjacentNodes.length; k++) {

                const tempOperationNode = operationNodeMap.get( inputNodeMapValue.adjacentNodes[k].id );

                if ( inputNodeMapValue.adjacentNodes[k].port === "in") {
                    tempOperationNode.setAmendCommonSignalUniversalInValues( inputNodeMapValue.getOutValues(), _combinationStatusInfos );
                }
                else if ( inputNodeMapValue.adjacentNodes[k].port === "in1") {
                    tempOperationNode.setAmendCommonSignalUniversalInValues1( inputNodeMapValue.getOutValues(), _combinationStatusInfos );
                }
                else if ( inputNodeMapValue.adjacentNodes[k].port === "in2") {
                    tempOperationNode.setAmendCommonSignalUniversalInValues2( inputNodeMapValue.getOutValues(), _combinationStatusInfos );
                }

            }

        });


        //【第二步】循环计算 （组合） 所有 非 信号发生器
        let calculateCombinationWhile = 0;
        while ( operationNodeMap.size > 0) {
            calculateCombinationWhile++;

            //循环所有运算节点
            operationNodeMap.forEach( ( operationNodeMapValue, operationNodeMapKey )=>{

                //如果该节点 outValues 不为空，则循环将 outValues 添加到 邻接节点的 inValues
                if ( operationNodeMapValue.outValues && operationNodeMapValue.outValues.length > 0 ) {
                    //遍历所有后续节点
                    for (let j = 0; j < operationNodeMapValue.adjacentNodes.length; j++) {

                        if ( operationNodeMapValue.outValues && operationNodeMapValue.outValues.length > 0 ) {

                            const tempOperationNode = operationNodeMap.get( operationNodeMapValue.adjacentNodes[j].id );

                            if ( operationNodeMapValue.adjacentNodes[j].port === 'in' ) {
                                tempOperationNode.setAmendCommonSignalUniversalInValues( operationNodeMapValue.getOutValues(),  _combinationStatusInfos);
                            }
                            else if ( operationNodeMapValue.adjacentNodes[j].port === 'in1' ) {
                                tempOperationNode.setAmendCommonSignalUniversalInValues1( operationNodeMapValue.getOutValues(),  _combinationStatusInfos);
                            }
                            else if ( operationNodeMapValue.adjacentNodes[j].port === 'in2' ) {
                                tempOperationNode.setAmendCommonSignalUniversalInValues2( operationNodeMapValue.getOutValues(),  _combinationStatusInfos);
                            }

                        }

                        operationNodeMap.delete( operationNodeMapKey );

                    }
                }

            });

            if ( calculateCombinationWhile > 1000){
                break;
            }

        }

    }
    //[2.3]循环运算所有 (组合运算后) 结果
    calculateAllCombinationOutValuesResult(): void {
        const inputNode = [];
        const operationNode = [];
        this.nodes.forEach((value, key)=>{
            if ( value.basic.goType === 5 ) {
                inputNode.push(value);
            }
            else {
                operationNode.push(value);
            }
        });

        for (let i = 0; i < operationNode.length; i++) {
            console.log("循环运算所有operationNode结果");
            operationNode[i].calculateCombinationOutValuesResult();
        }
        for (let i = 0; i < inputNode.length; i++) {
            console.log("循环运算所有inputNode结果");
            inputNode[i].calculateCombinationOutValuesResult();
        }

    }


    //[3.1]循环清除所有输出信号
    clearAllOutValues(): void {
        const inputNode = [];
        const operationNode = [];
        this.nodes.forEach((value, key)=>{
            if ( value.basic.goType === 5 ) {
                inputNode.push(value);
            }
            else {
                operationNode.push(value);
            }
        });

        for (let i = 0; i < inputNode.length; i++) {
            inputNode[i].clearOutValues();
        }
        for (let i = 0; i < operationNode.length; i++) {
            operationNode[i].clearOutValues();
        }

    }
    //[3.2]循环清除所有输入信号
    clearAllInValues(): void {
        const inputNode = [];
        const operationNode = [];
        this.nodes.forEach((value, key)=>{
            if ( value.basic.goType === 5 ) {
                inputNode.push(value);
            }
            else {
                operationNode.push(value);
            }
        });

        for (let i = 0; i < operationNode.length; i++) {
            operationNode[i].clearInValues();
        }

    }

    //[4.1]循环去重获取 noDuplicateInitialSignals
    removeDuplicatesInitialSignals(): void {
        const inputNode = [];
        const operationNode = [];
        this.nodes.forEach((value, key)=>{
            if ( value.basic.goType === 5 ) {
                inputNode.push(value);
            }
            else {
                operationNode.push(value);
            }
        });

        for (let i = 0; i < operationNode.length; i++) {
            operationNode[i].noDuplicateInitialSignals = removeDuplicatesById( operationNode[i].initialSignals );
        }
    }
    //[4.2]通过 所有信号发生器 获取 所有 组合
    getCombinationSignals():Array<Array<SignalStatusInfo>> {

        const inputNode = [];
        const operationNode = [];
        this.nodes.forEach((value, key)=>{
            if ( value.basic.goType === 5 ) {
                inputNode.push(value);
            }
            else {
                operationNode.push(value);
            }
        });

        const statusNumber = inputNode[0].goState.signalStatusNumber;
        const signalNumber = inputNode.length;
        // console.log(signalNumber);
        // console.log(statusNumber);


        const variableCombinations = generateVariableCombinations(signalNumber, statusNumber);
        console.log(variableCombinations);

        //设置 循环信号
        const _allSignalStatusInfos:Array<Array<SignalStatusInfo>> = [];
        //循环信号
        for (let i = 0; i < statusNumber; i++) {
            // console.log( variableCombinations[ `status_${i}` ] );

            for (let j = 0; j < variableCombinations[ `status_${i}` ].length; j++) {
                // console.log( variableCombinations[ `status_${i}` ][j] );
                const _signalStatusInfos:Array<SignalStatusInfo> = [];
                //循环所有信号，获取信号信息
                for (let k = 0; k < signalNumber; k++) {
                    let accumulation = 0;
                    //循环状态
                    for (let l = 0; l < i + 1 ; l++) {
                        //inputNode[k].basic.goState.signalStatusValues.length
                        // accumulation = accumulation + Number(inputNode[k].goState.signalStatusValues[l].value);
                        accumulation = new Decimal(accumulation)
                            .add(new Decimal(Number(inputNode[k].goState.signalStatusValues[l].value))).toNumber();
                    }

                    const _signalStatusInfo: SignalStatusInfo = {
                        id: inputNode[k].id,
                        statusNumber: i,
                        statusAccumulationValue: variableCombinations[ `status_${i}` ][j][k],
                        initialSignalAccumulationValue: accumulation,
                    };
                    _signalStatusInfos.push(_signalStatusInfo);
                }
                _allSignalStatusInfos.push(_signalStatusInfos);
            }
        }

        return _allSignalStatusInfos;
    }

    //组合信号发生器 循环计算
    amendCommonSignalUniversalCalculate(): void {
        console.log("correctionCommonSignalCalculate--------->");

        //假设有 n 个信号发生器， 状态数都为 m 个
        //则 共许进行 m * 2 ^ n 次 运算；

        const inputNode = [];
        const operationNode = [];
        this.nodes.forEach((value, key)=>{
            if ( value.basic.goType === 5 ) {
                inputNode.push(value);
            }
            else {
                operationNode.push(value);
            }
        });

        const statusNumber = inputNode[0].goState.signalStatusNumber;
        const signalNumber = inputNode.length;
        // console.log(signalNumber);
        // console.log(statusNumber);


        const variableCombinations = generateVariableCombinations(signalNumber, statusNumber);
        console.log(variableCombinations);

        //设置 循环信号
        const _allSignalStatusInfos:Array<Array<SignalStatusInfo>> = [];
        //循环信号
        for (let i = 0; i < statusNumber; i++) {
            // console.log( variableCombinations[ `status_${i}` ] );

            for (let j = 0; j < variableCombinations[ `status_${i}` ].length; j++) {
                // console.log( variableCombinations[ `status_${i}` ][j] );
                const _signalStatusInfos:Array<SignalStatusInfo> = [];
                //循环所有信号，获取信号信息
                for (let k = 0; k < signalNumber; k++) {
                    let accumulation = 0;
                    //循环状态
                    for (let l = 0; l < i + 1 ; l++) {
                        //inputNode[k].basic.goState.signalStatusValues.length
                        // accumulation = accumulation + Number(inputNode[k].goState.signalStatusValues[l].value);
                        accumulation = new Decimal(accumulation)
                            .add(new Decimal(Number(inputNode[k].goState.signalStatusValues[l].value))).toNumber();
                    }

                    const _signalStatusInfo: SignalStatusInfo = {
                        id: inputNode[k].id,
                        statusNumber: i,
                        statusAccumulationValue: variableCombinations[ `status_${i}` ][j][k],
                        initialSignalAccumulationValue: accumulation,
                    };
                    _signalStatusInfos.push(_signalStatusInfo);
                }
                _allSignalStatusInfos.push(_signalStatusInfos);
            }
        }

        //所有的 （组合）
        // console.log(_allSignalStatusInfos);

    }

}



export {
    GoGraph
}
