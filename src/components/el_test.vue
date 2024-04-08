<template>
  <div>
    测试路由组件----------------------->
    store----->{{$store.state.sum}}
    <br/>
    {{$store.state}}
    <br/>
    <button @click="testAdd">jia test</button>
  </div>
  <button @click="calculateGraph">???</button>
  <div>
    {{ nowCombinationNumber }}
  </div>
</template>

<script>
import {mapState, useStore} from 'vuex'
import { defineComponent, ref, nextTick } from 'vue';
import {computed} from "vue";
import GoFlowCell21 from "@/components/go_flow_cells/GoFlowCell21";




export default {
  name: "el_test.vue",


  setup: function(){
    console.log("测试路由组件----------------------->");
    const store = useStore();

    /*const storeState=mapState(['count','sum'])
    const state={}

    Object.keys(storeState).forEach(Key=>{
      const fn=storeState[Key].bind({$store:store})
      state[Key]=computed(fn)
    })*/


    let n =1;

    const testAdd = ()=>{
      console.log('jia---->');
      store.dispatch('jia', n);
    }


    const nowCombinationNumber = ref(0);

    // const calculateGraph = () => {
    //   let count = 0;
    //   const increaseNumber = () => {
    //     if (count < 1000) {
    //       nowCombinationNumber.value++;
    //       count++;
    //       setTimeout(increaseNumber, 0);
    //     }
    //   };
    //
    //   increaseNumber();
    // };

/*
    非常抱歉，我之前的回答还是有误。在Vue 3中，
    由于JavaScript的事件循环机制，在同一个事件循环中进行的大量计算会阻塞UI更新，
    导致页面无法及时响应和更新。
    为了解决这个问题，
    你可以使用setTimeout或requestAnimationFrame来将循环中的计算分解成多个小任务，
    使得每个小任务完成后可以让Vue更新页面。
    以下是一个使用setTimeout的示例代码：
*/


    const calculateGraph = () => {
      //[1]常规 X
/*
      for (let i = 1; i <= 10000; i++) {
        nowCombinationNumber.value++;

        // 使用 nextTick 将操作推迟到下一个DOM更新周期
        nextTick(() => {
          // 执行其他操作
        });
      }
*/
      
      //[2]闭包 X
      for (let i = 0; i < 1000; i++) {
        let a = function () {
          return (function (i) {
            console.log(i);
            nowCombinationNumber.value++;
          })(i);
        };
        a();
      }

    };



    return{

      testAdd,
      nowCombinationNumber,

      calculateGraph,

    }

  }
}
</script>

<style scoped>

</style>