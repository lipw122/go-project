<template>

  <div>

    <a-button @click="calculateGraph">计算</a-button>

    <hr>
    <div>第一步：{{ nowCombinationNumber }} / {{allSignalStatusInfosLength}} ({{percent1}} %)</div>
    <div style="width: 70%">
      <a-progress :percent= percent1 />
    </div>
    <div>第二步：{{nowHandleNodeNum}} / {{classNodeLength}} ({{percent2}} %)</div>
    <div style="width: 70%">
      <a-progress :percent= percent2 />
    </div>

    <table id="displayValues">
      <tr>
<!--        <td>id</td>-->
        <th>goNumber</th>
        <th v-for="(item, index) in displayValues[0]?.outValues" :key="index">概率值{{index}}</th>
        <th v-for="(item, index) in displayValues[0]?.outValues" :key="index">累计概率值{{index}}</th>
      </tr>
      <tr v-for="item in displayValues" :key="item">
<!--        <td>{{item.id}}</td>-->
        <td>{{item.goNumber}}</td>
        <td v-for="item2 in item.outValues" :key="item2">{{item2.value}}</td>
        <td v-for="item2 in item.outValues" :key="item2">{{item2.accumulationValue}}</td>
      </tr>
    </table>

    <hr/>




  </div>

</template>

<script  lang="ts">
import { useStore } from 'vuex'
import {computed, nextTick, onActivated, onBeforeMount, onMounted, reactive, ref, watch} from "vue";
import {TableColumnsType} from "ant-design-vue";
import '../assets/ts/GoCalculate'
import '../assets/ts/testCalculateFunction'
import {GoStateBasic} from "@/assets/ts/interface";
import {GoGraph} from "@/assets/ts/DirectedGraph";
import { GoCalculate1, GoCalculate2, GoCalculate3, GoCalculate5, GoCalculate6, GoCalculate7,
  GoCalculate10, } from "@/assets/ts/GoCalculate";
import store from "@/store";


export default {
  name: "information",

  setup: function (){


    const store = useStore();

    let node = store.state.node;
    let edge = store.state.edge;

    const columnsEdge = [
      {
        title: 'Id',
        dataIndex: 'id',
      },
      {
        title: '源(箭头尾)',
        dataIndex: 'sourceId',
      },
      {
        title: '源(箭头尾链接桩)',
        dataIndex: 'sourcePort',
      },
      {
        title: '目标(箭头头)',
        dataIndex: 'targetId',
      },
      {
        title: '目标(箭头头链接桩)',
        dataIndex: 'targetPort',
      },
    ];


    const classNode = reactive([]);
    const handleEdge: Array<{"id": string, "sourceId": string, "sourcePort": string, "targetId":string, "targetPort": string}>
        = reactive([]);

    const myGraph = reactive(new GoGraph());

    const displayValues = reactive([]);

    let percent1 = ref( 0 );
    let nowCombinationNumber = ref(0);
    let percent2 = ref( 0 );
    let nowHandleNodeNum = ref(0);
    let allSignalStatusInfosLength = ref(0);
    let classNodeLength = ref(0);

    const calculateGraph = () => {
      percent1.value = 0;
      percent2.value = 0;
      nowCombinationNumber.value = 0;
      nowHandleNodeNum.value = 0;

      //首次计算
      myGraph.calculate();
      myGraph.clearAllOutValues();
      myGraph.clearAllInValues();
      //去重
      myGraph.removeDuplicatesInitialSignals();

      //获取所有 信号发生器 0 1 组合，把所有信号发生器的输出信号当做 共有信号
      const allSignalStatusInfos = myGraph.getCombinationSignals();

      allSignalStatusInfosLength.value = allSignalStatusInfos.length;
      classNodeLength.value = classNode.length;

      //设置所有组合信号
      myGraph.amendCommonSignalUniversalCalculate();
      //其中最后一个状态的 累计概率 一定为 1 ， 不必计算；??


      /*
        由于JavaScript的事件循环机制，在同一个事件循环中进行的大量计算会阻塞UI更新，
        导致页面无法及时响应和更新。
        可以使用setTimeout或requestAnimationFrame来将循环中的计算分解成多个小任务
      */

      //[1] 构造递归函数
      let count = 0; //count计数，当最终 达到 所有信号组合 allSignalStatusInfos 的长度时，结束；
      //[1.1]处理 非信号发生器 第二步（最终结果） 函数
      function recursiveOperationNode(index: number, operationNode: any[]) {
        if (index >= operationNode.length) {
          return;
        }


        operationNode[index].calculateCombinationOutValuesResult();

        //现在处理的组合个数，用来显式进度条
        nowHandleNodeNum.value++;
        percent2.value = Math.floor( 100 *( (nowHandleNodeNum.value) / classNode.length ));

        // 使用requestAnimationFrame触发下一次递归调用
        requestAnimationFrame(() => {
          recursiveOperationNode(index + 1, operationNode);
        });
      }
      //[1.2]处理 信号发生器 第二步（最终结果） 函数
      function recursiveInputNode(index: number, inputNode: any[] ) {
        if (index >= inputNode.length) {
          return;
        }

        inputNode[index].calculateCombinationOutValuesResult();

        nowHandleNodeNum.value++;
        percent2.value = Math.floor( 100 *( (nowHandleNodeNum.value) / classNode.length ));

        // 使用requestAnimationFrame触发下一次递归调用
        requestAnimationFrame(() => {
          recursiveInputNode(index + 1, inputNode );
        });
      }

      //[2]构造 递归函数 完毕，进行 逻辑 运算 处理
      const increaseNumber = () => {
        //[2.1] count 未达到 所有组合信号 数量，继续 第一步，根据 下一组 信号组合 计算
        if ( count < allSignalStatusInfos.length ) {

          //进度条1 数值计算
          percent1.value = Math.floor( 100 *( (nowCombinationNumber.value + 1) / allSignalStatusInfos.length ));

          // 执行较长时间的处理逻辑
          myGraph.calculateCombination( allSignalStatusInfos[count] );
          myGraph.clearAllOutValues();
          myGraph.clearAllInValues();
          // console.log("myGraph.getNodes()--->");
          // console.log(myGraph.getNodes());

          nowCombinationNumber.value++;
          count++;


          // 使用requestAnimationFrame触发下一次递归调用
          requestAnimationFrame(increaseNumber);
        }
        //[2.2] count 达到 所有组合信号 数量，开始处理 第二步，进行最终 结果运算
        if ( count === allSignalStatusInfos.length ) {
          console.log("处理第二步----------------！！！");
          count++;

          //myGraph.calculateAllCombinationOutValuesResult();

          const inputNode = [];
          const operationNode = [];
          classNode.forEach((value, key)=>{
            if ( value.basic.goType === 5 ) {
              inputNode.push(value);
            }
            else {
              operationNode.push(value);
            }
          });

          // console.log("开始处理OperationNode--->");
          recursiveOperationNode(0, operationNode );
          // console.log("开始处理InputNode--->");
          recursiveInputNode(0, inputNode );

          //展示数据处理
          displayValues.splice(0, displayValues.length)
          myGraph.getNodes().forEach( (value, key)=>{
            displayValues.push({
              id: value.id,
              goNumber: value.basic.goNumber,
              outValues: value.outValues,
            });
          })

          //输出运算的最终结果Map
          console.log( myGraph.getNodes() );
          console.log( displayValues );
        }

      };
      increaseNumber();

      /*for (let i = 0; i < allSignalStatusInfos.length ; i++) {
        console.log("allSignalStatusInfos循环计算---------->");

        // 更新 nowCombinationNumber 的值
        nowCombinationNumber.value++;

        //进度条数值计算
        percent1.value = Math.floor( 100 *( nowCombinationNumber.value / allSignalStatusInfos.length ));
        console.log( percent1.value );
        console.log( "%" );

        // 执行较长时间的处理逻辑
        myGraph.calculateCombination( allSignalStatusInfos[i] );
        console.log(i);
        myGraph.clearAllOutValues();
        myGraph.clearAllInValues();

      }*/

    }



    onBeforeMount(()=>{
      console.log("Demo2组件加载onBeforeMount----->");
    });

    onActivated( ()=>{
      console.log("Demo2组件加载onActivated----->");
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
          classNode.push(tempGo);
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
        // console.log(handleEdge);
        myGraph.connectNodes( handleEdge[i].sourceId, handleEdge[i].targetId, handleEdge[i].targetPort );
      }

    });


    onMounted(()=>{



      //监听 vuex 中 node 是否变化(开启深度监视)，变化后将 node 值进行整理 赋值给新的对象 classNode
      watch( ()=>node, ()=>{
        console.log("state.node数据改变");
      }, { deep: true });

      //监听 vuex 中 edge 是否变化(开启深度监视)，变化后将 edge 值进行整理 赋值给新的对象
      watch(()=>edge, ()=>{
        console.log("state.edge数据改变");
      }, { deep: true })

      // watch([ ()=>classNode, ()=>handleEdge ], ()=>{
      //   console.log("handle变化了");
      //
      // },{ deep:true });


    });


    return {

      edge,
      columnsEdge,
      // handleNode,
      classNode,
      handleEdge,
      // goState5Nodes,

      myGraph,
      displayValues,

      percent1,
      percent2,
      nowCombinationNumber,
      allSignalStatusInfosLength,
      classNodeLength,
      nowHandleNodeNum,

      calculateGraph,


    }

  }




}
</script>

<style scoped>

th.column-money,
td.column-money {
  text-align: right !important;
}

#displayValues {

}

#displayValues th {
  width: 100px;
}

#displayValues tr th {
  border: 1px solid black;
  background-color: #94ffdf;
}

#displayValues tr td {
  border: 1px solid black;
  text-align: center;
}


</style>