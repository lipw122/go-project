var goState = {
    Pc_1: 0.8,
    Pc_2: 0.2,
};
var inValues = [
    { status: 0, value: 0, accumulationValue: 0 },
    { status: 1, value: 0.9, accumulationValue: 0.9 },
    { status: 2, value: 0.1, accumulationValue: 1 },
];
function out1Values(goState1, inValues) {
    var out = [];
    for (var i = 0; i < (inValues.length - 1); i++) {
        out.push({
            status: inValues[i].status,
            value: inValues[i].value,
            accumulationValue: inValues[i].accumulationValue * goState1.Pc_1,
        });
    }
    out.push({
        status: inValues[inValues.length - 1].status,
        value: inValues[inValues.length - 1].value,
        accumulationValue: 1,
    });
    return out;
}
console.log(out1Values(goState, inValues));
//# sourceMappingURL=GoCalculate.js.map