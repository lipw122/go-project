<template>



  <a-layout class="layout">
    <a-layout-header
        style="height: 32px;">
      <div class="logo" />
      <a-menu
          v-model:selectedKeys="selectedKeys"

          mode="horizontal"
          :style="{ lineHeight: '32px'}"
      >

        <a-menu-item key="1">
            <router-link to="/design">Go图设计</router-link>
        </a-menu-item>
        <a-menu-item key="2">
          <router-link to="/goFlowDesign">GoFlow图设计</router-link>
        </a-menu-item>
        <a-menu-item key="3">
          <router-link to="/el_test">数据</router-link>
        </a-menu-item>
        <a-menu-item key="4">
          <router-link to="/calculate">计算</router-link>
        </a-menu-item>
        <a-menu-item key="5">
          <router-link to="/dynamic">动态计算</router-link>
        </a-menu-item>
<!--        <a-menu-item key="3">
          <router-link to="/home">nav 3</router-link>
        </a-menu-item>-->
      </a-menu>
    </a-layout-header>

    <a-layout-content style="padding: 0 0; ">

      <div :style="{ background: '#fff', padding: '0px', minHeight: '280px', margin: '0 0 0 0', border: '1px solid #8b8b8b' }">
        <router-view v-slot="{ Component, route}">

          <keep-alive>
            <component :is="Component" v-if="route.meta.keepAlive" :key="route.path"></component>
          </keep-alive>
<!--          <component :is="Component" v-if="!route.meta.keepAlive" :key="route.path"></component>-->

        </router-view>
      </div>
    </a-layout-content>

    <a-layout-footer style="text-align: center; height: 32px; padding: 0 0">
      <span style="line-height: 32px">Go/Flow Design ©2023 Created by Li</span>
    </a-layout-footer>
  </a-layout>


</template>

<script lang="ts">
import {defineComponent, onMounted, watch} from 'vue';
import HelloWorld from './components/HelloWorld.vue';

import { ref } from 'vue';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons-vue';
import router from './router';
import Demo2 from './components/Demo2.vue';


export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
    Demo2,
  },


  setup: ()=> {

    const selectedKeys = ref<string[]>(['1']);
    const selectedKeys1 = ref<string[]>(['2']);
    const selectedKeys2 = ref<string[]>(['1']);
    const openKeys = ref<string[]>(['sub1']);

    onMounted(()=>{
      console.log("页面挂载。。。");

      router.push('/design');

    });



    watch(()=> router.currentRoute.value.path,(newValue, oldValue)=>{
      console.log(router.currentRoute.value.path);
      if( router.currentRoute.value.path === '/design'){
        selectedKeys.value.pop();
        selectedKeys.value.push('1');
      }
      else if(router.currentRoute.value.path === '/el-test'){
        selectedKeys.value.pop();
        selectedKeys.value.push('2');
      }
      else if(router.currentRoute.value.path === '/home'){
        selectedKeys.value.pop();
        selectedKeys.value.push('3');
      }
    });

    return{
      selectedKeys
    }

  }
  //endSetup




});
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}

.site-layout-content {
  min-height: 280px;
  padding: 24px;
  background: #fff;
}
#components-layout-demo-top .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}
.ant-row-rtl #components-layout-demo-top .logo {
  float: right;
  margin: 16px 0 16px 24px;
}
.ant-layout-header {
  background-color: #f2f2f2;
}
.ant-menu {
  background-color: #f2f2f2;
}




</style>
