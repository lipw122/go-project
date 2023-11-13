import { __extends } from "tslib";
import { Shape } from "@antv/x6";
var MyShape1 = /** @class */ (function (_super) {
    __extends(MyShape1, _super);
    function MyShape1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MyShape1.prototype.getInPorts = function () {
        return this.getPortsByGroup('in');
    };
    MyShape1.prototype.getOutPorts = function () {
        return this.getPortsByGroup('out');
    };
    MyShape1.prototype.getUsedInPorts = function (graph) {
        var _this = this;
        var incomingEdges = graph.getIncomingEdges(this) || [];
        return incomingEdges.map(function (edge) {
            var portId = edge.getTargetPortId();
            return _this.getPort(portId);
        });
    };
    MyShape1.prototype.getNewInPorts = function (length) {
        return Array.from({
            length: length,
        }, function () {
            return {
                group: 'in',
            };
        });
    };
    MyShape1.prototype.updateInPorts = function (graph) {
        var minNumberOfPorts = 2;
        var ports = this.getInPorts();
        var usedPorts = this.getUsedInPorts(graph);
        var newPorts = this.getNewInPorts(Math.max(minNumberOfPorts - usedPorts.length, 1));
        if (ports.length === minNumberOfPorts &&
            ports.length - usedPorts.length > 0) {
            // noop
        }
        else if (ports.length === usedPorts.length) {
            this.addPorts(newPorts);
        }
        else if (ports.length + 1 > usedPorts.length) {
            this.prop(['ports', 'items'], this.getOutPorts().concat(usedPorts).concat(newPorts), {
                rewrite: true,
            });
        }
        return this;
    };
    return MyShape1;
}(Shape.Circle));
export default MyShape1;
//# sourceMappingURL=MyShape.js.map