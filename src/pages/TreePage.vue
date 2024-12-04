<template>
    <main style="display: flex;flex-direction: column;min-width: 1500px;overflow: scroll;">
        <div style="display: flex;font-size: 20px;color: #4a4a4a;font-weight: bold;padding: 10px;width: 100%;flex-direction: row;">
            <span>树形结构可视化</span>
        </div>
        <div style="height: 2px;background-color: #8a8a8a;margin-bottom: 20px;width: 100%;"></div>
        <div style="display: flex;flex-direction: row-reverse;overflow:scroll;justify-content: center;">
            <div id="mountNode"
                style="border-radius: 10px;border: 2px #8a8a8a solid;width: 1200px; height: 800px;margin-right: 20px;">
            </div>
            <div style="display: flex;flex-direction: column;margin-right: 20px;width: 200px;">
                <v-select variant="outlined" v-model="algorithm" label="选择算法" density="compact" 
                     style="max-height: 60px;"
                    :items="['二叉排序树的构建']"></v-select>
                <v-text-field v-model="nodeValueToAdd" style="max-height: 60px;" single-line label="输入节点权值"
                    variant="outlined" density="compact"></v-text-field>
                <v-btn @click="handleAddClicked" style="max-height: 60px;margin: 5px;" variant="tonal">插入节点</v-btn>
                <v-btn @click="handleDeleteClicked" style="max-height: 60px; margin: 5px;" variant="tonal">删除节点</v-btn>
            </div>
        </div>
    </main>
</template>

<script>
import { getTreeGraph, isNumericString } from '@/utils/tree_funcs';
import { SortTree } from '@/algorithm/SortTree';
export default {
    name: 'TreeGraph',
    setup(){

    },
    data(){
        return {
            /**
             * 一个算法类
             * 传入图对象，对图的操作再算法中实现
             * 提供算法的操作接口
             */
            tree:null,
            algorithm:null,
            /**
             * id迭代
             */
            idCounter:0,
            /**
             * 因为id必须保持唯一
             * 所以这里设置一个字典，用于查询id节点对应的val
             * 其中id自动迭代，val为用户输入
             */
            valIdDict:{},
            /** 
             * 已经添加的节点
             */
            addIds:[],
            nodeIdAdded:[],
            /**
             * 绑定待添加的节点输入
             */
            nodeValueToAdd:null,
            data:{
            },
        }
    },
    methods:{
        /**
         * 监听添加按钮
         */
        handleAddClicked(){
            if(this.algorithm==null){
                window.alert("选择一个算法")
                return;
            }
            const val=this.nodeValueToAdd;
            this.nodeValueToAdd="";
            if(!isNumericString(val)){
                window.alert("输入节点格式必须是数字")
                return;
            }
            this.tree.push(String(val));
        },
        handleDeleteClicked(){
            if(this.algorithm==null){
                window.alert("选择一个算法")
                return;
            }
            if(this.tree.root==null){
                window.alert("没有数据")
                return;
            }
            this.tree.pop_min();
        },
    },
    mounted() {
        this.tree=new SortTree(getTreeGraph());
    },
};
</script>

<style>
/* Hide scrollbar and make the container fill the parent */
#mountNode {
    overflow: hidden;
    margin: 0;
}
</style>