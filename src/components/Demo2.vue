<template>

  <div>

    <a-button @click="calculateGraph">计算</a-button>


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

    <div>
      <a-table :columns="columnsEdge" :data-source="handleEdge" :pagination="false" bordered>

        <template #title>Header</template>
        <template #footer>Footer</template>

      </a-table>
    </div>


  </div>

</template>

<script  lang="ts">
import { useStore } from 'vuex'
import {computed, onActivated, onBeforeMount, onMounted, reactive, ref, watch} from "vue";
import {TableColumnsType} from "ant-design-vue";
import '../assets/ts/GoCalculate'
import '../assets/ts/testCalculateFunction'
import {GoStateBasic} from "@/assets/ts/interface";
import {GoGraph} from "@/assets/ts/DirectedGraph";
import { GoCalculate1, GoCalculate2, GoCalculate3, GoCalculate5, GoCalculate6, GoCalculate7,
  GoCalculate10, } from "@/assets/ts/GoCalculate";


export default {
  name: "information",

  setup: function (){


    const store = useStore();

    const node = store.state.node;
    const edge = store.state.edge;

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

    const calculateGraph = () => {
      myGraph.calculate();
      myGraph.clearAllOutValues();
      myGraph.clearAllInValues();
      //去重
      myGraph.removeDuplicatesInitialSignals();

      const allSignalStatusInfos = myGraph.getCombinationSignals();

      myGraph.amendCommonSignalUniversalCalculate();
      //其中最后一个状态的 累计概率 一定为 1 ， 不必计算；??
      for (let i = 0; i < allSignalStatusInfos.length ; i++) {
        console.log("allSignalStatusInfos循环计算---------->");
        console.log( allSignalStatusInfos[i] );
        myGraph.calculateCombination( allSignalStatusInfos[i] );

        myGraph.clearAllOutValues();
        myGraph.clearAllInValues();
      }
      myGraph.calculateAllCombinationOutValuesResult();

      displayValues.splice(0, displayValues.length)
      myGraph.getNodes().forEach( (value, key)=>{
        displayValues.push({
          id: value.id,
          goNumber: value.basic.goNumber,
          outValues: value.outValues,
        });
      })

      //运算的最终结果Map
      console.log( myGraph.getNodes() );
      
    }



    onBeforeMount(()=>{
      console.log("Demo2组件加载onBeforeMount----->");
    });

    onActivated( ()=>{
      console.log("Demo2组件加载onActivated----->");

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
        console.log("state.node数据改变，更新Demo2中数据");
        // data = [];  //若使用 let 定义，页面不改变； 用 for 循环 pop() 清空会出问题？？

        /*
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

        }
        */

      }, { deep: true });


      //监听 vuex 中 edge 是否变化(开启深度监视)，变化后将 edge 值进行整理 赋值给新的对象
      watch(()=>edge, ()=>{
        // console.log("state.edge数据改变，更新Demo2中数据");

        /*
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
        */

      }, { deep: true })

      watch([ ()=>classNode, ()=>handleEdge ], ()=>{
        console.log("handle变化了");
        /*
        myGraph.clearNode();
        for (let i = 0; i < classNode.length; i++) {
          myGraph.addNode(classNode[i]);
        }

        for (let i = 0; i < handleEdge.length; i++) {
          myGraph.connectNodes( handleEdge[i].sourceId, handleEdge[i].targetId, handleEdge[i].targetPort );
        }
        */

      },{ deep:true });


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