<template>
  <div>
    <div class="triangle">

      <div class="number">25</div>

      <svg class="shape">
        <polyline points=" 3,3 3,60 60,30 3,3"></polyline>
      </svg>

      <div class="line"></div>

      <div class="go-flow-number"> {{ goFlowNumber }}</div>

    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {Node} from '@antv/x6'
import {Text} from "view-ui-plus";

export default defineComponent({
  name: "GoFlowCell25",
  components: {Text},
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

      console.log("change25:data");

    })
  },

})
</script>

<style scoped>

.triangle {
  width: 60px;
  height: 60px;
}

.line {
  width: 2px;
  height: 50%;
  background-color: black;
  position: absolute;
  top: 50%;
  left: 45%;
  transform: translateY(-50%);
}

.number {
  position: absolute;
  top: 50%;
  left: 25%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  font-weight: bold;
}

.go-flow-number {
  position: absolute;
  top: 50%;
  left: 68%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  font-weight: bold;
}

.shape {
  width: 60px;
  height: 60px;
  position: absolute;

}

polyline {
  fill: none;
  stroke-linejoin: round;
  stroke: black;
  stroke-width: 2;
}


</style>