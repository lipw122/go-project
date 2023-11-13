import { createStore } from 'vuex';
export default createStore({
    state: {
        //存放数据的地方
        count: 10,
        sum: 10,
        //存节点
        node: [],
        //存边
        edge: [],
    },
    actions: {
        jia: function (context, value) {
            console.log('actions中的jia被调用了');
            context.commit('jia', value);
        },
        addNode: function (context, value) {
            console.log('actions中的addNode被调用了');
            context.commit('addNode', value);
        },
        addEdge: function (context, value) {
            console.log('actions中的addEdge被调用了');
            context.commit('addEdge', value);
        },
        removeNode: function (context, value) {
            console.log('actions中的removeNode被调用了');
            context.commit('removeNode', value);
        },
        removeEdge: function (context, value) {
            console.log('actions中的removeEdge被调用了');
            context.commit('removeEdge', value);
        },
        changeNode: function (context, value) {
            console.log('actions中的changeNode被调用了');
            context.commit('changeNode', value);
        },
        changeEdge: function (context, value) {
            console.log('actions中的changeEdge被调用了');
            context.commit('changeEdge', value);
        },
    },
    mutations: {
        jia: function (state, value) {
            console.log('mutations中的jia被调用了');
            state.sum += value;
        },
        addNode: function (state, value) {
            console.log('mutations中的addNode被调用了');
            state.node.push(value);
        },
        addEdge: function (state, value) {
            console.log('mutations中的addEdge被调用了');
            state.edge.push(value);
        },
        removeNode: function (state, value) {
            console.log('mutations中的removeNode被调用了');
            for (var i = 0; i < state.node.length; i++) {
                if (value.id == state.node[i].id) {
                    state.node.splice(i, 1);
                    return;
                }
            }
        },
        removeEdge: function (state, value) {
            console.log('mutations中的removeEdge被调用了');
            for (var i = 0; i < this.state.edge.length; i++) {
                if (value.id == state.edge[i].id) {
                    state.edge.splice(i, 1);
                    return;
                }
            }
        },
        changeNode: function (state, value) {
            console.log("mutations中的changeNode被调用了");
            // console.log(value.id);
            for (var i = 0; i < state.node.length; i++) {
                if (value.id == state.node[i].id) {
                    //若使用   state.node[i] = value   则无法监听变化
                    state.node.splice(i, 1);
                    state.node.push(value);
                    return;
                }
            }
        },
        changeEdge: function (state, value) {
            console.log("mutations中的changeEdge被调用了");
            for (var i = 0; i < state.edge.length; i++) {
                if (value.id == this.state.edge[i].id) {
                    //若使用   state.edge[i] = value   则无法监听变化
                    state.edge.splice(i, 1);
                    state.edge.push(value);
                    return;
                }
            }
        },
    },
    modules: {}
});
//# sourceMappingURL=index.js.map