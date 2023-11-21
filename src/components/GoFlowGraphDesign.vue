<template>
  <div id="go-flow-design">
    <a-row :gutter="[8,8]">

      <a-col :span="5">
        <div id = "stencil"></div>
      </a-col>

      <a-col :span="14">
        <div id="panelTool" style="display: flex">

          <div>

            <a-button type="text" shape="circle" @click="1">
              <img src="../assets/image/icon/saveGraph.svg" alt="保存go图" style="margin-bottom: 3px" />
            </a-button>

            {{screenHeight}}
            {{totalNodeNumber}}
            {{totalEdgeNumber}}

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

            </div>
          </div>
        </div>

      </a-col>

    </a-row>


  </div>
</template>

<script lang="ts">

import {defineComponent, ref} from "vue";
import {Cell, Edge, Graph, Shape} from "@antv/x6";
import {Stencil} from "@antv/x6-plugin-stencil";
import {useStore} from "vuex";
import {onMounted} from "vue";
import {Snapline} from "@antv/x6-plugin-snapline";
import {Keyboard} from "@antv/x6-plugin-keyboard";
import {Selection} from "@antv/x6-plugin-selection";
import {register} from "@antv/x6-vue-shape";
import GoFlowCell21 from "@/components/go_flow_cells/GoFlowCell21.vue";
import GoFlowCell22 from "@/components/go_flow_cells/GoFlowCell22.vue";
import GoFlowCell23 from "@/components/go_flow_cells/GoFlowCell23.vue";
import GoFlowCell24 from "@/components/go_flow_cells/GoFlowCell24.vue";
import GoFlowCell25 from "@/components/go_flow_cells/GoFlowCell25.vue";
import GoFlowCell26 from "@/components/go_flow_cells/GoFlowCell26.vue";
import GoFlowCell27 from "@/components/go_flow_cells/GoFlowCell27.vue";
import GoFlowCell28 from "@/components/go_flow_cells/GoFlowCell28.vue";
import GoFlowCell30 from "@/components/go_flow_cells/GoFlowCell30.vue";
import GoFlowCell35 from "@/components/go_flow_cells/GoFlowCell35.vue";
import GoFlowCell37 from "@/components/go_flow_cells/GoFlowCell37.vue";
import GoFlowCell38 from "@/components/go_flow_cells/GoFlowCell38.vue";
import GoFlowCell39 from "@/components/go_flow_cells/GoFlowCell39.vue";
import GoFlowCell40 from "@/components/go_flow_cells/GoFlowCell40.vue";

export default defineComponent({
  name: "GoFlowGraphDesign",

  setup() {

    //一些全局变量
    let rightBarOptions = ref("property");
    let graph: Graph;
    let stencil: Stencil;
    const totalNodeNumber = ref<number>(0);
    const totalEdgeNumber = ref<number>(0);
    let curCell: Cell | null;
    let curEdge: Edge | null;
    const store = useStore();




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
                  stroke: 'black',
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

    }

    //[2]左侧模板
    const buildStencil = () => {

      stencil = new Stencil({
        title: 'GoFlow法',
        target: graph,
        collapsable: true,
        // stencilGraphWidth: 260,
        stencilGraphHeight: window.innerHeight - 120,
        search: {rect: true},

        groups: [
          {
            name: 'go-flow-basic',
            title: 'Go-Flow法基本单元',
            graphHeight: 580,
            collapsed: false,
            layoutOptions: {
              columns: 2,
              marginX: 0,
              columnWidth: 100,
            }
          }
        ],
      });
      //将节点挂在到页面
      document.querySelector('#stencil')?.append(stencil.container);

    }

    //[3]左侧模板加载数据
    const stencilLoadData = () => {

      const groups = {
        top: {
          position: 'top',
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              stroke: '#5F95FF',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                // visibility: 'hidden',
              },
            },
          },
        },
        right: {
          position: 'right',
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              stroke: '#5F95FF',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                // visibility: 'hidden',
              },
            },
          },
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              stroke: '#5F95FF',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                // visibility: 'hidden',
              },
            },
          },
        },
        left: {
          position: 'left',
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              stroke: '#5F95FF',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                // visibility: 'hidden',
              },
            },
          },
        },
      };

      //注册自定义 vue 节点
      register({
        shape: 'go-flow-cell-21',
        component: GoFlowCell21,
      });
      register({
        shape: 'go-flow-cell-22',
        component: GoFlowCell22,
      });
      register({
        shape: 'go-flow-cell-23',
        component: GoFlowCell23,
      });
      register({
        shape: 'go-flow-cell-24',
        component: GoFlowCell24,
      });
      register({
        shape: 'go-flow-cell-25',
        component: GoFlowCell25,
      });
      register({
        shape: 'go-flow-cell-26',
        component: GoFlowCell26,
      });
      register({
        shape: 'go-flow-cell-27',
        component: GoFlowCell27,
      });
      register({
        shape: 'go-flow-cell-28',
        component: GoFlowCell28,
      });
      register({
        shape: 'go-flow-cell-30',
        component: GoFlowCell30,
      });
      register({
        shape: 'go-flow-cell-35',
        component: GoFlowCell35,
      });
      register({
        shape: 'go-flow-cell-37',
        component: GoFlowCell37,
      });
      register({
        shape: 'go-flow-cell-38',
        component: GoFlowCell38,
      });
      register({
        shape: 'go-flow-cell-39',
        component: GoFlowCell39,
      });
      register({
        shape: 'go-flow-cell-40',
        component: GoFlowCell40,
      });

      const goFlowCell21 = {
        shape: 'go-flow-cell-21',
        width: 60,
        height: 60,
        data: {
          deviceName: null,
          goFlowType: 21,
          goFlowNumber: null,
        },
        ports: {
          groups: { ...groups },
        },
      };
      const goFlowCell22 = {
        shape: 'go-flow-cell-22',
        width: 60,
        height: 60,
        data: {
          deviceName: null,
          goFlowType: 22,
          goFlowNumber: null,
        },
        ports: {
          groups: { ...groups },
        },
      };
      const goFlowCell23 = {
        shape: 'go-flow-cell-23',
        width: 60,
        height: 60,
        data: {
          deviceName: null,
          goFlowType: 23,
          goFlowNumber: null,
        },
        ports: {
          groups: { ...groups },
        },
      };
      const goFlowCell24 = {
        shape: 'go-flow-cell-24',
        width: 60,
        height: 60,
        data: {
          deviceName: null,
          goFlowType: 24,
          goFlowNumber: null,
        },
        ports: {
          groups: { ...groups },
        },
      };
      const goFlowCell25 = {
        shape: 'go-flow-cell-25',
        width: 60,
        height: 60,
        data: {
          deviceName: null,
          goFlowType: 25,
          goFlowNumber: null,
        },
        ports: {
          groups: { ...groups },
        },
      };
      const goFlowCell26 = {
        shape: 'go-flow-cell-26',
        width: 60,
        height: 60,
        data: {
          deviceName: null,
          goFlowType: 26,
          goFlowNumber: null,
        },
        ports: {
          groups: { ...groups },
        },
      };
      const goFlowCell27 = {
        shape: 'go-flow-cell-27',
        width: 60,
        height: 60,
        data: {
          deviceName: null,
          goFlowType: 27,
          goFlowNumber: null,
        },
        ports: {
          groups: { ...groups },
        },
      };
      const goFlowCell28 = {
        shape: 'go-flow-cell-28',
        width: 60,
        height: 60,
        data: {
          deviceName: null,
          goFlowType: 28,
          goFlowNumber: null,
        },
        ports: {
          groups: { ...groups },
        },
      };
      const goFlowCell30 = {
        shape: 'go-flow-cell-30',
        width: 60,
        height: 60,
        data: {
          deviceName: null,
          goFlowType: 30,
          goFlowNumber: null,
        },
        ports: {
          groups: { ...groups },
        },
      };
      const goFlowCell35 = {
        shape: 'go-flow-cell-35',
        width: 60,
        height: 60,
        data: {
          deviceName: null,
          goFlowType: 35,
          goFlowNumber: null,
        },
        ports: {
          groups: { ...groups },
        },
      };
      const goFlowCell37 = {
        shape: 'go-flow-cell-37',
        width: 60,
        height: 60,
        data: {
          deviceName: null,
          goFlowType: 37,
          goFlowNumber: null,
        },
        ports: {
          groups: { ...groups },
        },
      };
      const goFlowCell38 = {
        shape: 'go-flow-cell-38',
        width: 60,
        height: 60,
        data: {
          deviceName: null,
          goFlowType: 38,
          goFlowNumber: null,
        },
        ports: {
          groups: { ...groups },
        },
      };
      const goFlowCell39 = {
        shape: 'go-flow-cell-39',
        width: 60,
        height: 60,
        data: {
          deviceName: null,
          goFlowType: 39,
          goFlowNumber: null,
        },
        ports: {
          groups: { ...groups },
        },
      };
      const goFlowCell40 = {
        shape: 'go-flow-cell-40',
        width: 60,
        height: 60,
        data: {
          deviceName: null,
          goFlowType: 40,
          goFlowNumber: null,
        },
        ports: {
          groups: { ...groups },
        },
      };

      stencil.load([ goFlowCell21, goFlowCell22, goFlowCell23, goFlowCell24,
        goFlowCell25, goFlowCell26, goFlowCell27, goFlowCell28, goFlowCell30,
        goFlowCell35, goFlowCell37, goFlowCell38, goFlowCell39, goFlowCell40], 'go-flow-basic');


    }

    //[@1].键盘事件绑定
    const keyboardEvent = () => {

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
/*

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

*/

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
    const nodeEvent = () => {

      //[@2.1]node:selected
      graph.on('node:selected', ({ node }) => {

        console.log("goFlow , selected");
        console.log(node)
      });

      //[@2.3]node:added
      graph.on( 'node:added', ({ node, index }) => {

        totalNodeNumber.value = totalNodeNumber.value + 1;

        //由于自定义节点 的变化 是在 data 改变时渲染。而在added中还没有渲染，所有延迟执行
        setTimeout(() => {
          console.log("setTimeout");
          node.setData({
            goFlowNumber: totalNodeNumber.value,
          })
        }, 50);

        if ( node.getData()?.goFlowType === 21 ||
            node.getData()?.goFlowType === 22 ||
            node.getData()?.goFlowType === 23 ||
            node.getData()?.goFlowType === 24 ||
            node.getData()?.goFlowType === 28 ||
            node.getData()?.goFlowType === 30 ||
            node.getData()?.goFlowType === 40 ) {

          node.addPort({
            id: 'in',
            group: 'left'
          });
          node.addPort({
            id: 'out',
            group: 'right'
          });

        }
        else if ( node.getData()?.goFlowType === 26 ||
            node.getData()?.goFlowType === 27 ||
            node.getData()?.goFlowType === 35 ||
            node.getData()?.goFlowType === 37 ||
            node.getData()?.goFlowType === 38) {

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
        else if ( node.getData()?.goFlowType === 25 ){

          node.addPort({
            id: 'out',
            group: 'right'
          });

        }




        });
      //[@2.4]node:removed
      graph.on('node:removed', (cell) => {
        console.log("删除一个节点");
        totalNodeNumber.value -= 1;

        //循环 将每一个节点编号大于 删除节点 的 goNumber 减 1；并改变编号
        //在 键盘 delete 绑定中实现， GoGraphDesign  里实现出现一丝问题

        let totalNodes = graph.getNodes();
        for (let i = 0; i < totalNodes.length; i++) {
          if( totalNodes[i].getData().goFlowNumber > cell.node.getData().goFlowNumber){
            totalNodes[i].setData({
              goFlowNumber: totalNodes[i].getData().goFlowNumber - 1
            });

          }
        }

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
        if ( node?.getData().goFlowType === 26 ||
            node?.getData().goFlowType === 27 ||
            node?.getData().goFlowType === 35 ||
            node?.getData().goFlowType === 37 ||
            node?.getData().goFlowType === 38 ) {
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
        if ( node.getData()?.goFlowType === 26 ||
            node.getData()?.goFlowType === 27 ||
            node.getData()?.goFlowType === 35 ||
            node.getData()?.goFlowType === 37 ||
            node.getData()?.goFlowType === 38 ) {
          console.log(node?.getData().goType);

          if (node.hasTool("button")) {
            node.removeTool("button");
          }

        }

      })

    }

    //[@3].edge事件绑定
    const edgeEvent = () => {
      console.log("GoFlow-edgeEvent");
    }







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


    });


    return {
      rightBarOptions,
      screenHeight,
      totalNodeNumber,
      totalEdgeNumber,
    }
  }

})

</script>

<style scoped>

#go-flow-design{
  margin: 10px 10px;
}

#stencil {
  overflow: auto;
}


.config {
  overflow: auto;
  background-color: #ffffff;
}


</style>