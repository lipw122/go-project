//createNode方式
import {Shape} from "@antv/x6";

/*const bizNode1 = graph.createNode({
    id: 'stencil1',
    shape: "rect",
    width: 100,
    height: 50,
    attrs: {
        label: {
            fontSize: 12,
            text: "业务节点1",
        },
    }
});*/
//构造函数方式
const bizNode2 = new Shape.Rect({
    width: 100,
    height: 50,
    attrs: {
        label: {
            fontSize: 12,
            text: "业务节点2",
        },
    }
});
//节点元数据方式
/*const bizNode3: Node.Metadata = {
    width: 100,
  height: 50,
  attrs:{
    label: {
      fontSize: 12,
      text: "业务节点3",
    },
  }
}*/

/*
[共 13 个基本图形 ]
1.Rect:矩形; 2.Circle:圆形; 3.Ellipse:椭圆; 4.Polygon:多边形; 5.Polyline:多段线
6.Path:路径; 7.Image:图片; 8.HTML:渲染HTML片段; 9.TextBlock:文本节点; 10.BorderedImage:带边框的图片;
11.EmbeddedImage:内嵌入矩形的图片; 12.InscribedImage:内嵌入椭圆的图片; 13.Cylinder:圆柱;
[共 3 个基本连线 ]
1.Edge:边; 2.DoubleEdge:双线边; 3.ShadowEdge:阴影边;
*/
//[基本图形] 1.Rect
const rectBlock = new Shape.Rect({
    //x: 100,         //Number，必选，节点位置的x值
    //y: 40,          //Number，必选，节点位置的y值
    width: 100,     //Number，可选，节点大小的width值
    height: 50,    //Number，可选，节点大小的height值
    attrs: {
        label: {
            contentediable: "true",
            fontSize: 12,
            text: '1.Rect',
        },
        body: {
            fil: '#efdbff',
            stroke: '#9254de',
            rx: 4,
            ry: 4,
        }
    },
    ports: {
        groups: {
            in: {
                position: 'left',
                label: {
                    position: {
                        name : 'left',
                        args: {
                            x: -5,
                            y: 0, // 强制指定 y 坐标为 10，替换计算结果中的 y 坐标
                            attrs: {
                                text: {
                                    // fill: 'red', // 设置标签颜色为红色
                                },
                            },
                        },
                    },
                },
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#31d0c6',
                        fill: '#fff',
                    }
                }
            },
            out: {
                position: 'right',
                label: {
                    position: 'right',
                },
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#31d0c6',
                        fill: '#fff',
                    }
                }
            },
        },
        items: [
            {
                id: 'in',
                group: 'in',
                tip: 'ins',
                attrs: {
                    text: {
                        text: "",
                    }
                }
            },
            {
                id: 'out',
                group: 'out',
                attrs: {
                    text: {
                        text: "",
                    }
                }
            },
        ]

    },
});
//[基本图形] 2.Circle
const circleBlock = new Shape.Circle({
    width: 50,
    height: 50,
    attrs: {
        label: {
            fontSize: 12,
            text: '2.Circle',
        },

    }
});
//[基本图形] 3.Ellipse
const ellipseBlock = new Shape.Ellipse({
    width: 100,
    height: 50,
    attrs: {
        body: {},
        label: {
            fontSize: 12,
            text: '3.Ellipse',
        },

    }
});
//[基本图形] 4.Polygon
const polygonBlock = new Shape.Polygon({
    width: 100,
    height: 50,
    attrs: {
        body: {
            fill: '#efdbff',
            stroke: '#9254de',
            refPoints: '0,10, 10,0, 20,10, 10,20',
        },
        label: {
            fontSize: 12,
            text: '4.Polygon',
        },

    }
});
//[基本图形] 5.Polyline
const polylineBlock = new Shape.Polyline({
    width: 50,
    height: 50,
    attrs: {
        body: {
            refPoints: '0,0, 10,10, 0,10',
        },
        label: {
            fontSize: 12,
            text: '5.Polyline',
        },

    }
});
//[基本图形] 6.Path
const pathBlock = new Shape.Path({
    width: 100,
    height: 50,
    // path: 'M 0 5 10 0 C 20 0 20 20 10 20 L 0 15 Z',
    attrs: {
        body: {
            fill: '#efdbff',
            stroke: '#9254de',
            refD: 'M 0 5 10 0 C 20 0 20 20 10 20 L 0 15 Z',
        },
        label: {
            fontSize: 12,
            text: '6.Path',
        },

    }
});
//[基本图形] 7.Image
const imageBlock = new Shape.Image({
    width: 100,
    height: 50,
    attrs: {
        body: {
            imageUrl: 'https://gw.alipayobjects.com/os/s/prod/antv/assets/image/logo-with-text-73b8a.svg',
        },
        /*label:{
          fontSize: 12,
          text: '7.Image',
        },*/
    }
});
//[基本图形] 8.HTML
/*const htmlBlock = new Shape.HTML({
  width: 100,
  height: 50,
  html() {
    const wrap = document.createElement("div");
    wrap.innerText = "我是html"
    return wrap;
  },
  attrs: {
    body: {},
    label: {
      fontSize: 12,
      text: '8.HTML',
    },

  }
});*/
//[基本图形] 9.TextBlock
const textBlock = new Shape.TextBlock({
    //x: 300,         //Number，必选，节点位置的x值
    //y: 40,          //Number，必选，节点位置的y值
    width: 100,     //Number，可选，节点大小的width值
    height: 50,    //Number，可选，节点大小的height值
    attrs: {
        label: {
            text: `9.TextBlock`,
            contenteditable: 'true',
        },
        body: {
            fil: '#efdbff',
            stroke: '#9254de',
            rx: 4,
            ry: 4,
        }
    },
    data: {
        labelText: 'infor1',
        userId: '张三',
        roleId: '管理员1',
    }

});


export {
    rectBlock,
    circleBlock,
    ellipseBlock,
    polygonBlock,
    polylineBlock,
    pathBlock,
    imageBlock,
    textBlock
}