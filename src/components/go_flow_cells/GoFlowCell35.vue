<template>
  <div>
    <div class="circle">

      <div class="number">35</div>

      <svg class="shape">
        <polyline points=" 3,3 35,3 35,15 3,15, 3,3 35,15 "></polyline>
      </svg>

      <div class="line"></div>

      <div class="go-flow-number"> {{ goFlowNumber }}</div>

    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {Node} from '@antv/x6'

export default defineComponent({
  name: "GoFlowCell35",
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

      console.log("change35:data");

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
  top: 20%;
  left: 15%;
  font-weight: bold;
  fill: green;
}

polyline {
  fill: none;
  stroke: green;
  stroke-width: 2;
}


</style>