import {GoCalculate5} from "@/assets/ts/GoCalculate";
import {generateVariableCombinations, removeDuplicatesById} from "@/assets/ts/MyUtils";
import {SignalStatusInfo} from "@/assets/ts/interface";
import Decimal from "decimal.js"





class DirectedGraph {

    private nodes: { [key: string]: string[] };

    constructor() {
        this.nodes = {};
    }

    addNode(node: string): void {
        if (!this.nodes[node]) {
            this.nodes[node] = [];
        }
    }

    addEdge(source: string, target: string): void {
        if (!this.nodes[source] || !this.nodes[target]) {
            throw new Error('Node does not exist');
        }

        this.nodes[source].push(target);
    }

    getNeighbors(node: string): string[] {
        if (!this.nodes[node]) {
            throw new Error('Node does not exist');
        }

        return this.nodes[node];
    }

    hasEdge(source: string, target: string): boolean {
        if (!this.nodes[source] || !this.nodes[target]) {
            return false;
        }

        return this.nodes[source].includes(target);
    }

    removeNode(node: string): void {
        if (!this.nodes[node]) {
            throw new Error('Node does not exist');
        }

        delete this.nodes[node];

        for (const n in this.nodes) {
            this.nodes[n] = this.nodes[n].filter(target => target !== node);
        }
    }

    removeEdge(source: string, target: string): void {
        if (!this.nodes[source] || !this.nodes[target]) {
            throw new Error('Node does not exist');
        }

        this.nodes[source] = this.nodes[source].filter(node => node !== target);
    }
}


class GoGraph {
    private nodes;
    private inputNodes = [];
    private operationNodes = [];
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

        //循环所有 信号发生器5 节点
        for (let i = 0; i < inputNode.length; i++) {
            //计算所有的 信号发生器5   规范 outValues
            inputNode[i].setOutValues();

            //将 信号发生器5 outValues 传到 所连接的 adjacentNodes 节点中 作为  inValues
            //循环所有 operationNode 中的所有 id
            for (let j = 0; j < operationNode.length; j++) {
                //循环所有 inputNode[i].adjacentNodes 中的所有id
                for (let k = 0; k < inputNode[i].adjacentNodes.length; k++) {
                    // 判断是否匹配到，匹配到就 赋值！！！！！！！！！！！！！！！！！！！！
                    if ( operationNode[j].id === inputNode[i].adjacentNodes[k].id ) {
                        // console.log("找到了");
                        // console.log( inputNode[i].adjacentNodes[k].port);
                        if ( inputNode[i].adjacentNodes[k].port === "in") {
                            operationNode[j].setInValues( inputNode[i].getOutValues() );

                            //传递初始信号
                            operationNode[j].addInitialSignal( inputNode[i].initialSignal );
                        }
                        else if ( inputNode[i].adjacentNodes[k].port === "in1" ) {
                            operationNode[j].setInValues1( inputNode[i].getOutValues() );

                            //传递初始信号
                            operationNode[j].addInitialSignal( inputNode[i].initialSignal );
                        }
                        else if ( inputNode[i].adjacentNodes[k].port === "in2" ) {
                            operationNode[j].setInValues2( inputNode[i].getOutValues() );

                            //传递初始信号
                            operationNode[j].addInitialSignal( inputNode[i].initialSignal );
                        }

                    }
                }
            }

        }

        while ( operationNode.length > 0) {
            // console.log( "operationNode.length:" + operationNode.length);
            //循环所有运算节点
            for (let i = 0; i < operationNode.length; i++) {
                //如果该节点 outValues 不为空，则循环将 outValues 添加到 邻接节点的 inValues
                if ( operationNode[i].outValues ) {
                    // console.log("找到了 非空out");
                    // console.log(operationNode[i].outValues);
                    // j是所有邻接节点
                    for (let j = 0; j < operationNode[i].adjacentNodes.length; j++) {
                        // k是所有节点
                        for (let k = 0; k < operationNode.length; k++) {
                            if ( operationNode[k].id ===  operationNode[i].adjacentNodes[j].id &&
                                operationNode[i].adjacentNodes[j].port === 'in') {

                                operationNode[k].setInValues(operationNode[i].outValues);
                                operationNode[k].addInitialSignals( operationNode[i].initialSignals );

                            }
                            else if (operationNode[k].id ===  operationNode[i].adjacentNodes[j].id &&
                                operationNode[i].adjacentNodes[j].port === 'in1') {

                                operationNode[k].setInValues1(operationNode[i].outValues);
                                operationNode[k].addInitialSignals( operationNode[i].initialSignals );

                            }
                            else if (operationNode[k].id ===  operationNode[i].adjacentNodes[j].id &&
                                operationNode[i].adjacentNodes[j].port === 'in2') {

                                operationNode[k].setInValues2(operationNode[i].outValues);
                                operationNode[k].addInitialSignals( operationNode[i].initialSignals );

                            }


                        }

                    }

                    // console.log(operationNode[i]);
                    operationNode.splice(i, 1);

                }

            }

        }

    }
    //[2.2] _combinationStatusInfos运算
    calculateCombination( _combinationStatusInfos: Array<SignalStatusInfo> ): void {
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

        //循环所有 信号发生器5 节点
        for (let i = 0; i < inputNode.length; i++) {
            //计算所有的 信号发生器5   规范 outValues

            // inputNode[i].setOutValues();
            inputNode[i].setTempOutValues( _combinationStatusInfos );

            //将 信号发生器5 outValues 传到 所连接的 adjacentNodes 节点中 作为  inValues
            //循环所有 operationNode 中的所有 id
            for (let j = 0; j < operationNode.length; j++) {
                //循环所有 inputNode[i].adjacentNodes 中的所有id
                for (let k = 0; k < inputNode[i].adjacentNodes.length; k++) {
                    // 判断是否匹配到，匹配到就 赋值！！！！！！！！！！！！！！！！！！！！
                    if ( operationNode[j].id === inputNode[i].adjacentNodes[k].id ) {
                        // console.log("找到了");
                        // console.log( inputNode[i].adjacentNodes[k].port);
                        if ( inputNode[i].adjacentNodes[k].port === "in") {

                            operationNode[j].setAmendCommonSignalUniversalInValues( inputNode[i].getOutValues(), _combinationStatusInfos );

                        }
                        else if ( inputNode[i].adjacentNodes[k].port === "in1" ) {

                            operationNode[j].setAmendCommonSignalUniversalInValues1( inputNode[i].getOutValues(), _combinationStatusInfos );

                        }
                        else if ( inputNode[i].adjacentNodes[k].port === "in2" ) {

                            operationNode[j].setAmendCommonSignalUniversalInValues2( inputNode[i].getOutValues(), _combinationStatusInfos );

                        }

                    }
                }
            }

        }

        const startTime = Date.now();

        while ( operationNode.length > 0) {
            console.log("while------------->");
            const currentTime = Date.now();
            const elapsedTime = currentTime - startTime;
            if (elapsedTime >= 100) {
                operationNode.splice(0, operationNode.length);
                break;
            }

            // console.log( "operationNode.length:" + operationNode.length);
            //循环所有运算节点
            for (let i = 0; i < operationNode.length; i++) {
                //如果该节点 outValues 不为空，则循环将 outValues 添加到 邻接节点的 inValues
                if ( operationNode[i].outValues && operationNode[i].outValues.length > 0 ) {
                    // console.log("找到了 非空out");
                    // console.log( operationNode[i].outValues.length > 0 );
                    // j是所有邻接节点
                    for (let j = 0; j < operationNode[i].adjacentNodes.length; j++) {
                        // k是所有节点
                        for (let k = 0; k < operationNode.length; k++) {
                            if ( operationNode[k].id ===  operationNode[i].adjacentNodes[j].id &&
                                operationNode[i].adjacentNodes[j].port === 'in') {

                                operationNode[k].setAmendCommonSignalUniversalInValues( operationNode[i].getOutValues(),  _combinationStatusInfos);

                            }
                            else if (operationNode[k].id ===  operationNode[i].adjacentNodes[j].id &&
                                operationNode[i].adjacentNodes[j].port === 'in1') {

                                operationNode[k].setAmendCommonSignalUniversalInValues1( operationNode[i].getOutValues(), _combinationStatusInfos );


                            }
                            else if (operationNode[k].id ===  operationNode[i].adjacentNodes[j].id &&
                                operationNode[i].adjacentNodes[j].port === 'in2') {

                                operationNode[k].setAmendCommonSignalUniversalInValues2( operationNode[i].getOutValues(), _combinationStatusInfos );


                            }


                        }

                    }

                    // operationNode.splice(i, 1);
                    operationNode.splice(i, 1);

                }

            }

        }

    }
    //[2.3]循环运算所有结果
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
            console.log("循环运算所有operationNode结果");
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

        console.log(_allSignalStatusInfos);

        //其中最后一个状态的 累计概率 一定为 1 ， 不必计算；
        for (let i = 0; i < _allSignalStatusInfos.length - 1 ; i++) {
            console.log("循环计算---------->");


        }

    }

}



export {
    GoGraph
}
