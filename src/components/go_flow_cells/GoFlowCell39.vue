<template>
  <div>
    <div class="circle">

      <div class="number">39</div>

      <svg class="shape">

        <defs>
          <pattern id="myPattern" patternUnits="userSpaceOnUse" width="2" height="2">
            <circle cx="1" cy="1" r="1" fill="green"/>
          </pattern>
        </defs>

        <polyline points=" 1,0 1,9 18,10 0,0 " fill="green"></polyline>
        <polyline points=" 1,9 1,18 18,10 1,9 " fill="none"></polyline>
        <polyline points=" 18,10 35,0 35,9 18,10 " fill="none"></polyline>
        <polyline points=" 18,10 35,9 35,18 18,10 " fill="url(#myPattern)"></polyline>
      </svg>

      <div class="line"></div>

      <div className="go-flow-number"> {{ goFlowNumber }}</div>

    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {Node} from '@antv/x6'
import {Circle, Text} from "view-ui-plus";

export default defineComponent({
  name: "GoFlowCell39",
  components: {Circle, Text},
  inject: ['getNode'],

  data() {
    return {
      goFlowNumber: null,
    }
  },
  mounted() {

    const node = (this as any)?.getNode() as Node

    node.on('change:data', ({current}) => {

      this.goFlowNumber = current.goFlowNumber;

      console.log("change39:data");

    })
  },

})
</script>

<style scoped>

.circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid black;
  position: relative;
}

.line {
  width: 100%;
  height: 2px;
  background-color: black;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}

.number {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  font-weight: bold;
}

.go-flow-number {
  position: absolute;
  top: 75%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  font-weight: bold;
}

.shape {
  width: 60px;
  height: 60px;
  position: absolute;
  top: 15%;
  left: 17%;
  font-weight: bold;
  fill: green;
}

polyline {
  stroke: green;
  stroke-width: 2;
}


</style>