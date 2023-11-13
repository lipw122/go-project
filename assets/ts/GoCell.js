//GO法基本图元1: 两状态单元
import { Shape } from "@antv/x6";
//GO法基本图元1: 两状态单元
var goCell1 = new Shape.Circle({
    width: 60,
    height: 60,
    data: {
        deviceName: null,
        goType: 1,
        goNumber: null,
        Pc_0: null,
        Pc_1: null,
    },
    attrs: {
        label: {
            fontSize: 12,
            text: '1.两状\n态单元',
            fill: '#6a6c8a',
        },
        body: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
        }
    },
    ports: {
        groups: {
            group1: {
                position: 'left',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#31d0c6',
                        fill: '#ffffff',
                        strokeWidth: 1,
                    },
                    text: {
                        fill: '#6a6c8a',
                    }
                }
            },
            group2: {
                position: 'right',
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
                id: 'port1',
                group: 'group1',
            },
            {
                id: 'port2',
                group: 'group2'
            },
        ]
    }
});
//GO法基本图元2: 或门
var goCell2 = new Shape.Circle({
    width: 60,
    height: 60,
    data: {
        deviceName: null,
        goType: 2,
        goNumber: null,
        inSignalsNumber: null,
    },
    attrs: {
        label: {
            fontSize: 12,
            text: '2.或门',
            fill: '#6a6c8a',
        },
        body: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
        }
    },
    ports: {
        groups: {
            in: {
                position: 'left',
                label: {
                    position: {
                        name: 'left',
                        args: {
                            x: -5,
                            y: 0,
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
                id: 'port1',
                group: 'in',
                attrs: {
                    text: {
                        text: "in1",
                    }
                }
            },
            {
                id: 'port2',
                group: 'out',
                attrs: {
                    text: {
                        text: "out",
                    }
                }
            },
        ]
    }
});
//GO法基本图元3: 触发发生器
var goCell3 = new Shape.Circle({
    width: 60,
    height: 60,
    data: {
        deviceName: null,
        goType: 3,
        goNumber: null,
        Pc_0: null,
        Pc_1: null,
        Pc_2: null,
    },
    attrs: {
        label: {
            fontSize: 12,
            text: '3.触发\n发生器',
            fill: '#6a6c8a',
        },
        body: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
        },
    },
    ports: {
        groups: {
            group1: {
                position: 'left',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#31d0c6',
                        fill: '#fff',
                    }
                }
            },
            group2: {
                position: 'right',
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
                id: 'port1',
                group: 'group1',
            },
            {
                id: 'port2',
                group: 'group2'
            },
        ]
    }
});
//GO法基本图元4: 多信号发生器
var goCell4 = new Shape.Polygon({
    width: 60,
    height: 60,
    data: {
        deviceName: null,
        goType: 4,
        goNumber: null,
        signalNumber: null,
        signalCombinationValues: null,
        signalStatusValues: null,
    },
    attrs: {
        label: {
            fontSize: 12,
            text: '4.多信号\n发生器',
            fill: '#6a6c8a',
        },
        body: {
            refPoints: '0,0 0,10 8.66,5',
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
        }
    },
    ports: {
        groups: {
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
                    },
                }
            },
        },
        items: [
            {
                id: 'out1',
                group: 'out',
                attrs: {
                    text: {
                        text: 'out1'
                    }
                }
            },
        ]
    }
});
//GO法基本图元5: 信号发生器
var goCell5 = new Shape.Polygon({
    width: 60,
    height: 60,
    data: {
        deviceName: null,
        goType: 5,
        goNumber: null,
        signalStatusNumber: null,
        signalStatusValues: null,
    },
    attrs: {
        label: {
            fontSize: 12,
            text: '5.信号\n发生器',
            fill: '#6a6c8a',
        },
        body: {
            refPoints: '0,0 0,10 8.66,5',
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
        }
    },
    ports: {
        groups: {
            group1: {
                position: 'right',
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
                id: 'port1',
                group: 'group1',
            },
        ]
    }
});
//GO法基本图元6: 有信号而导通的元件
var goCell6 = new Shape.Circle({
    width: 60,
    height: 60,
    data: {
        deviceName: null,
        goType: 6,
        goNumber: null,
        Pc_0: null,
        Pc_1: null,
        Pc_2: null,
    },
    attrs: {
        label: {
            fontSize: 12,
            text: '6.有信号\n而导通\n的元件',
            fill: '#6a6c8a',
        },
        body: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
        }
    },
    ports: {
        groups: {
            group1: {
                position: 'left',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#31d0c6',
                        fill: '#fff',
                    }
                }
            },
            group2: {
                position: 'right',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#31d0c6',
                        fill: '#fff',
                    }
                }
            },
            group3: {
                position: 'top',
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
                id: 'port1',
                group: 'group1',
            },
            {
                id: 'port2',
                group: 'group2',
            },
            {
                id: 'port3',
                group: 'group3',
            },
        ]
    }
});
//GO法基本图元7: 有信号而关断的元件
var goCell7 = new Shape.Circle({
    width: 60,
    height: 60,
    data: {
        deviceName: null,
        goType: 7,
        goNumber: null,
        Pc_0: null,
        Pc_1: null,
        Pc_2: null,
    },
    attrs: {
        label: {
            fontSize: 12,
            text: '7.有信号\n而关断\n的元件',
            fill: '#6a6c8a',
        },
        body: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
        }
    },
    ports: {
        groups: {
            group1: {
                position: 'left',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#31d0c6',
                        fill: '#fff',
                    }
                }
            },
            group2: {
                position: 'right',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#31d0c6',
                        fill: '#fff',
                    }
                }
            },
            group3: {
                position: 'top',
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
                id: 'port1',
                group: 'group1',
            },
            {
                id: 'port2',
                group: 'group2',
            },
            {
                id: 'port3',
                group: 'group3',
            },
        ]
    }
});
//GO法基本图元8: 延迟发生器
var goCell8 = new Shape.Circle({
    width: 60,
    height: 60,
    data: {
        deviceName: null,
        goType: 8,
        goNumber: null,
        statusNumber: null,
        statusValues: null,
    },
    attrs: {
        label: {
            fontSize: 12,
            text: '8.延迟\n发生器',
            fill: '#6a6c8a',
        },
        body: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
        }
    },
    ports: {
        groups: {
            group1: {
                position: 'left',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#31d0c6',
                        fill: '#fff',
                    }
                }
            },
            group2: {
                position: 'right',
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
                id: 'port1',
                group: 'group1',
            },
            {
                id: 'port2',
                group: 'group2'
            },
        ]
    }
});
//GO法基本图元9: 功能操作符
var goCell9 = new Shape.Circle({
    width: 60,
    height: 60,
    data: {
        deviceName: null,
        goType: 9,
        goNumber: null,
        differenceNumber: null,
        differenceValues: null,
    },
    attrs: {
        label: {
            fontSize: 12,
            text: '9.功能\n操作符',
            fill: '#6a6c8a',
        },
        body: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
        }
    },
    ports: {
        groups: {
            in1: {
                position: 'left',
                label: {
                    position: {
                        name: 'left',
                        args: {
                            x: 0,
                            y: 10,
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
                    },
                }
            },
            in2: {
                position: 'top',
                label: {
                    position: {
                        name: 'right',
                        args: {
                            x: 6,
                            y: 0,
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
                    position: {
                        name: 'right',
                        args: {
                            x: 0,
                            y: 10,
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
        },
        items: [
            {
                id: 'in1',
                group: 'in1',
                attrs: {
                    text: {
                        text: 'in-1',
                    },
                },
            },
            {
                id: 'in2',
                group: 'in2',
                attrs: {
                    text: {
                        text: 'in-2',
                    },
                },
            },
            {
                id: 'out',
                group: 'out',
                attrs: {
                    text: {
                        text: 'out',
                    },
                },
            },
        ]
    }
});
//GO法基本图元10: 与门
var goCell10 = new Shape.Circle({
    width: 60,
    height: 60,
    data: {
        deviceName: null,
        goType: 10,
        goNumber: null,
        inSignalsNumber: null,
    },
    attrs: {
        label: {
            fontSize: 12,
            text: '10.与门',
            fill: '#6a6c8a',
        },
        body: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
        }
    },
    ports: {
        groups: {
            in: {
                position: 'left',
                label: {
                    position: {
                        name: 'left',
                        args: {
                            x: -5,
                            y: 0,
                        }
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
                    position: {
                        name: 'right',
                        args: {
                            x: 5,
                            y: 0,
                        },
                    }
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
                id: 'in1',
                group: 'in',
                attrs: {
                    text: {
                        text: 'in1',
                    },
                },
            },
            {
                id: 'out',
                group: 'out',
                attrs: {
                    text: {
                        text: 'out',
                    },
                },
            },
        ]
    }
});
//GO法基本图元11: M取K门
var goCell11 = new Shape.Circle({
    width: 70,
    height: 70,
    data: {
        deviceName: null,
        goType: 11,
        goNumber: null,
        inSignalsNumber: null,
        succeedNumber: null,
    },
    attrs: {
        label: {
            fontSize: 12,
            text: '11.M\n取K门',
            fill: '#6a6c8a',
        },
        body: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
        }
    },
    ports: {
        groups: {
            in: {
                position: 'left',
                label: {
                    position: {
                        name: 'left',
                        args: {
                            x: -5,
                            y: 0,
                        }
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
                    position: {
                        name: 'right',
                        args: {
                            x: 5,
                            y: 0,
                        },
                    }
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
                id: 'in1',
                group: 'in',
                attrs: {
                    text: {
                        text: 'in1',
                    },
                },
            },
            {
                id: 'out',
                group: 'out',
                attrs: {
                    text: {
                        text: 'out',
                    },
                },
            },
        ]
    }
});
//GO法基本图元12: 路径分离器
var goCell12 = new Shape.Circle({
    width: 60,
    height: 60,
    data: {
        deviceName: null,
        goType: 12,
        goNumber: null,
        outSignalsNumber: null,
        outStatusValues: null,
    },
    attrs: {
        label: {
            fontSize: 12,
            text: '12.路径\n分离器',
            fill: '#6a6c8a',
        },
        body: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
        }
    },
    ports: {
        groups: {
            in: {
                position: 'left',
                label: {
                    position: {
                        name: 'left',
                        args: {
                            x: -5,
                            y: 0,
                        }
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
                    position: {
                        name: 'right',
                        args: {
                            x: 5,
                            y: 0,
                        },
                    }
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
                attrs: {
                    text: {
                        text: 'in',
                    },
                },
            },
            {
                id: 'out1',
                group: 'out',
                attrs: {
                    text: {
                        text: 'out1',
                    },
                },
            },
        ]
    }
});
//GO法基本图元14: 线性组合发生器
var goCell14 = new Shape.Circle({
    width: 60,
    height: 60,
    data: {
        deviceName: null,
        goType: 14,
        goNumber: null,
        inSignalsNumber: null,
        linearCoefficients: null,
    },
    attrs: {
        label: {
            fontSize: 12,
            text: '14.线性\n组合\n发生器',
            fill: '#6a6c8a',
        },
        body: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
        }
    },
    ports: {
        groups: {
            in: {
                position: 'left',
                label: {
                    position: {
                        name: 'left',
                        args: {
                            x: -5,
                            y: 0,
                        }
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
                    position: {
                        name: 'right',
                        args: {
                            x: 5,
                            y: 0,
                        },
                    }
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
                id: 'in1',
                group: 'in',
                attrs: {
                    text: {
                        text: 'in1',
                    },
                },
            },
            {
                id: 'out',
                group: 'out',
                attrs: {
                    text: {
                        text: 'out',
                    },
                },
            },
        ]
    }
});
//GO法基本图元15: 限值概率门
var goCell15 = new Shape.Circle({
    width: 60,
    height: 60,
    data: {
        deviceName: null,
        goType: 15,
        goNumber: null,
        V1: null,
        V2: null,
        V3: null,
        V4: null,
        P1: null,
        P2: null,
    },
    attrs: {
        label: {
            fontSize: 12,
            text: '15.限值\n概率门',
            fill: '#6a6c8a',
        },
        body: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
        }
    },
    ports: {
        groups: {
            group1: {
                position: 'left',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#31d0c6',
                        fill: '#ffffff',
                        strokeWidth: 1,
                    },
                    text: {
                        fill: '#6a6c8a',
                    }
                }
            },
            group2: {
                position: 'right',
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
                id: 'port1',
                group: 'group1',
            },
            {
                id: 'port2',
                group: 'group2'
            },
        ]
    }
});
//GO法基本图元16: 要求恢复已导通元件
var goCell16 = new Shape.Circle({
    width: 60,
    height: 60,
    data: {
        deviceName: null,
        goType: 16,
        goNumber: null,
        Pc_0: null,
        Pc_1: null,
        Pc_2: null,
    },
    attrs: {
        label: {
            fontSize: 12,
            text: '16.恢复\n已导通\n元件',
            fill: '#6a6c8a',
        },
        body: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
        }
    },
    ports: {
        groups: {
            group1: {
                position: 'left',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#31d0c6',
                        fill: '#fff',
                    }
                }
            },
            group2: {
                position: 'right',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#31d0c6',
                        fill: '#fff',
                    }
                }
            },
            group3: {
                position: 'top',
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
                id: 'port1',
                group: 'group1',
            },
            {
                id: 'port2',
                group: 'group2',
            },
            {
                id: 'port3',
                group: 'group3',
            },
        ]
    }
});
//GO法基本图元17: 要求恢复已关断元件
var goCell17 = new Shape.Circle({
    width: 60,
    height: 60,
    data: {
        deviceName: null,
        goType: 17,
        goNumber: null,
        Pc_0: null,
        Pc_1: null,
        Pc_2: null,
    },
    attrs: {
        label: {
            fontSize: 12,
            text: '17.恢复\n已关断\n元件',
            fill: '#6a6c8a',
        },
        body: {
            stroke: '#8f8f8f',
            strokeWidth: 1,
            fill: '#fff',
        }
    },
    ports: {
        groups: {
            group1: {
                position: 'left',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#31d0c6',
                        fill: '#fff',
                    }
                }
            },
            group2: {
                position: 'right',
                attrs: {
                    circle: {
                        r: 4,
                        magnet: true,
                        stroke: '#31d0c6',
                        fill: '#fff',
                    }
                }
            },
            group3: {
                position: 'top',
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
                id: 'port1',
                group: 'group1',
            },
            {
                id: 'port2',
                group: 'group2',
            },
            {
                id: 'port3',
                group: 'group3',
            },
        ]
    }
});
export { goCell1, goCell2, goCell3, goCell4, goCell5, goCell6, goCell7, goCell8, goCell9, goCell10, goCell11, goCell12, 
// goCell13,   //没写
goCell14, goCell15, goCell16, goCell17, };
//# sourceMappingURL=GoCell.js.map