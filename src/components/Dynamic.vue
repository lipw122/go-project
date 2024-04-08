<template>
  <div style=" max-width: 500px; margin: 10px">
    <a-form-item label="操作符编号">
      <a-input id="needNodeNumberId" v-model:value="needNodeNumber"/>
    </a-form-item>
    <a-form-item label="可靠度阈值">
      <a-input id="needNodeThresholdId" v-model:value="needNodeThreshold"/>
    </a-form-item>
    <a-button type="primary" :disabled=disabledValue @click="dynamicGraph">计算</a-button>
    {{parentMessage}}
  </div>

<!--  {{allResultRecord}}-->
  <div id="main" style="width: 600px;height:400px;"></div>

</template>

<script  lang="ts">
import {useStore} from "vuex";
import {nextTick, onActivated, onMounted, reactive, ref, watch, watchEffect} from "vue";
import {
  GoCalculate1, GoCalculate10,
  GoCalculate2,
  GoCalculate3,
  GoCalculate5,
  GoCalculate6,
  GoCalculate7
} from "@/assets/ts/GoCalculate";
import {GoGraph} from "@/assets/ts/DirectedGraph";
import * as echarts from 'echarts';



export default {
  name: "Dynamic",
  components: {

  },
  setup: function (){

    const store = useStore();

    let node = store.state.node;
    let edge = store.state.edge;

    const classNode = [];
    const handleEdge: Array<{"id": string, "sourceId": string, "sourcePort": string, "targetId":string, "targetPort": string}>
        = reactive([]);
    const myGraph = reactive(new GoGraph());


    const needNodeNumber = ref();
    const needNodeThreshold = ref();

    const allResultRecord = reactive([]);
    const displayData = reactive([]);
    let parentMessage = ref('');
    let refreshKey = ref(0);

    let disabledValue = ref(true);

    const dynamicGraph = ()=>{

      console.log("开始运算--->");
      displayData.splice( 0, displayData.length );
      //计算函数
      function successProbability(lambda, t) {
        return Math.exp( - lambda * t );
      }

      console.log(classNode);

      parentMessage.value = "正在计算";

      //计算次数
      let calculateCount = 0;
      //动态操作符数量
      let dynamicCount = 0;
      //时间间隔 单位 h
      let timeStep = 10;
      //初始时间 t = 0
      let t = 0;

      //统计动态操作符数量
      for (let i = 0; i < classNode.length; i++) {
        //判断 该操作符 是否为 动态操作符
        if ( classNode[i].lambda !== null &&
            !isNaN( classNode[i].lambda ) &&
            !classNode[i].lambda !== undefined ) {
          dynamicCount++;
        }

      }
      console.log( "动态操作符数量：" + dynamicCount );
      allResultRecord.splice(0, allResultRecord.length);
      let isCalculate = true;

      //[计算总逻辑！！！] 动态计算--> while()里为 循环条件 while ( calculateCount < 3)
      while ( isCalculate ) {
        console.log( "第" + calculateCount + "次计算" );

        parentMessage.value = "第" + calculateCount + "次计算";

        //[1]重置数据
        console.log("[1]重置数据------------->");
        for (let i = 0; i < classNode.length; i++) {

          //判断 该操作符 是否为 动态操作符，如果是，重置数据
          if ( classNode[i].lambda !== null &&
              !isNaN( classNode[i].lambda ) &&
              !classNode[i].lambda !== undefined ) {

            let Pc_0 = 0;
            let Pc_1 = successProbability( parseFloat(classNode[i].lambda), t );
            let Pc_2 = 1 - Pc_1;


            //根据操作符类型 重置数据
            if ( classNode[i].basic.goType === 1 ){
              classNode[i].goState.Pc_1 = Pc_1;
              classNode[i].goState.Pc_2 = Pc_2;

            }
            else if ( classNode[i].basic.goType === 3 ||
                classNode[i].basic.goType === 6 ||
                classNode[i].basic.goType === 7 ){


              classNode[i].goState.Pc_0 = Pc_0;
              classNode[i].goState.Pc_1 = Pc_1;
              classNode[i].goState.Pc_2 = Pc_2;


            }
            else if ( classNode[i].basic.goType === 5 ) {

              classNode[i].goState.signalStatusNumber = 3;
              classNode[i].goState.signalStatusValues = [
                {statusValue:0,  value: Pc_0},
                {statusValue:1,  value: Pc_1},
                {statusValue:2,  value: Pc_2}
              ];

            }

          }

          classNode[i].inValuesArray = [];


        }

        console.log(classNode);

        //[2]本次 重置数据完毕，开始计算
        console.log("[2]本次重置数据完毕，开始计算------------->");


        myGraph.clearNode();
        for (let i = 0; i < classNode.length; i++) {
          myGraph.addNode(classNode[i]);
        }


        myGraph.calculate();

        //[3]计算完成，记录 本次 计算结果
        console.log("[3]计算完成，记录本次计算结果------------->");
        //展示数据处理
        let signalResult = [];
        myGraph.getNodes().forEach( (value, key)=>{
          signalResult.push({
            // id: value.id,
            goNumber: value.basic.goNumber,
            successStatusOutValue: value.outValues[1].value,
          });
        })
        allResultRecord.push( signalResult );

        //[4]清空 输出信号
        console.log("[4]清空 输出信号------------->");

        for (let i = 0; i < classNode.length; i++) {
          classNode[i].clearOutValues();

        }
        //去
        myGraph.clearAllInitialSignals();

        //[5]本次计算 完毕，开始 下次计算，计数 +1
        console.log("[5]本次计算 完毕，开始 下次计算，计数 +1------------->");
        calculateCount++;
        t = t + timeStep;

        //[6]是否退出循环
        console.log("[6]是否退出循环------------->");
        for (let i = 0; i < signalResult.length; i++) {
          if( signalResult[i].goNumber === parseInt(needNodeNumber.value) ){
            console.log("找到了");
            if ( signalResult[i].successStatusOutValue < parseFloat(needNodeThreshold.value) ) {
              console.log("终止循环");
              parentMessage.value = "计算完成";
              isCalculate = false;
            }
          }
        }

        if( calculateCount >= 20000 ){
          console.log("强制终止循环");
          parentMessage.value = "计算完成，强制终止循环20000";
          isCalculate = false;
        }

      }










      //计算完毕，数据处理
      //[
      // [
      //   { "goNumber": 1, "successStatusOutValue": 1 },
      //   { "goNumber": 2, "successStatusOutValue": 1 },
      //   { "goNumber": 3, "successStatusOutValue": 1 }
      // ],
      // ]
      displayData.splice( 0, displayData.length );
      for (let i = 0; i < allResultRecord.length; i++) {
        for (let j = 0; j < allResultRecord[i].length; j++) {
          if ( parseInt( allResultRecord[i][j].goNumber ) === parseInt( needNodeNumber.value ) ) {

            displayData.push( parseFloat( allResultRecord[i][j].successStatusOutValue ) );
          }
        }
      }
      console.log(displayData);


      // 基于准备好的dom，初始化echarts实例
      let chartDom = document.getElementById('main');
      let myChart = echarts.init( chartDom );
      let option;
      let _rawData = [
          [
            "goNumber",
            "name",
            "successStatusOutValue",
            "time",
          ],
      ];

      for (let i = 0; i < displayData.length; i++) {
            _rawData.push(
                [
                  needNodeNumber.value,
                  "操作符" + needNodeNumber.value,
                  displayData[i],
                  i * 10,
                ]
            );
      }

      console.log( _rawData );
      run(_rawData);
      function run(_rawData) {
        const countries = [
          // '操作符3',
          "操作符" + needNodeNumber.value,
        ];
        const datasetWithFilters = [];
        const seriesList = [];
        echarts.util.each(countries, function (country) {
          var datasetId = 'dataset_' + country;
          datasetWithFilters.push({
            id: datasetId,
            fromDatasetId: 'dataset_raw',
            transform: {
              type: 'filter',
              config: {
                and: [
                  { dimension: 'time', gte: 0 },
                  { dimension: 'name', '=': country }
                ]
              }
            }
          });
          seriesList.push({
            type: 'line',
            datasetId: datasetId,
            showSymbol: false,
            name: country,
            endLabel: {
              show: true,
              formatter: function (params) {
                return params.value[1] + ': ' + params.value[2];
              }
            },
            labelLayout: {
              moveOverlap: 'shiftY'
            },
            emphasis: {
              focus: 'series'
            },
            encode: {
              x: 'time',
              y: 'successStatusOutValue',
              label: ['时间', '成功概率'],
              itemName: '时间',
              tooltip: ['成功概率']
            }
          });
        });
        option = {
          animationDuration: 1,
          dataset: [
            {
              id: 'dataset_raw',
              source: _rawData
            },
            ...datasetWithFilters
          ],
          title: {
            text: '操作符' + needNodeNumber.value + "成功概率变化图"
          },
          tooltip: {
            order: 'valueDesc',
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            nameLocation: 'middle'
          },
          yAxis: {
            name: '成功概率',
            scale:true,
          },
          grid: {
            right: 140
          },
          series: seriesList
        };
        myChart.setOption(option);
      }

      option && myChart.setOption(option);


    }


    onActivated( ()=>{
      console.log("Dynamic组件加载onActivated----->");

      needNodeNumber.value = undefined;
      needNodeThreshold.value = undefined;


      node = store.state.node;
      edge = store.state.edge;
      console.log( node );

      //【1】处理node节点，对所有node节点 new 一个 节点对象并将数据存放
      classNode.splice(0, classNode.length);
      for (let i = 0; i < node.length; i++) {
        if ( node[i].data.goType === 1 ) {
          const tempGo = new GoCalculate1();
          tempGo.id = node[i].id;
          tempGo.basic = {
            deviceName: node[i].data.deviceName,
            goType: node[i].data.goType,
            goNumber: node[i].data.goNumber,
          };
          tempGo.goState = {
            Pc_1: node[i].data.Pc_1,
            Pc_2: node[i].data.Pc_2,
          };
          tempGo.lambda = parseFloat( node[i].data.lambda );
          tempGo.adjacentNodes = [];
          classNode.push(tempGo);
        }
        else if ( node[i].data.goType === 2 ) {
          const tempGo = new GoCalculate2();
          tempGo.id = node[i].id;
          tempGo.basic = {
            deviceName: node[i].data.deviceName,
            goType: node[i].data.goType,
            goNumber: node[i].data.goNumber,
          };
          tempGo.goState = {
            inSignalsNumber: node[i].data.inSignalsNumber,
          };
          tempGo.adjacentNodes = [];
          classNode.push(tempGo);
        }
        else if ( node[i].data.goType === 3 ) {
          const tempGo = new GoCalculate3();
          tempGo.id = node[i].id;
          tempGo.basic = {
            deviceName: node[i].data.deviceName,
            goType: node[i].data.goType,
            goNumber: node[i].data.goNumber,
          };
          tempGo.goState = {
            Pc_0: node[i].data.Pc_0,
            Pc_1: node[i].data.Pc_1,
            Pc_2: node[i].data.Pc_2,
          };
          tempGo.lambda = parseFloat( node[i].data.lambda );
          tempGo.adjacentNodes = [];
          classNode.push(tempGo);
        }
        else if ( node[i].data.goType === 5 ) {
          const tempGo = new GoCalculate5();
          tempGo.id = node[i].id;
          tempGo.basic = {
            deviceName: node[i].data.deviceName,
            goType: node[i].data.goType,
            goNumber: node[i].data.goNumber,
          };
          tempGo.goState = {
            signalStatusNumber: node[i].data.signalStatusNumber,
            signalStatusValues: node[i].data.signalStatusValues,
          };
          tempGo.lambda = parseFloat( node[i].data.lambda );
          tempGo.adjacentNodes = [];
          classNode.push(tempGo);
        }
        else if ( node[i].data.goType === 6 ) {
          const tempGo = new GoCalculate6();
          tempGo.id = node[i].id;
          tempGo.basic = {
            deviceName: node[i].data.deviceName,
            goType: node[i].data.goType,
            goNumber: node[i].data.goNumber,
          };
          tempGo.goState = {
            Pc_0: node[i].data.Pc_0,
            Pc_1: node[i].data.Pc_1,
            Pc_2: node[i].data.Pc_2,
          };
          tempGo.lambda = parseFloat( node[i].data.lambda );
          tempGo.adjacentNodes = [];
          classNode.push(tempGo);
        }
        else if ( node[i].data.goType === 7 ) {
          const tempGo = new GoCalculate7();
          tempGo.id = node[i].id;
          tempGo.basic = {
            deviceName: node[i].data.deviceName,
            goType: node[i].data.goType,
            goNumber: node[i].data.goNumber,
          };
          tempGo.goState = {
            Pc_0: node[i].data.Pc_0,
            Pc_1: node[i].data.Pc_1,
            Pc_2: node[i].data.Pc_2,
          };
          tempGo.lambda = parseFloat( node[i].data.lambda );
          tempGo.adjacentNodes = [];
          classNode.push(tempGo);
        }
        else if ( node[i].data.goType === 10 ) {
          const tempGo = new GoCalculate10();
          tempGo.id = node[i].id;
          tempGo.basic = {
            deviceName: node[i].data.deviceName,
            goType: node[i].data.goType,
            goNumber: node[i].data.goNumber,
          };
          tempGo.goState = {
            inSignalsNumber: node[i].data.inSignalsNumber,
          };
          tempGo.adjacentNodes = [];
          tempGo.inValuesArray = [];
          classNode.push(tempGo);

          console.log("初始化10");
          console.log(tempGo.inValuesArray);
          console.log(classNode);
          console.log(tempGo);
        }

      }


      //【2】处理edge
      handleEdge.splice(0, handleEdge.length);
      for (let i = 0; i < edge.length; i++) {
        handleEdge.push({
          id: edge[i].id,
          sourceId: edge[i].source.cell,
          targetId: edge[i].target.cell,
          sourcePort: edge[i].source.port,
          targetPort: edge[i].target.port,
        });
      }

      //【3】根据 node 对象 和 edge 对象 创建 图 数据结构
      myGraph.clearNode();
      for (let i = 0; i < classNode.length; i++) {
        myGraph.addNode(classNode[i]);
      }

      for (let i = 0; i < handleEdge.length; i++) {

        myGraph.connectNodes( handleEdge[i].sourceId, handleEdge[i].targetId, handleEdge[i].targetPort );
      }


    });



    onMounted(()=>{
      console.log("dynamic组件挂载------>");

      const needNodeNumberId = document.getElementById("needNodeNumberId");
      const needNodeThresholdId = document.getElementById("needNodeThresholdId");

      watchEffect(() => {

        let isOK = true;

        if ( needNodeNumber.value === undefined ||
            needNodeNumber.value === "" ||
            isNaN(needNodeNumber.value) ||
            String(needNodeNumber.value).indexOf(".") >  -1 ||
            needNodeNumber.value <= 0 ||
            needNodeNumber.value > classNode.length){


          needNodeNumberId.style.color = "red";
          needNodeNumberId.style.borderColor = "red";
          isOK = false;
          disabledValue.value = true;

        } else {

          needNodeNumberId.style.color = "black";
          needNodeNumberId.style.borderColor = "#D9D9D9";

        }

        if ( needNodeThreshold.value === undefined ||
            needNodeThreshold.value === "" ||
            isNaN( needNodeThreshold.value ) ||
            needNodeThreshold.value <= 0 ||
            needNodeThreshold.value >= 1){
          // console.log(needNodeNumber.value);

          needNodeThresholdId.style.color = "red";
          needNodeThresholdId.style.borderColor = "red";
          isOK = false;
          disabledValue.value = true;
        } else {

          needNodeThresholdId.style.color = "black";
          needNodeThresholdId.style.borderColor = "#D9D9D9";

        }

        if( isOK ){
          console.log("输入OK");
          disabledValue.value = false;
        }

      });

    });

    return {

      disabledValue,

      refreshKey,
      parentMessage,

      needNodeNumber,
      needNodeThreshold,

      displayData,

      dynamicGraph,
      allResultRecord,

    }

  }
}
</script>

<style scoped>

</style>