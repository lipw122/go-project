import {Edge, Graph, Shape} from "@antv/x6";

export default class MyShape1 extends Shape.Circle {
    getInPorts() {
        return this.getPortsByGroup('in')
    }

    getOutPorts() {
        return this.getPortsByGroup('out')
    }

    getUsedInPorts(graph: Graph) {
        const incomingEdges = graph.getIncomingEdges(this) || []
        return incomingEdges.map((edge: Edge) => {
            const portId = edge.getTargetPortId()
            return this.getPort(portId!)
        })
    }

    getNewInPorts(length: number) {
        return Array.from(
            {
                length,
            },
            () => {
                return {
                    group: 'in',
                }
            },
        )
    }

    updateInPorts(graph: Graph) {
        const minNumberOfPorts = 2
        const ports = this.getInPorts()
        const usedPorts = this.getUsedInPorts(graph)
        const newPorts = this.getNewInPorts(
            Math.max(minNumberOfPorts - usedPorts.length, 1),
        )

        if (
            ports.length === minNumberOfPorts &&
            ports.length - usedPorts.length > 0
        ) {
            // noop
        } else if (ports.length === usedPorts.length) {
            this.addPorts(newPorts)
        } else if (ports.length + 1 > usedPorts.length) {
            this.prop(
                ['ports', 'items'],
                this.getOutPorts().concat(usedPorts).concat(newPorts),
                {
                    rewrite: true,
                },
            )
        }
        return this;
    }

}




