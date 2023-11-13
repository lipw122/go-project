/*
试验：
const attributeCounts: number[] = [2, 3, 2];
const result: number[][] = attributePermutations(attributeCounts);
console.log(result);
[ [0, 0, 0], [0, 0, 1], [0, 1, 0], [0, 1, 1], [0, 2, 0], [0, 2, 1], [1, 0, 0], [1, 0, 1], [1, 1, 0], [1, 1, 1], [1, 2, 0], [1, 2, 1]]
*/
export default function (attributeCounts) {
    var allPermutations = [];
    function generatePermutations(currentPermutation, index) {
        if (currentPermutation.length === attributeCounts.length) {
            allPermutations.push(currentPermutation.slice());
            return;
        }
        var attributeCount = attributeCounts[index];
        for (var i = 0; i < attributeCount; i++) {
            currentPermutation.push(i);
            generatePermutations(currentPermutation, index + 1);
            currentPermutation.pop();
        }
    }
    generatePermutations([], 0);
    return allPermutations;
}
//# sourceMappingURL=MyUtils.js.map