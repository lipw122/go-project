<template>
  <div id="demo1">
<!--    <GoFlowCell21></GoFlowCell21>-->


    <a-row :gutter="[8,8]">

      <a-col :span="5">
        <div id = "stencil"></div>
      </a-col>

      <a-col :span="14">
        <div id="panelTool" style="display: flex">
          <div>
<!--            <a-checkbox
                v-model:checked="graphStatePanning"
                @click="graphToolsResponse"
            >
              移动画布
            </a-checkbox>-->

            <a-button type="text" shape="circle" @click="saveGraphToFile">
              <img src="../assets/image/icon/saveGraph.svg" alt="保存go图" style="margin-bottom: 3px" />
            </a-button>
            <a-button type="text" shape="circle" @click="openGraphFromFile">
              <img src="../assets/image/icon/openGraph.svg" alt="打开go图" style="margin-bottom: 5px" />
            </a-button>
            {{screenHeight}}
            {{totalNodeNumber}}
            {{totalEdgeNumber}}
            <a-radio-group v-model:value="graphMove" size="small" style="margin: 0 8px">
              <a-radio-button value="jiantou" type="text" shape="circle" @click="graphToolsResponse('jiantou')">
                <img src="../assets/image/icon/shubiao-jiantou.svg" alt="箭头" style="margin-bottom: 5px" />
              </a-radio-button>
              <a-radio-button value="shou" type="text" shape="circle" @click="graphToolsResponse('shou')">
                <img src="../assets/image/icon/yidong-shou.svg" alt="移动" style="margin-bottom: 5px" />
              </a-radio-button>
            </a-radio-group>

            <a-button type="text" shape="circle" @click="handleButtonClick('zoomIn')">
              <zoom-in-outlined />
            </a-button>
            <a-button type="text" shape="circle" @click="handleButtonClick('zoomOut')">
              <zoom-out-outlined />
            </a-button>
            <a-button type="text" shape="circle" @click="handleButtonClick('zoomTo')">
              <img src="../assets/image/icon/suofang-yuanshichicun.svg" alt="原始尺寸" style="margin-bottom: 5px" />
            </a-button>
            <a-button type="text" shape="circle" @click="handleButtonClick('centerContent')">
              <img src="../assets/image/icon/suofang-juzhong.svg" alt="居中" style="margin-bottom: 5px" />
            </a-button>
            <a-button type="text" shape="circle" @click="handleButtonClick('zoomToFit')">
              <img src="../assets/image/icon/suofang-fit.svg" alt="自适应" style="margin-bottom: 5px" />
            </a-button>


            <icon-font type="icon-graphshou" />

          </div>
        </div>
        <div id = "panel">
          <div id = "container"></div>
        </div>
      </a-col>

      <a-col :span="5">
        <div class="config" >
          <div style="float: left">
            <a-radio-group v-model:value="rightBarOptions" size="small">
              <a-radio-button value="property">属性</a-radio-button>
              <a-radio-button value="structure">结构</a-radio-button>
            </a-radio-group>
          </div>

          <hr style="margin-top: 30px; color: #AFAFAF; "/>

          <div style="float: left">
            <div  id="property" v-show='rightBarOptions === "property"' style="float: left; overflow: auto; width: 250px;">

              <a-form>

                <a-form-item label="信号流编号" v-show="isShowEdgeNumberInput">
                  <a-input id="edgeNumberInput" v-model:value="edgeNumber" @change="onEdgeNumberChange"/>
                </a-form-item>


                <!--              基本信息-->
                <table v-show = "goStateBasic.goType !== null" class="goStateTable">
                  <tr>
                    <th>参数名</th>
                    <th>值</th>
                  </tr>
                  <tr>
                    <td>
                      设备名:
                    </td>
                    <td>
                      <a-input v-model:value = "goStateBasic.deviceName" placeholder="请输入设备名称" @change="onGoStateBasicChange"/>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      类型:
                    </td>
                    <td>
                      <a-input v-model:value = "goStateBasic.goType" readonly="readonly" placeholder="运算符类型"/>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      编号:
                    </td>
                    <td>
                      <a-input id="goNumberInput" v-model:value = "goStateBasic.goNumber"  placeholder="请输入Go操作符编号"
                               @change="onGoNumberChange"/>
                    </td>
                  </tr>
                </table>





                <!--              3,6,7,16,17单元-->
                <table v-show = "goStateBasic.goType === 3 ||
                                goStateBasic.goType === 6 ||
                                goStateBasic.goType === 7 ||
                                goStateBasic.goType === 16 ||
                                goStateBasic.goType === 17" class="goStateTable">
                  <tr>
                    <th>运算符状态</th>
                    <th>参数</th>
                    <th>值</th>
                  </tr>
                  <tr>
                    <td>0(提前)</td>
                    <td>Pc_0</td>
                    <td><a-input v-model:value="goState3_6_7_16_17.Pc_0" @change="onGoState3_6_7_16_17Change"></a-input></td>
                  </tr>
                  <tr>
                    <td>1(成功)</td>
                    <td>Pc_1</td>
                    <td><a-input v-model:value="goState3_6_7_16_17.Pc_1" @change="onGoState3_6_7_16_17Change"></a-input></td>
                  </tr>
                  <tr>
                    <td>2(故障)</td>
                    <td>Pc_2</td>
                    <td><a-input v-model:value="goState3_6_7_16_17.Pc_2" @change="onGoState3_6_7_16_17Change"></a-input></td>
                  </tr>
                </table>


                <!--            1.两状态单元-->
                <table class="goStateTable" v-show = "goStateBasic.goType === 1">
                  <tr>
                    <th>运算符状态</th>
                    <th>参数</th>
                    <th>值</th>
                  </tr>
                  <tr>
                    <td>1(正常)</td>
                    <td>Pc_1</td>
                    <td><a-input v-model:value = "goState1.Pc_1" placeholder="设备正常概率值" @change="onGoState1Change"/></td>
                  </tr>
                  <tr>
                    <td>2(故障)</td>
                    <td>Pc_2</td>
                    <td><a-input v-model:value = "goState1.Pc_2" placeholder="设备故障概率值" @change="onGoState1Change"/></td>
                  </tr>
                </table>

                <!--            2.或门-->
<!--                <table class="goStateTable" v-show = "goStateBasic.goType === 2">
                  <tr>
                    <td>输入信号数量</td>
                    <td>
                      <a-select v-model:value="goState2.inSignalsNumber" placeholder="请选择输入信号数量" @change="onGoState2Change2">
                        <a-select-option :value = 1>输入1个信号</a-select-option>
                        <a-select-option :value = 2>输入2个信号</a-select-option>
                        <a-select-option :value = 3>输入3个信号</a-select-option>
                        <a-select-option :value = 4>输入4个信号</a-select-option>
                      </a-select>
                    </td>
                  </tr>
                </table>-->


                <!--            4.多信号发生器-->
                <a-form-item label = "信号数量" v-show = "goStateBasic.goType === 4">
                  <a-select v-model:value="goState4.signalNumber" placeholder="请选择输出信号数量" @change="onGoState4Change2">
                    <a-select-option :value = 1>输出1个信号</a-select-option>
                    <a-select-option :value = 2>输出2个信号</a-select-option>
                    <a-select-option :value = 3>输出3个信号</a-select-option>
                    <a-select-option :value = 4>输出4个信号</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item v-for="item in goState4.signalStatusValues" :key="item" :label="item.signal"  v-show = "goStateBasic.goType == 4">
                  <!--          <a-input v-model:value="item.statusNumber" @change="onGoState4Change"></a-input>-->
                  <a-select v-model:value="item.statusNumber" placeholder="请选择信号状态数量" @change="onGoState4Change3()">
                    <a-select-option :value = 1>1个状态</a-select-option>
                    <a-select-option :value = 2>2个状态</a-select-option>
                    <a-select-option :value = 3>3个状态</a-select-option>
                    <a-select-option :value = 4>4个状态</a-select-option>
                  </a-select>
                  <div>
                    <table>
                      <tr   v-for="item2 in item.statusValues" :key="item2">
                        <td style="width: 60px; font-size: 6px">
                          {{item2.status}}概率:
                        </td>
                        <td>
                          <a-input v-model:value="item2.value" size="small" @change="onGoState4Change"></a-input>
                        </td>
                      </tr>
                    </table>
                  </div>
                </a-form-item>
                <table v-show="goState4.signalCombinationValues" class="goStateTable">
                  <tr>
                    <th v-for="(item) in goState4.signalNumber" :key="item" style="width: 40px">信号{{item}}状态</th>
                    <th>概率值</th>
                  </tr>
                  <tr v-for="item in goState4.signalCombinationValues" :key="item">
                    <td v-for="item2 in item.comNum" :key="item2">{{item2}}</td>
                    <td>
                      <a-input v-model:value="item.value" @change="onGoState4Change"></a-input>
                    </td>
                  </tr>
                </table>



                <!--            5.信号发生器-->
                <a-form-item label = "状态数量" v-show = "goStateBasic.goType === 5">
                  <a-select v-model:value="goState5.signalStatusNumber" placeholder="请选择信号状态数量" @change="onGoState5Change2">
                    <a-select-option :value = 1>1个状态</a-select-option>
                    <a-select-option :value = 2>2个状态</a-select-option>
                    <a-select-option :value = 3>3个状态</a-select-option>
                    <a-select-option :value = 4>4个状态</a-select-option>
                    <a-select-option :value = 5>5个状态</a-select-option>
                    <a-select-option :value = 6>6个状态</a-select-option>
                  </a-select>
                </a-form-item>
                <table class="goStateTable" v-show = "goState5.signalStatusValues !== null">
                  <tr>
                    <th>状态值</th>
                    <th>概率值</th>
                  </tr>
                  <tr v-for="item in goState5.signalStatusValues" :key="item">
                    <td>
                      {{item.statusValue}}
                    </td>
                    <td>
                      <a-input v-model:value="item.value" @change="onGoState5Change"></a-input>
                    </td>
                  </tr>
                </table>



                <!--              8.延迟发生器-->
                <a-form-item label = "状态数量" v-show = "goStateBasic.goType === 8">
                  <a-select v-model:value="goState8.statusNumber" placeholder="请选择信号状态数量" @change="onGoState8Change2">
<!--                    <a-select-option :value = 1>1个状态</a-select-option>-->
<!--                    <a-select-option :value = 2>2个状态</a-select-option>-->
                    <a-select-option :value = 3>3个状态</a-select-option>
                    <a-select-option :value = 4>4个状态</a-select-option>
                    <a-select-option :value = 5>5个状态</a-select-option>
                  </a-select>
                </a-form-item>
                <table v-show = "goState8.statusValues !== null" class="goStateTable">
                  <tr>
                    <th>状态值增量</th>
                    <th>值</th>
                    <th>对应概率</th>
                    <th>值</th>
                  </tr>
                  <tr v-for="(item, index) in goState8.statusValues" :key="item">
                    <td> D{{index+1}} </td>
                    <td><a-input v-model:value="item.D" @change="onGoState8Change"></a-input></td>
                    <td>P{{index+1}}</td>
                    <td><a-input v-model:value="item.P" @change="onGoState8Change"></a-input></td>
                  </tr>
                </table>


                <!--              9.功能操作符-->
                <a-form-item label = "状态数量" v-show = "goStateBasic.goType === 9">
                  <a-select v-model:value="goState9.differenceNumber" placeholder="请选择信号状态数量" @change="onGoState9Change2">
                    <a-select-option :value = 1>1</a-select-option>
                    <a-select-option :value = 2>2</a-select-option>
                    <a-select-option :value = 3>3</a-select-option>
                    <a-select-option :value = 4>4</a-select-option>
                  </a-select>
                </a-form-item>
                <table v-show = "goState9.differenceValues !== null" class="goStateTable">
                  <tr>
                    <th>输入信号状态值之差</th>
                    <th>值</th>
                    <th>输出信号状态值增量</th>
                    <th>值</th>
                  </tr>
                  <tr v-for="(item, index) in goState9.differenceValues" :key="item">
                    <td> D{{index+1}} </td>
                    <td><a-input v-model:value="item.X" @change="onGoState9Change"></a-input></td>
                    <td>P{{index+1}}</td>
                    <td><a-input v-model:value="item.Y" @change="onGoState9Change"></a-input></td>
                  </tr>
                </table>

                <!--              10.与门-->
                <a-form-item label = "信号数量" v-show = "goStateBasic.goType === 10">
                  <a-select v-model:value="goState10.inSignalsNumber" placeholder="请选择输入信号数量" @change="onGoState10Change2">
                    <a-select-option :value = 1>输入1个信号</a-select-option>
                    <a-select-option :value = 2>输入2个信号</a-select-option>
                    <a-select-option :value = 3>输入3个信号</a-select-option>
                    <a-select-option :value = 4>输入4个信号</a-select-option>
                  </a-select>
                </a-form-item>

                <!--              11.M取K门-->
                <a-form-item label = "M: " v-show = "goStateBasic.goType === 11">
                  <a-select v-model:value="goState11.inSignalsNumber" placeholder="请选择输入信号数量" @change="onGoState11Change2">
                    <a-select-option :value = 1>输入1个信号</a-select-option>
                    <a-select-option :value = 2>输入2个信号</a-select-option>
                    <a-select-option :value = 3>输入3个信号</a-select-option>
                    <a-select-option :value = 4>输入4个信号</a-select-option>
                    <a-select-option :value = 5>输入5个信号</a-select-option>
                    <a-select-option :value = 6>输入6个信号</a-select-option>
                    <a-select-option :value = 7>输入7个信号</a-select-option>
                    <a-select-option :value = 8>输入8个信号</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label = "K: " v-show = "goStateBasic.goType === 11">
                  <a-select v-model:value="goState11.succeedNumber" placeholder="请选择取K" @change="onGoState11Change">
                    <a-select-option :value = 1>取1</a-select-option>
                    <a-select-option :value = 2>取2</a-select-option>
                    <a-select-option :value = 3>取3</a-select-option>
                    <a-select-option :value = 4>取4</a-select-option>
                    <a-select-option :value = 5>取5</a-select-option>
                    <a-select-option :value = 6>取6</a-select-option>
                    <a-select-option :value = 7>取7</a-select-option>
                    <a-select-option :value = 8>取8</a-select-option>
                  </a-select>
                </a-form-item>

                <!--              12.路径分离器-->
                <a-form-item label = "分离路径个数 " v-show = "goStateBasic.goType === 12">
                  <a-select v-model:value="goState12.outSignalsNumber" placeholder="请选择分离数量" @change="onGoState12Change2">
                    <a-select-option :value = 1>分离1个信号</a-select-option>
                    <a-select-option :value = 2>分离2个信号</a-select-option>
                    <a-select-option :value = 3>分离3个信号</a-select-option>
                    <a-select-option :value = 4>分离4个信号</a-select-option>
                    <a-select-option :value = 5>分离5个信号</a-select-option>
                    <a-select-option :value = 6>分离6个信号</a-select-option>
                  </a-select>
                </a-form-item>
                <table v-show = "goState12.outStatusValues !== null" class="goStateTable">
                  <tr>
                    <th>参数</th>
                    <th>值</th>
                  </tr>
                  <tr v-for="item in goState12.outStatusValues" :key="item">
                    <td>{{item.p}}</td>
                    <td><a-input v-model:value="item.value" @change="onGoState12Change"></a-input></td>
                  </tr>
                </table>

                <!--              14.线性组合发生器-->
                <a-form-item label = "组合信号数量" v-show = "goStateBasic.goType === 14">
                  <a-select v-model:value="goState14.inSignalsNumber" placeholder="请选择输入信号数量" @change="onGoState14Change2">
                    <!--                  <a-select-option :value = 1>输入1个信号</a-select-option>-->
                    <a-select-option :value = 2>输入2个信号</a-select-option>
                    <a-select-option :value = 3>输入3个信号</a-select-option>
                    <a-select-option :value = 4>输入4个信号</a-select-option>
                    <a-select-option :value = 5>输入5个信号</a-select-option>
                    <a-select-option :value = 6>输入6个信号</a-select-option>
                  </a-select>
                </a-form-item>
                <table v-show = "goState14.linearCoefficients !== null" class="goStateTable">
                  <tr>
                    <th>系数</th>
                    <th>值</th>
                  </tr>
                  <tr v-for="item in goState14.linearCoefficients" :key="item">
                    <td>{{item.a}}</td>
                    <td><a-input v-model:value="item.value" @change="onGoState14Change"></a-input></td>
                  </tr>
                </table>


                <!--              15.限值概率门-->
                <table v-show = "goStateBasic.goType === 15" class="goStateTable">
                  <tr>
                    <th></th>
                    <th>参数</th>
                    <th>值</th>
                  </tr>
                  <tr>
                    <td  rowspan="2">输出信号状态值控制（V1~V2）</td>
                    <td>V1</td>
                    <td><a-input v-model:value="goState15.V1" @change="onGoState15Change"></a-input></td>
                  </tr>
                  <tr>
                    <td>V2</td>
                    <td><a-input v-model:value="goState15.V2" @change="onGoState15Change"></a-input></td>
                  </tr>
                  <tr>
                    <td rowspan="2">输入信号状态值域值（V3~V4）</td>
                    <td>V3</td>
                    <td><a-input v-model:value="goState15.V3" @change="onGoState15Change"></a-input></td>
                  </tr>
                  <tr>
                    <td>V4</td>
                    <td><a-input v-model:value="goState15.V4" @change="onGoState15Change"></a-input></td>
                  </tr>
                  <tr>
                    <td  rowspan="2">输入信号概率值域值（P1~P2）</td>
                    <td>P1</td>
                    <td><a-input v-model:value="goState15.P1" @change="onGoState15Change"></a-input></td>
                  </tr>
                  <tr>
                    <td>P2</td>
                    <td><a-input v-model:value="goState15.P2" @change="onGoState15Change"></a-input></td>
                  </tr>
                </table>

              </a-form>
            </div>

            <div v-show='rightBarOptions === "structure"'>
              表格
              <table border="1">
                <thead>
                <tr>
                  <th>列标题1</th>
                  <th>列标题2</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>行1，列1</td>
                  <td>行1，列2</td>
                </tr>
                <tr>
                  <td>行2，列1</td>
                  <td>行2，列2</td>
                </tr>
                <tr>
                  <td>行3，列1</td>
                  <td>行3，列2</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </a-col>

    </a-row>

  </div>
</template>


<script  lang="ts">

//Demo1中的import
import { ZoomInOutlined, ZoomOutOutlined, HomeOutlined,} from '@ant-design/icons-vue';
import { createFromIconfontCN } from '@ant-design/icons-vue';
import {defineComponent, nextTick, onMounted, ref, UnwrapRef, watch} from "vue";
import {reactive} from "vue";
import { Graph, Edge, Node, Shape, NodeView } from '@antv/x6';
import { Cell } from "@antv/x6";
import { Stencil } from '@antv/x6-plugin-stencil';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Keyboard } from "@antv/x6-plugin-keyboard";
import { Selection } from '@antv/x6-plugin-selection';
import '@antv/x6-vue-shape';
import '../assets/js/MyShape';
import attributePermutations from'../assets/ts/MyUtils'

import { GoStateBasic, GoState3_6_7_16_17, GoState1, GoState2, GoState4, GoState5, GoState8,
  GoState9, GoState10, GoState11, GoState12, GoState14, GoState15,} from "@/assets/ts/interface"

import { goCell1, goCell2, goCell3, goCell4, goCell5, goCell6, goCell7, goCell8, goCell9,
  goCell10, goCell11, goCell12, // goCell13,   //没写
  goCell14, goCell15, goCell16, goCell17, } from '@/assets/ts/GoCell'
import {rectBlock, circleBlock, ellipseBlock, polygonBlock, polylineBlock,
  pathBlock, imageBlock, textBlock} from "@/assets/ts/BasicCell"
import GoFlowCell21 from "./go_flow_cells/GoFlowCell21.vue"

import { useStore } from 'vuex'
import {Image} from "view-ui-plus";
import { register } from '@antv/x6-vue-shape';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
});


export default defineComponent({
  name:'design',
  components: {
    ZoomInOutlined,
    ZoomOutOutlined,
    'icon-font': IconFont,
    GoFlowCell21,
  },
  setup: function () {


    //一些全局变量
    let rightBarOptions = ref("property");
    let graph: Graph;
    let stencil: Stencil;
    const totalNodeNumber = ref<number>(0);
    const totalEdgeNumber = ref<number>(0);
    let curCell: Cell | null;
    let curEdge: Edge | null;
    const store = useStore();


    const edgeNumber = ref<any>(null);
    const isShowEdgeNumberInput = ref(false);

    //[:3]图元数据绑定通用
    const goStateBasic: UnwrapRef<GoStateBasic> = reactive({
      deviceName: null,
      goType: null,
      goNumber: null,
    });
    //[:3]图元数据绑定通用2
    const goState3_6_7_16_17 : UnwrapRef<GoState3_6_7_16_17> = reactive({
      Pc_0: null,
      Pc_1: null,
      Pc_2: null,
    });
    //[:3]图元数据绑定(1)
    const goState1: UnwrapRef<GoState1> = reactive({
      Pc_1: null,
      Pc_2: null,
    });
    //[:3]图元数据绑定(2)
    const goState2: UnwrapRef<GoState2> = reactive({
      inSignalsNumber: null,
    });
    //[:3]图元数据绑定(4)
    const goState4: UnwrapRef<GoState4> = reactive({
      signalNumber: null,
      signalCombinationValues: null,
      signalStatusValues: [],
    });
    //[:3]图元数据绑定(5)
    const goState5: UnwrapRef<GoState5> = reactive({
      signalStatusNumber: null,
      signalStatusValues: null,
    });
    //[:3]图元数据绑定(8)
    const goState8: UnwrapRef<GoState8> = reactive({
      statusNumber: null,
      statusValues: null,
    });
    //[:3]图元数据绑定(9)
    const goState9: UnwrapRef<GoState9> = reactive({
      differenceNumber: null,
      differenceValues: null,
    });
    //[:3]图元数据绑定(10)
    const goState10: UnwrapRef<GoState10> = reactive({
      inSignalsNumber: null,
    });
    //[:3]图元数据绑定(11)
    const goState11: UnwrapRef<GoState11> = reactive({
      inSignalsNumber: null,
      succeedNumber: null,
    });
    //[:3]图元数据绑定(12)
    const goState12: UnwrapRef<GoState12> = reactive({
      outSignalsNumber: null,
      outStatusValues: null,
    });
    //[:3]图元数据绑定(14)
    const goState14: UnwrapRef<GoState14> = reactive({
      inSignalsNumber: null,
      linearCoefficients: null,
    });
    //[:3]图元数据绑定(15)
    const goState15: UnwrapRef<GoState15> = reactive({
      V1: null,
      V2: null,
      V3: null,
      V4: null,
      P1: null,
      P2: null,
    });


    const graphMove = ref<string>('jiantou');
    const handleButtonClick = ( _mode ) => {
      switch ( _mode ) {
        case 'zoomIn':
          graph.zoom( 0.2 );
          break;
        case 'zoomOut':
          graph.zoom( -0.2 );
          break;
        case 'zoomTo':
          graph.zoomTo( 1 );
          break;
        case 'centerContent':
          graph.centerContent();
          break;
        case 'zoomToFit':
          graph.zoomToFit();
          break;
      }
    }

    const graphToolsResponse = ( _mode ) => {
      console.log( _mode );
      switch ( _mode ) {
       case 'jiantou':
         graph.disablePanning();
         break;
       case 'shou':
         graph.togglePanning();
         break;
      }
    }


    const saveGraphToFile = ()=>{

      const goGraphJson = graph.toJSON();
      const content = JSON.stringify(goGraphJson);

      const file = new Blob([content], { type: 'application/json'} );

      const a = document.createElement('a');
      const url = URL.createObjectURL(file);
      a.href = url;
      a.download = 'goGraphData.json';
      a.click();

      //移除链接释放资源
      URL.revokeObjectURL(url);

    }

    const openGraphFromFile = ()=>{
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      input.onchange = function(event) {
        const file = (event.target as HTMLInputElement).files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
          const content = e.target.result;

          if (typeof content === "string") {
            const goGraphJSON = JSON.parse(content);
            graph.fromJSON(goGraphJSON);
            console.log(goGraphJSON);
            const node = [];
            const edge = [];
            console.log(goGraphJSON.cells.length);
            totalNodeNumber.value = 0;
            totalEdgeNumber.value = 0;
            store.state.node = [];
            store.state.edge = [];
            for (let i = 0; i < goGraphJSON.cells.length; i++) {
              if ( goGraphJSON.cells[i]?.shape === "edge" ) {
                edge.push( goGraphJSON.cells[i] );
                store.dispatch( 'addEdge', goGraphJSON.cells[i] );
                totalEdgeNumber.value += 1;
              } else {
                node.push( goGraphJSON.cells[i] );
                store.dispatch( 'addNode', goGraphJSON.cells[i] );
                totalNodeNumber.value += 1;
              }
            }
            console.log( totalNodeNumber.value );
            console.log( totalEdgeNumber.value );

          }
        };
        reader.readAsText(file);
      };
      input.click();
    }

    const edgeNumberChange = ()=>{
      curEdge?.setData({
        edgeNumber: edgeNumber.value,
      });


      if(edgeNumber.value != null && edgeNumber.value != ""){
        curEdge?.setLabels([{
          attrs: {
            label: {
              text: edgeNumber.value,
            }
          },
          position: 0.5,
        },
        ]);
      } else {
        curEdge?.setLabels([{
          attrs: {
            label: {
              text: '??',

            }
          },
          position: 0.5,
        },
        ]);
      }

    }

    const onGoNumberChange = () => {

      console.log("回车----------》");

      //拦截非法输入
      if( goStateBasic.goNumber > totalNodeNumber.value ||
          goStateBasic.goNumber <= 0 ||
          isNaN(goStateBasic.goNumber) ||
          String(goStateBasic.goNumber).indexOf(".") >  -1){


        // console.log(goStateBasic.goNumber);

        const goNumberInput = document.getElementById("goNumberInput") as HTMLInputElement;

        //goNumberInput.select();

        //goStateBasic.goNumber = curCell.getData().goNumber;

        /*document.getElementById("goNumberInput").style.color = "black";
        document.getElementById("goNumberInput").style.border = "1px solid #d9d9d9";*/

        //return;

        document.getElementById("goNumberInput").style.color = "red";
        document.getElementById("goNumberInput").style.border = "1px solid red";
      }
      else{

        document.getElementById("goNumberInput").style.color = "black";
        document.getElementById("goNumberInput").style.border = "1px solid #d9d9d9";

        const allNodes = graph.getNodes();

        //修改了选中的编号
        if( goStateBasic.goNumber != curCell.getData().goNumber){
          console.log("修改了goNumber");

          //处理修改后的编号 大于 原本编号
          if( goStateBasic.goNumber > curCell.getData().goNumber ){
            for (let i = 0; i < allNodes.length; i++) {
              // 将图纸上介于 修改前 和修改后 之间的节点编号 减 1
              if( Number(allNodes[i].getData().goNumber) > Number(curCell.getData().goNumber) &&
                  Number(allNodes[i].getData().goNumber) <= Number(goStateBasic.goNumber)){


                allNodes[i].setData({
                  goNumber: Number(allNodes[i].getData().goNumber) -1,
                });

                let s = allNodes[i].getData().goType + "-" + allNodes[i].getData().goNumber;
                allNodes[i].attr('label/text', s);

              }
            }
          }

          //处理修改后的编号 小于 原本编号
          if( goStateBasic.goNumber < curCell.getData().goNumber ){
            for (let i = 0; i < allNodes.length; i++) {
              // 将图纸上介于 修改前 和修改后 之间的节点编号 加 1
              if ( Number(allNodes[i].getData().goNumber) < Number(curCell.getData().goNumber) &&
                  Number(allNodes[i].getData().goNumber) >= Number(goStateBasic.goNumber)) {

                allNodes[i].setData({
                  goNumber: Number(allNodes[i].getData().goNumber) + 1,
                });

                let s = allNodes[i].getData().goType + "-" + allNodes[i].getData().goNumber;
                allNodes[i].attr('label/text', s);

              }

            }
          }

          //修改选中的编号
          curCell.setData({
            goNumber: Number(goStateBasic.goNumber),
          });


          let s = curCell.getData().goType + "-" + curCell.getData().goNumber;
          curCell.attr('label/text', s);

        }

      }







    }

    const onEdgeNumberChange = () => {
      console.log("onEdgeNumberChange--------------------");

      if( edgeNumber.value > totalEdgeNumber.value ||
          edgeNumber.value <= 0 ||
          isNaN(edgeNumber.value) ||
          String(edgeNumber.value).indexOf(".") >  -1 ||
          edgeNumber.value == ""){

        document.getElementById("edgeNumberInput").style.color = "red";
        document.getElementById("edgeNumberInput").style.border = "1px solid red";
      } else {

        document.getElementById("edgeNumberInput").style.color = "black";
        document.getElementById("edgeNumberInput").style.border = "1px solid #d9d9d9";

        const allEdges = graph.getEdges();

        //修改了选中的编号
        if( edgeNumber.value != curEdge.getData().edgeNumber) {
          console.log("修改了edgeNumber");

          //处理--> 修改后的编号 大于 原本编号
          if( edgeNumber.value > curEdge.getData().edgeNumber ){
            for (let i = 0; i < allEdges.length; i++) {
              // 将图纸上介于 修改前 和修改后 之间的 边 编号 减 1
              if( allEdges[i].getData().edgeNumber > curEdge.getData().edgeNumber &&
                  allEdges[i].getData().edgeNumber <= edgeNumber.value){

                allEdges[i].setData({
                  edgeNumber: allEdges[i].getData().edgeNumber - 1,
                });

                allEdges[i].setLabelAt(0,{
                  attrs: {
                    label: {
                      text: allEdges[i].getData().edgeNumber,
                    }
                  },
                  position: 0.5,
                });

              }
            }
          }


          //处理修改后的编号 小于 原本编号
          if( edgeNumber.value < curEdge.getData().edgeNumber ){
            for (let i = 0; i < allEdges.length; i++) {
              // 将图纸上介于 修改前 和修改后 之间的 边 编号 加 1
              if (allEdges[i].getData().edgeNumber < curEdge.getData().edgeNumber &&
                  allEdges[i].getData().edgeNumber >= edgeNumber.value) {

                allEdges[i].setData({
                  edgeNumber: allEdges[i].getData().edgeNumber + 1,
                });

                allEdges[i].setLabelAt(0,{
                  attrs: {
                    label: {
                      text: allEdges[i].getData().edgeNumber,
                    }
                  },
                  position: 0.5,
                });

              }

            }
          }



          //修改选中的编号
          curEdge.setData({
            edgeNumber: edgeNumber.value,
          });
          curEdge.setLabelAt(0,{
            attrs: {
              label: {
                text: edgeNumber.value,
              }
            },
            position: 0.5,
          });

        }

      }
    }

    const onGoStateBasicChange = () => {
      if( goStateBasic.goType === null ){
        return;
      }
      curCell?.setData({
        deviceName: goStateBasic.deviceName,
        // goType: goStateBasic.goType,
        // goNumber: goStateBasic.goNumber,
      })

      /*console.log("输入编号，改变label");
      console.log(goStateBasic.goNumber);
      let s = goStateBasic.goType + "-" + goStateBasic.goNumber;
      console.log("执行attr。。。。");
      curCell?.attr('label/text', s);
      curCell?.attr('label/fontSize', 16);*/

    }

    const onGoState3_6_7_16_17Change = () => {
      curCell?.setData({
        Pc_0: goState3_6_7_16_17.Pc_0,
        Pc_1: goState3_6_7_16_17.Pc_1,
        Pc_2: goState3_6_7_16_17.Pc_2,
      });
    }
    //[@4]响应函数(goState1改变)
    const onGoState1Change = () => {
      curCell?.setData({
        Pc_1: goState1.Pc_1,
        Pc_2: goState1.Pc_2,
      })
    }
    //[@4]响应函数(goState2改变1)
    const onGoState2Change = () => {
      curCell?.setData({
        inSignalsNumber: goState2.inSignalsNumber
      })
    }
    //[@4]响应函数(goState2改变2)
    const onGoState2Change2 = () => {
      curCell?.setData({
        inSignalsNumber: goState2.inSignalsNumber,
      })
      //改变连接桩个数
      let tempN : Node;
      tempN = curCell as Node;

      if(tempN.getPortsByGroup("in").length < goState2.inSignalsNumber){
        let n = goState2.inSignalsNumber - tempN.getPortsByGroup("in").length;
        for (let i = 0; i < n; i++) {
          // console.log(tempN.getPorts().length + 1);
          let inN = "in" + (tempN.getPortsByGroup("in").length + 1);
          tempN.addPort({
            group: 'in',
            id: inN,
            attrs: {
              text: {
                text: inN
              }
            },
          });

        }
      }
      else if(tempN.getPortsByGroup("in").length > goState2.inSignalsNumber){
        let m =  tempN.getPortsByGroup("in").length - goState2.inSignalsNumber;
        for (let i = 0; i < m; i++) {
          let s = "in" + (goState2.inSignalsNumber + i + 1);
          // tempN.removePortAt(tempN.getPortsByGroup("in").length - 1);
          tempN.removePort(s);
        }
      }
    }
    //[@]响应函数(goState4改变1)
    const onGoState4Change = () => {
      curCell?.setData({
        signalNumber: goState4.signalNumber,
        signalStatusValues: goState4.signalStatusValues,
        signalCombinationValues: goState4.signalCombinationValues,
      })
    }
    //[@]响应函数(goState4改变2)(信号数量改变时，设置goState4.signalStatusValues对象，并且改变链接桩个数)
    const onGoState4Change2 = () => {
      //将signalNumber添加到data中
      goState4.signalCombinationValues = null;
      goState4.signalStatusValues = null;
      curCell?.setData({
        signalNumber: goState4.signalNumber,
        signalStatusValues: goState4.signalStatusValues,
        signalCombinationValues: goState4.signalCombinationValues,
        // signalStatusValues: null,
      })
      let statusValuesTemp = [];
      if(curCell?.getData().statusValues){
        statusValuesTemp = curCell?.getData().statusValues;
      }
      console.log("onGoState4Change2");
      console.log(curCell?.getData().statusValues);
      //通过循环设置signalStatusValues对象
      let n = goState4.signalNumber;
      let temp = [];
      for (let i = 0; i < n; i++) {
        let s = "信号" + (i + 1) + "状态数量";
        temp.push( { signal: s, statusNumber: null, statusValues: statusValuesTemp } );
      }
      //将设置好的signalStatusValues对象添加到数据绑定goState4中
      goState4.signalStatusValues = temp;
      //将绑定好的signalStatusValues添加到data中
      curCell?.setData({
        signalStatusValues: goState4.signalStatusValues,
      });

      //改变连接桩个数
      let tempN : Node;
      tempN = curCell as Node;
      if(tempN.getPorts().length < goState4.signalNumber){
        let n = goState4.signalNumber - tempN.getPorts().length;
        for (let i = 0; i < n; i++) {
          // console.log(tempN.getPorts().length + 1);
          let outN = "out" + (tempN.getPorts().length + 1);
          tempN.addPort({
            group: 'out',
            attrs: {
              text: {
                text: outN
              }
            },
          });

        }
      }
      else if(tempN.getPorts().length > goState4.signalNumber){
        let m =  tempN.getPorts().length - goState4.signalNumber;
        for (let i = 0; i < m; i++) {
          tempN.removePortAt(tempN.getPorts().length - 1);
        }
      }

    }
    //[@]响应函数(goState4改变3)(状态数量改变时设置状态值对象，每个信号的状态数量设置好后设置signalCombinationValues的数据类型)
    const onGoState4Change3 = () => {
      console.log("onGoState4Change3");

      //循环设置signalStatusValues的数据结构（在statusNumber不为空且statusValues没有数据结构时）
      let n = goState4.signalStatusValues.length
      for (let i = 0; i < n; i++) {
        let m = goState4.signalStatusValues[i].statusNumber;
        //如果statusNumber不为空，且statusValues没有数据结构时，设置其数据结构
        if (m) {
          if( goState4.signalStatusValues[i].statusValues.length == 0 ){
            goState4.signalStatusValues[i].statusValues = [];
            for (let j = 0; j < m; j++) {
              let s = "状态" + ( j + 1 );
              goState4.signalStatusValues[i].statusValues[j] = { status: s, value: ''};
            }
          }
        }
      }
      curCell?.setData({
        signalStatusValues: goState4.signalStatusValues,
      })

      //在所有的statusNumber都设置好后，设置对应的CombinationValues表格数据结构
      //判读是否每个信号都设置了对应的状态数量
      let isOkStatusNumber = true;
      for (let i = 0; i < goState4.signalStatusValues.length; i++) {
        if( ! goState4.signalStatusValues[i].statusNumber ){
          isOkStatusNumber = false;
        }
      }
      if( !isOkStatusNumber ){
        goState4.signalCombinationValues = null;
      }
      console.log(isOkStatusNumber);
      if(isOkStatusNumber){
        const attributeCounts: number[] = [];
        for (let i = 0; i < goState4.signalStatusValues.length; i++) {
          attributeCounts.push( goState4.signalStatusValues[i].statusNumber );
        }
        const result: number[][] = attributePermutations(attributeCounts);
        let signalCombinationValuesTemp = [];   //临时存储组合概率值
        for (let i = 0; i < result.length; i++) {
          let s = "";
          let n = [];
          for (let j = 0; j < result[i].length; j++) {
            let index = j + 1;
            let s1 = "信号" + index;
            let s2 = "状态" + (result[i][j] + 1);
            s = s + s1 + s2;
            n.push( result[i][j] + 1 );
          }
          signalCombinationValuesTemp.push( { combination: s, comNum: n,  value: ''} );
        }
        goState4.signalCombinationValues = signalCombinationValuesTemp;
        curCell?.setData({
          signalCombinationValues: goState4.signalCombinationValues,
        });
        // console.log(signalCombinationValuesTemp);
      }

    }
    //[@]响应函数(goState5改变1)(数据变化时设置到运算符的data中)
    const onGoState5Change = () => {
      curCell?.setData({
        signalStatusNumber: goState5.signalStatusNumber,
        signalStatusValues: goState5.signalStatusValues,
      })
    }
    //[@]响应函数(goState5改变2)(信号数量改变时，设置到Data中，并设置signalStatusValues对象格式添加到data中)
    const onGoState5Change2 = () => {
      //将signalNumber添加到data中，并将signalStatusValues置空
      curCell?.setData({
        signalStatusNumber: goState5.signalStatusNumber,
        signalStatusValues: null
      })
      //通过循环设置signalStatusValues对象
      let n = goState5.signalStatusNumber;
      let temp = [];
      for (let i = 0; i < n; i++) {
        temp.push({statusValue:i,  value: null});
      }
      goState5.signalStatusValues = temp;
      curCell?.setData({
        signalStatusValues: goState5.signalStatusValues,
      })
    }
    //[@4]响应函数(goState8改变)
    const onGoState8Change = () => {
      curCell?.setData({
        statusNumber: goState8.statusNumber,
        statusValues: goState8.statusValues,
      })
    }
    //[@4]响应函数(goState8改变2)
    const onGoState8Change2 = () => {
      let temp = [];
      for (let i = 0; i < goState8.statusNumber; i++) {
        temp.push( { D: '', P: '' } );
      }
      goState8.statusValues = temp;
      curCell?.setData({
        statusNumber: goState8.statusNumber,
        statusValues: goState8.statusValues,
      })
    }
    //[@4]响应函数(goState9改变)
    const onGoState9Change = () => {
      curCell?.setData({
        differenceNumber: goState9.differenceNumber,
        differenceValues: goState9.differenceValues,
      })
    }
    //[@4]响应函数(goState9改变2)
    const onGoState9Change2 = () => {
      let temp = [];
      for (let i = 0; i < goState9.differenceNumber; i++) {
        temp.push( { X: '', Y: '' } );
      }
      goState9.differenceValues = temp;
      curCell?.setData({
        differenceNumber: goState9.differenceNumber,
        differenceValues: goState9.differenceValues,
      })
    }
    //[@4]响应函数(goState10改变1)
    const onGoState10Change = () => {
      curCell?.setData({
        inSignalsNumber: goState10.inSignalsNumber
      })
    }
    //[@4]响应函数(goState10改变2)
    const onGoState10Change2 = () => {
      curCell?.setData({
        inSignalsNumber: goState10.inSignalsNumber,
      })
      //改变连接桩个数
      let tempN : Node;
      tempN = curCell as Node;
      console.log(tempN.getPortsByGroup("in").length);

      if(tempN.getPortsByGroup("in").length < goState10.inSignalsNumber){
        let n = goState10.inSignalsNumber - tempN.getPortsByGroup("in").length;
        for (let i = 0; i < n; i++) {
          let inN = "in" + (tempN.getPortsByGroup("in").length + 1);
          tempN.addPort({
            group: 'in',
            id: inN,
            attrs: {
              text: {
                text: inN
              }
            },
          });

        }
      }
      else if(tempN.getPortsByGroup("in").length > goState10.inSignalsNumber){
        let m =  tempN.getPortsByGroup("in").length - goState10.inSignalsNumber;
        for (let i = 0; i < m; i++) {
          let s = "in" + (goState10.inSignalsNumber + i + 1);
          // tempN.removePortAt(tempN.getPortsByGroup("in").length - 1);
          tempN.removePort(s);
        }
      }
    }
    //[@4]响应函数(goState11改变1)
    const onGoState11Change = () => {
      curCell?.setData({
        inSignalsNumber: goState11.inSignalsNumber,
        succeedNumber: goState11.succeedNumber,
      })
    }
    //[@4]响应函数(goState11改变2)
    const onGoState11Change2 = () => {
      curCell?.setData({
        inSignalsNumber: goState11.inSignalsNumber,
      })
      //改变连接桩个数
      let tempN : Node;
      tempN = curCell as Node;
      // console.log(tempN.getPortsByGroup("in").length);

      if(tempN.getPortsByGroup("in").length < goState11.inSignalsNumber){
        let n = goState11.inSignalsNumber - tempN.getPortsByGroup("in").length;
        for (let i = 0; i < n; i++) {
          let inN = "in" + (tempN.getPortsByGroup("in").length + 1);
          tempN.addPort({
            group: 'in',
            id: inN,
            attrs: {
              text: {
                text: inN
              }
            },
          });

        }
      }
      else if(tempN.getPortsByGroup("in").length > goState11.inSignalsNumber){
        let m =  tempN.getPortsByGroup("in").length - goState11.inSignalsNumber;
        for (let i = 0; i < m; i++) {
          let s = "in" + (goState11.inSignalsNumber + i + 1);
          // tempN.removePortAt(tempN.getPortsByGroup("in").length - 1);
          tempN.removePort(s);
        }
      }
    }
    //[@4]响应函数(goState12改变1)
    const onGoState12Change = () => {
      curCell?.setData({
        outSignalsNumber: goState12.outSignalsNumber,
        outStatusValues: goState12.outStatusValues,
      })
    }
    //[@4]响应函数(goState12改变2)
    const onGoState12Change2 = () => {
      curCell?.setData({
        outSignalsNumber: goState12.outSignalsNumber,
      })
      //改变连接桩个数
      let tempN : Node;
      tempN = curCell as Node;
      // console.log(tempN.getPortsByGroup("in").length);

      if(tempN.getPortsByGroup("out").length < goState12.outSignalsNumber){
        let n = goState12.outSignalsNumber - tempN.getPortsByGroup("out").length;
        for (let i = 0; i < n; i++) {
          let outN = "out" + (tempN.getPortsByGroup("out").length + 1);
          tempN.addPort({
            group: 'out',
            id: outN,
            attrs: {
              text: {
                text: outN
              }
            },
          });

        }
      }
      else if(tempN.getPortsByGroup("out").length > goState12.outSignalsNumber){
        let m =  tempN.getPortsByGroup("out").length - goState12.outSignalsNumber;
        for (let i = 0; i < m; i++) {
          let s = "in" + (goState12.outSignalsNumber + i + 1);
          // tempN.removePortAt(tempN.getPortsByGroup("in").length - 1);
          tempN.removePort(s);
        }
      }

      let tempV = [];
      //初始化outStatusValues
      for (let i = 0; i < goState12.outSignalsNumber; i++) {
        tempV.push( { p:"p"+(i+1), value: ''  } );
      }
      goState12.outStatusValues = tempV;
      curCell?.setData({
        outStatusValues: goState12.outStatusValues,
      });
    }
    //[@4]响应函数(goState14改变1)
    const onGoState14Change = () => {
      curCell?.setData({
        inSignalsNumber: goState14.inSignalsNumber,
        linearCoefficients: goState14.linearCoefficients,
      })
    }
    //[@4]响应函数(goState14改变)
    const onGoState14Change2 = () => {
      curCell?.setData({
        inSignalsNumber: goState14.inSignalsNumber,
      })
      //改变连接桩个数
      let tempN : Node;
      tempN = curCell as Node;
      // console.log(tempN.getPortsByGroup("in").length);

      if(tempN.getPortsByGroup("in").length < goState14.inSignalsNumber){
        let n = goState14.inSignalsNumber - tempN.getPortsByGroup("in").length;
        for (let i = 0; i < n; i++) {
          let inN = "in" + (tempN.getPortsByGroup("in").length + 1);
          tempN.addPort({
            group: 'in',
            id: inN,
            attrs: {
              text: {
                text: inN
              }
            },
          });

        }
      }
      else if(tempN.getPortsByGroup("in").length > goState14.inSignalsNumber){
        let m =  tempN.getPortsByGroup("in").length - goState14.inSignalsNumber;
        for (let i = 0; i < m; i++) {
          let s = "in" + (goState14.inSignalsNumber + i + 1);
          // tempN.removePortAt(tempN.getPortsByGroup("in").length - 1);
          tempN.removePort(s);
        }
      }

      let tempV = [];
      //初始化outStatusValues
      for (let i = 0; i < goState14.inSignalsNumber; i++) {
        tempV.push( { a:"a"+(i+1), value: ''  } );
      }
      goState14.linearCoefficients = tempV;
      curCell?.setData({
        linearCoefficients: goState14.linearCoefficients,
      });

    }
    //[@4]响应函数(goState15改变)
    const onGoState15Change = () => {
      curCell?.setData({
        V1: goState15.V1,
        V2: goState15.V2,
        V3: goState15.V3,
        V4: goState15.V4,
        P1: goState15.P1,
        P2: goState15.P2,
      })
    }


    //[1]中间画布
    const buildGraph = () => {
      const magnetAvailabilityHighlighter = {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#fff',
            stroke: '#47C769',
          },
        },
      };

      //新建画布
      graph = new Graph({
        container: document.getElementById('container') as HTMLElement,
        width: containerWidth.value,
        height: window.innerHeight - 120,
        panning: false,
        background: {
          color: '#F2F7FA', //#F2F7FA
        },
        grid: {
          visible: false,
          type: 'doubleMesh',
          args: [
            {
              color: '#eee', // 主网格线颜色
              thickness: 1, // 主网格线宽度
            },
            {
              color: '#ddd', // 次网格线颜色
              thickness: 1, // 次网格线宽度
              factor: 4, // 主次网格线间隔
            },
          ],
        },
        highlighting: {
          magnetAvailable: magnetAvailabilityHighlighter,
          magnetAdsorbed: {
            name: 'stroke',
            args: {
              attrs: {
                fill: '#fff',
                stroke: '#31d0c6',
              },
            },
          },
        },
        //鼠标滚轮设置缩放
        mousewheel: {
          enabled: true,
          zoomAtMousePosition: true,
          modifiers: 'ctrl',
          minScale: 0.5,
          maxScale: 3,
        },
        connecting: {
          allowBlank: false,    //是否允许连接到画布空白位置的点，默认为 true
          allowLoop: false,     //是否允许创建循环连线，即边的起始节点和终止节点为同一节点，默认为 true
          allowNode: false,     //是否允许边链接到节点（非节点上的链接桩），默认为 true
          allowEdge: false,     //是否允许边链接到另一个边，默认为 true
          highlight: true,
          //设置路由为曼哈顿路由
          /*router: {
            name: 'manhattan',
            args: {
              padding: 20,
            },
          },*/
          //
          connector: {
            name: 'jumpover',
            args: {
              radius: 0,
            },
          },
          anchor: 'center',
          connectionPoint: 'anchor',
          snap: {
            radius: 20,
          },
          //通过该方法可以自定义新建的边的样式
          createEdge() {
            return new Shape.Edge({
              // labelAddable: true,    //点击非文本位置是否新建 label, 默认true
              data: {
                edgeNumber: null,
              },
              attrs: {
                line: {
                  stroke: '#8f8f8f',
                  strokeWidth: 2,
                  targetMarker: {
                    name: 'block',
                    width: 12,
                    height: 8,
                  },
                },
              },
              labels: [
                {
                  attrs: {
                    id: 'edgeNumber',
                    label: {
                      text: '',
                    },
                  },
                },
              ],
              // tools: ['edge-editor'],
              zIndex: 0,
            })
          },
          //点击 magnet 时 根据 validateMagnet 返回值来判断是否新增边，
          // 触发时机是 magnet 被按下，如果返回 false ，则没有任何反应，
          // 如果返回 true ，会在当前 magnet 创建一条新的边。
          validateMagnet(sourceView){
            console.log("validateMagnet--------->");

            if ( sourceView.magnet.getAttribute('port') !== 'out') {
              return false;
            }
            return true;
          },
          //在移动边的时候判断连接是否有效，如果返回 false ，当鼠标放开的时候，不会连接到当前元素，否则会连接到当前元素。
          validateConnection({ sourceView, targetView, targetMagnet }) {
            console.log("validateConnection--------->");

            if ( targetMagnet.getAttribute('port') === 'out' ) {
              return false;
            }
            return true;
          },
        },


      });

      //[1.1]使用磁吸线
      graph.use(
          new Snapline({
            enabled: true,
          }),
      );
      //[1.2]使用键盘事件
      graph.use(
          new Keyboard({
            enabled: true,
          }),
      );
      //[1.3]Cell可被选择
      graph.use(
          new Selection({
            enabled: true,    //可被选择
            multiple: true,
            rubberband: true, // 启用框选
            modifiers: 'ctrl',
            showNodeSelectionBox: true,   //选中node节点设置选中框，默认false
            //showEdgeSelectionBox: true,   //选中edge设置选中框，默认false
          }),
      );


    };


    //[2]左侧模板
    const buildStencil = () => {
      stencil = new Stencil({
        title: 'Go法',
        target: graph,
        collapsable: true,
        // stencilGraphWidth: 260,
        stencilGraphHeight: window.innerHeight - 120,
        search: {rect: true},

        groups: [
          /*{
            name: 'pre',
            title: 'pre',
            graphHeight: 100,
            collapsed: true,
            layoutOptions: {
              //每行几列
              columns: 2,
              //左侧边距
              marginX: 0,
            },
          },*/
          {
            name: 'basic',
            title: '基础节点',
            graphHeight: 560,
            collapsed: true,
            layoutOptions: {
              //每行几列
              columns: 2,
              //左侧边距
              marginX: 0,
            },
          },
          {
            name: 'go-basic',
            title: 'GO法基本单元',
            graphHeight: 650,
            collapsed: false,
            layoutOptions: {
              columns: 2,
              marginX: 0,
              columnWidth: 100,
            }

          },
        ],
      });
      //将节点挂在到页面

      document.querySelector('#stencil')?.append(stencil.container);

    };




    //[3]左侧模板加载数据
    const stencilLoadData = () => {
      stencil.load([ rectBlock, circleBlock, ellipseBlock, polygonBlock, polylineBlock,
            pathBlock, imageBlock, textBlock],
          'basic');

      stencil.load([goCell1, goCell2, goCell3, goCell4, goCell5, goCell6,
        goCell7, goCell8, goCell9, goCell10, goCell11, goCell12,
        goCell14, goCell15, goCell16, goCell17], 'go-basic');


    }


    //[@1].键盘事件绑定
    const keyboardEvent = ()=>{
      //[@1.1]delete
      graph.bindKey('delete', () => {
        const cells = graph.getSelectedCells();
        const nodeIds = [];
        if (cells.length) {


          //[1].获取所有选中节点的 id
          for (let i = 0; i < cells.length; i++) {
            if(cells[i].isNode()){
              nodeIds.push(cells[i].id)
            }
          }

          //[2].通过选中节点的 id 获取所有的选中节点 对象]
          const allNodes = graph.getNodes();
          const deleteNodes = [];
          for (let i = 0; i < allNodes.length; i++) {
            for (let j = 0; j < nodeIds.length; j++) {
              if(allNodes[i].id === nodeIds[j]){
                deleteNodes.push(allNodes[i]);
              }
            }
          }

          //[3]. 设置 编号
          for (let i = 0; i < allNodes.length; i++) {
            for (let j = 0; j < deleteNodes.length; j++) {

              if(allNodes[i].getData().goNumber > deleteNodes[j].getData().goNumber){

                //[3.1].若节点大于要删除的节点， 其 data 中的 goNumber 减 1
                allNodes[i].setData({
                  goNumber: allNodes[i].getData().goNumber - 1
                });

                //[3.2].若节点大于要删除的节点， 重置 label
                let s = allNodes[i].getData()?.goType + "-" + allNodes[i].getData()?.goNumber;
                console.log(s); //重置节点 label/text
                allNodes[i]?.attr('label/text', s);
                allNodes[i]?.attr('label/fontSize', 16);

              }
            }
          }


          //[!!!!!].删除所有选中 对象
          for (let i = 0; i < cells.length; i++) {
            graph.removeCell(cells[i]);
          }

        }

        console.log("delete按钮在graph中点击了");
        console.log(cells);

      }, 'keydown');

    }


    //[@2].node事件绑定
    // 控制连接桩显示/隐藏
    const showPorts = (ports, show: boolean) => {
      for (let i = 0, len = ports.length; i < len; i += 1) {
        ports[i].style.visibility = show ? 'visible' : 'hidden'
      }
    }
    const nodeEvent = ()=>{
      //[@2.1]node:selected
      graph.on('node:selected', (cell) => {
        console.log("选择Cell");
        console.log(cell);
        console.log(cell.cell.getAttrs());

        document.getElementById("goNumberInput").style.color = "black";
        document.getElementById("goNumberInput").style.border = "1px solid #d9d9d9";

        // curCell?.attr('body/stroke', null);

        //新的节点赋值
        curCell = cell.cell;

        if( curCell.isNode() ){
          //将labelText进行赋值（labelText有可能在text/text中，也有可能在label/text中）
          /*let labelText = null;
          if (cell.cell.getAttrs()?.text?.text)
            labelText = cell.cell.getAttrs()?.text.text;
          if (cell.cell.getAttrs()?.label?.text)
            labelText = cell.cell.getAttrs()?.label.text;*/


          goStateBasic.deviceName = cell.cell.getData()?.deviceName;
          goStateBasic.goType = cell.cell.getData()?.goType;
          goStateBasic.goNumber = cell.cell.getData()?.goNumber;

          if( curCell.getData()?.goType == 3 ||
              curCell.getData()?.goType == 6 ||
              curCell.getData()?.goType == 7 ||
              curCell.getData()?.goType == 16 ||
              curCell.getData()?.goType == 17){
            goState3_6_7_16_17.Pc_0 = cell.cell.getData()?.Pc_0;
            goState3_6_7_16_17.Pc_1 = cell.cell.getData()?.Pc_1;
            goState3_6_7_16_17.Pc_2 = cell.cell.getData()?.Pc_2;
          }


          if( curCell.getData()?.goType == 1 ){
            goState1.Pc_1 = cell.cell.getData()?.Pc_1;
            goState1.Pc_2 = cell.cell.getData()?.Pc_2;
          }
          else if( curCell.getData()?.goType == 2 ){
            goState2.inSignalsNumber = cell.cell.getData()?.inSignalsNumber;
          }
          else if( curCell.getData()?.goType == 4 ){
            goState4.signalNumber = cell.cell.getData()?.signalNumber;
            goState4.signalCombinationValues = cell.cell.getData()?.signalCombinationValues;
            goState4.signalStatusValues = cell.cell.getData()?.signalStatusValues;
          }
          else if( curCell.getData()?.goType == 5 ){
            goState5.signalStatusNumber = cell.cell.getData()?.signalStatusNumber;
            goState5.signalStatusValues = cell.cell.getData()?.signalStatusValues;
          }
          else if( curCell.getData()?.goType == 8 ){
            goState8.statusNumber = cell.cell.getData()?.statusNumber;
            goState8.statusValues = cell.cell.getData()?.statusValues;
          }
          else if( curCell.getData()?.goType == 9 ){
            goState9.differenceNumber = cell.cell.getData()?.differenceNumber;
            goState9.differenceValues = cell.cell.getData()?.differenceValues;
          }
          else if( curCell.getData()?.goType == 10 ){
            goState10.inSignalsNumber = cell.cell.getData()?.inSignalsNumber;
          }
          else if( curCell.getData()?.goType == 11 ){
            goState11.inSignalsNumber = cell.cell.getData()?.inSignalsNumber;
            goState11.succeedNumber = cell.cell.getData()?.succeedNumber;
          }
          else if( curCell.getData()?.goType == 12 ){
            goState12.outSignalsNumber = cell.cell.getData()?.outSignalsNumber;
            goState12.outStatusValues = cell.cell.getData()?.outStatusValues;
          }
          else if( curCell.getData()?.goType == 14 ){
            goState14.inSignalsNumber = cell.cell.getData()?.inSignalsNumber;
            goState14.linearCoefficients = cell.cell.getData()?.linearCoefficients;
          }
          else if( curCell.getData()?.goType == 15 ){
            goState15.V1 = cell.cell.getData()?.V1;
            goState15.V2 = cell.cell.getData()?.V2;
            goState15.V3 = cell.cell.getData()?.V3;
            goState15.V4 = cell.cell.getData()?.V4;
            goState15.P1 = cell.cell.getData()?.P1;
            goState15.P2 = cell.cell.getData()?.P2;
          }


        }




      });
      //[@2.2]node:unselected
      graph.on('node:unselected', (cell) => {
        console.log("取消选择");
        console.log(cell);

        goStateBasic.deviceName = null;
        goStateBasic.goType = null;
        goStateBasic.goNumber = null;

        goState3_6_7_16_17.Pc_0 = null;
        goState3_6_7_16_17.Pc_1 = null;
        goState3_6_7_16_17.Pc_2 = null;

        //取消选择将数据置空不显示
        goState1.Pc_1 = null;
        goState1.Pc_2 = null;

        goState2.inSignalsNumber = null;

        goState4.signalNumber = null;
        goState4.signalCombinationValues = null;
        goState4.signalStatusValues = null;

        goState5.signalStatusNumber = null;
        goState5.signalStatusValues = null;

        goState8.statusNumber = null;
        goState8.statusValues = null;

        goState9.differenceNumber = null;
        goState9.differenceValues = null;

        goState10.inSignalsNumber = null;

        goState11.inSignalsNumber = null;
        goState11.succeedNumber = null;

        goState12.outSignalsNumber = null;
        goState12.outStatusValues = null;

        goState14.inSignalsNumber = null;
        goState14.linearCoefficients = null;

        goState15.V1 = null;
        goState15.V2 = null;
        goState15.V3 = null;
        goState15.V4 = null;
        goState15.P1 = null;
        goState15.P2 = null;

      });
      //[@2.3]node:added
      graph.on('node:added', ({ node, index }) => {

        console.log("新增一个节点");
        //全局节点数 加 1
        console.log(totalNodeNumber.value);
        totalNodeNumber.value += 1;
        console.log(totalNodeNumber.value);

        //自动设置 goNumber 和 label
        node.setData({
          goNumber: totalNodeNumber.value,
        });
        let s = node.getData()?.goType + "-" + node.getData()?.goNumber;
        node?.attr('label/text', s);
        node?.attr('label/fontSize', 16);

        //增加链接桩
        if ( node.getData()?.goType === 1 ||
            node.getData()?.goType === 2 ||
            node.getData()?.goType === 3 ||
            node.getData()?.goType === 10){

          node.addPort({
            id: 'in',
            group: 'left'
          });
          node.addPort({
            id: 'out',
            group: 'right'
          });

        }
        else if ( node.getData()?.goType === 5 ) {
          node.addPort({
            id: 'out',
            group: 'right'
          });
        }
        else if ( node.getData()?.goType === 6 ||
            node.getData()?.goType === 7  ) {

          node.addPort({
            id: 'in1',
            group: 'left'
          });
          node.addPort({
            id: 'in2',
            group: 'top'
          });
          node.addPort({
            id: 'out',
            group: 'right'
          });
        }


        //将新增 节点 交给 vuex管理
        store.dispatch('addNode', node);
      });
      //[@2.4]node:removed
      graph.on('node:removed', (cell) => {

        console.log("删除一个节点");
        totalNodeNumber.value -= 1;


        //循环 将每一个节点编号大于 删除节点 的 goNumber 减 1；并改变编号
        //在 键盘 delete 绑定中实现，这里实现出现一丝问题

        /*let totalNodes = graph.getNodes();
        for (let i = 0; i < totalNodes.length; i++) {
          if( totalNodes[i].getData().goNumber > cell.node.getData().goNumber){
            totalNodes[i].setData({
              goNumber: totalNodes[i].getData().goNumber - 1
            });

            let s = totalNodes[i].getData()?.goType + "-" + totalNodes[i].getData()?.goNumber;
            console.log(s); //重置节点 label/text
            totalNodes[i]?.attr('label/text', s);
            totalNodes[i]?.attr('label/fontSize', 16);
          }
        }*/


        store.dispatch('removeNode', cell.node);

      });
      //[@2.5]node:changed
      graph.on('node:changed', (cell) => {
        console.log("修改一个节点");
        store.dispatch('changeNode', cell.node);
      });
      //[@2.6]node:mouseenter
      graph.on('node:mouseenter', ({node}) => {
        //链接桩显式
        const container = document.getElementById('container')!
        const ports = container.querySelectorAll(
            '.x6-port-body',
        )
        showPorts(ports, true)

        //连接点位置改变
        if ( node?.getData().goType === 6 ||
            node?.getData().goType === 7 ) {
          // console.log(node?.getData().goType);

          node.addTools([
            {
              name: 'button',
              args: {
                x: 10,
                y: 10,
                offset: { x: 0, y: 0 },
                markup: [
                  {
                    tagName: 'circle',
                    selector: 'button',
                    attrs: {
                      r: 3,
                      stroke: '#fe854f',
                      'stroke-width': 3,
                      fill: 'white',
                      cursor: 'pointer',
                    },
                  },
                  {
                    tagName: 'text',
                    textContent: '^',
                    selector: 'icon',
                    attrs: {
                      fill: '#fe854f',
                      'font-size': 8,
                      'text-anchor': 'middle',
                      'pointer-events': 'none',
                      y: '0.3em',
                    },
                  },
                ],
                onClick({view}) {
                  // console.log(view.cell);

                  // console.log(view.cell.getPort('in2').group);
                  if ( view.cell.getPort('in2').group === "top") {
                    view.cell.removePort('in2');
                    view.cell.addPort({
                      group: 'bottom',
                      id: "in2",
                    });
                  }
                  else if ( view.cell.getPort('in2').group === "bottom" ) {
                    view.cell.removePort('in2');
                    view.cell.addPort({
                      group: 'top',
                      id: "in2",
                    });
                  }

                },
              },
            },
          ])

        }

      })
      //[@2.7]node:mouseleave
      graph.on('node:mouseleave', ({node}) => {
        //链接桩隐藏
        const container = document.getElementById('container')!
        const ports = container.querySelectorAll(
            '.x6-port-body',
        )
        showPorts(ports, false);

        //去除按钮工具
        if ( node?.getData().goType === 6 ) {
          console.log(node?.getData().goType);

          if (node.hasTool("button")) {
            node.removeTool("button");
          }

        }

      })

    }


    //[@3].edge事件绑定
    const edgeEvent = ()=>{
      //[@3.1]edge:selected
      graph.on('edge:selected', (cell) => {
        console.log("边被选择");
        console.log(cell);

        document.getElementById("edgeNumberInput").style.color = "black";
        document.getElementById("edgeNumberInput").style.border = "1px solid #d9d9d9";

        isShowEdgeNumberInput.value = true;
        curEdge = cell.edge;

        edgeNumber.value = cell.cell.getData()?.edgeNumber

        //增加边上工具
        /*cell.edge.addTools(['vertices','segments']);*/


      })
      //[@3.2]edge:unselected
      graph.on('edge:unselected', (cell) => {
        console.log("边取消选择");
        console.log(cell.edge);

        isShowEdgeNumberInput.value = false;
        curEdge = null;

        edgeNumber.value = null;

      })
      //[@3.3]edge:added
      graph.on('edge:added', (cell)=>{
        console.log("新增一个边");
        //全局边数 加 1
        totalEdgeNumber.value += 1;

        cell.edge.setData({
          edgeNumber: totalEdgeNumber.value,
        });

        /*cell.edge.setLabelAt(0, {
          attrs: {
            label: {
              text: totalEdgeNumber.value,
            },
          },
          position: 20,
        });*/
        /*cell.edge.attr('labels/label/text', totalEdgeNumber.value);
        cell.edge.attr('label/fontSize', 16);*/

        store.dispatch('addEdge', cell.edge);
      });

      //[@3.4]edge:removed
      graph.on('edge:removed', (cell) => {
        console.log("删除一个边");
        //全局边数 减 1
        totalEdgeNumber.value -= 1;

        //获取所有的边
        const totalEdges = graph.getEdges();

        for (let i = 0; i < totalEdges.length; i++) {
          //如果边的编号 大于 被删除边的编号， 其编号 减 1， 并重置label
          //这里 同时删除 多边 时 不会出错
          if( totalEdges[i].getData().edgeNumber > cell.edge.getData().edgeNumber){
            totalEdges[i].setData({
              edgeNumber: totalEdges[i].getData().edgeNumber - 1,
            });
            totalEdges[i].setLabelAt(0, {
              attrs: {
                label: {
                  text: totalEdges[i].getData().edgeNumber,
                }
              }
            });

          }

        }

        store.dispatch('removeEdge', cell.edge);
      });
      //[@3.5]edge:changed
      graph.on('edge:changed', (cell) => {
        console.log("修改一个边");
        store.dispatch('changeEdge', cell.edge);
      });

      //[@3.6]edge:mouseenter
      graph.on('edge:mouseenter', ({edge}) => {
        edge.addTools(
            {
              name: 'button-remove',
              args: {
                x: 0,
                y: 0,
              },
            },
        );
      });

    }



    // const screenWidth = ref(window.innerWidth);
    const screenHeight = ref(window.innerHeight);
    const containerWidth = ref(document.getElementById("panel")?.getBoundingClientRect().width);

    const handleResize = () => {
      screenHeight.value = window.innerHeight;
      containerWidth.value = document.getElementById("panel")?.getBoundingClientRect().width;

      const property = document.querySelector('#property') as HTMLDivElement;

      graph.resize( containerWidth.value, screenHeight.value - 120 );
      property.style.height = (screenHeight.value - 140).toString()+"px";

    }
    //[!!!]onMounted()
    onMounted(() => {

      window.addEventListener("resize", handleResize);
      const property = document.querySelector('#property') as HTMLDivElement;
      property.style.height = (screenHeight.value - 140).toString()+"px";

      buildGraph();       //创建画布
      buildStencil();     //左侧模板
      stencilLoadData();  //左侧模板加载数据

      keyboardEvent();    //graph键盘事件绑定
      nodeEvent();        //graph节点事件绑定
      edgeEvent();        //graph边事件绑定



      graph.on('cell:mouseenter', ({ cell }) => {
        /*if (cell.isNode()) {
          cell.addTools([
            {
              name: 'boundary',
              args: {
                attrs: {
                  fill: '#7c68fc',
                  stroke: '#333',
                  'stroke-width': 1,
                  'fill-opacity': 0.2,
                },
              },
            },
            {
              name: 'button-remove',
              args: {
                x: 0,
                y: 0,
                offset: { x: 10, y: 10 },
              },
            },
          ])
        } else {
          cell.addTools(['vertices', 'segments'])
        }*/


        if( !cell.isNode()) {
          cell.addTools(['vertices', 'segments'])
        }



      })




      graph.on('cell:mouseleave', ({ cell }) => {
        cell.removeTools()
      })


    });




    return {

      rightBarOptions,
      // screenWidth,
      containerWidth,

      edgeNumber,
      isShowEdgeNumberInput,

      graphMove,

      goStateBasic,
      goState3_6_7_16_17,
      goState1,
      goState2,
      goState4,
      goState5,
      goState8,
      goState9,
      goState10,
      goState11,
      goState12,
      goState14,
      goState15,

      handleButtonClick,
      saveGraphToFile,
      openGraphFromFile,
      screenHeight,


      totalNodeNumber,
      totalEdgeNumber,

      graphToolsResponse,
      edgeNumberChange,
      onGoNumberChange,
      onEdgeNumberChange,

      onGoStateBasicChange,
      onGoState3_6_7_16_17Change,
      onGoState1Change,
      onGoState2Change,
      onGoState2Change2,
      onGoState4Change,
      onGoState4Change2,
      onGoState4Change3,
      onGoState5Change,
      onGoState5Change2,
      onGoState8Change,
      onGoState8Change2,
      onGoState9Change,
      onGoState9Change2,
      onGoState10Change,
      onGoState10Change2,
      onGoState11Change,
      onGoState11Change2,
      onGoState12Change,
      onGoState12Change2,
      onGoState14Change,
      onGoState14Change2,
      onGoState15Change,
    }
  }


})
</script>

<style scoped>
#demo1{
  margin: 10px 10px;
}

#stencil {
  overflow: auto;
}

.config {
  overflow: auto;
  background-color: #ffffff;
}


.goStateTable {
  width: 230px;
  margin: 10px auto;
}
.goStateTable tr th {
  border: 1px solid black;
  background-color: #94ffdf;
}

.goStateTable tr td {
  border: 1px solid black;
}



</style>