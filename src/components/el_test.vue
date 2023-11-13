<template>
  <div>
    测试路由组件----------------------->
    store----->{{$store.state.sum}}
    <br/>
    {{$store.state}}
    <br/>
    <button @click="testAdd">jia test</button>
  </div>
</template>

<script>
import {mapState, useStore} from 'vuex'
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



    return{

      testAdd,

    }

  }
}
</script>

<style scoped>

</style>