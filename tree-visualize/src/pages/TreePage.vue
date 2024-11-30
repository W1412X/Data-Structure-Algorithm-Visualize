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
                <v-select variant="outlined" v-model="algorithm" label="树结构" density="compact" 
                     style="max-height: 60px;"
                    :items="['TEST']"></v-select>
                <v-text-field v-model="nodeValueToAdd" style="max-height: 60px;" single-line label="输入节点ID"
                    variant="outlined" density="compact"></v-text-field>
                <v-btn @click="handleAddClicked" style="max-height: 60px;margin: 5px;" variant="tonal">插入节点</v-btn>
                <v-btn @click="handleDeleteClicked" style="max-height: 60px; margin: 5px;" variant="tonal">删除节点</v-btn>
            </div>
        </div>
    </main>
</template>

<script>
import G6 from '@antv/g6';
import { isNumericString } from '@/utils/funcs';
export default {
    name: 'TreeGraph',
    setup(){

    },
    data(){
        return {
            algorithm:null,
            /* id迭代
             */
            idCounter:0,
            /* 因为id必须保持唯一
             * 所以这里设置一个字典，用于查询id节点对应的val
             * 其中id自动迭代，val为用户输入
             */
            valIdDict:{},
            /* 已经添加的节点
             */
            addIds:[],
            nodeIdAdded:[],
            /* 绑定待添加的节点输入
             */
            nodeValueToAdd:null,
            data:{
            },
        }
    },
    methods:{
        /* 监听添加按钮
         */
        handleAddClicked(){
            const val=this.nodeValueToAdd;
            this.nodeValueToAdd="";
            if(!isNumericString(val)){
                window.alert("输入节点格式必须是数字")
                return;
            }
            /* 如果第一次启动
             */
            this.idCounter++;
            this.valIdDict[val]=this.idCounter;
            
            if(this.idCounter==1){
                this.data={
                    id:String(this.idCounter),
                    val:val,
                    children:[]
                }
                this.tree.data(this.data);
                this.tree.render();
                this.tree.fitView();
            }
            /* 待完善，需要给出子树和父节点  
             */
            this.tree.addChild({id:String(this.idCounter),val:val,children:[]},"1")
        },
        handleDeleteClicked(){
            const val=this.nodeValueToAdd;
            this.nodeValueToAdd="";
            if(!isNumericString(val)){
                window.alert("输入节点格式必须是数字")
                return;
            }
            this.tree.removeChild(val);
        },
        /* 传入自定义的node
         * 返回设置固定样式的node
         */
        convertNode(node){
            return {
            size: 16,
            style: {
            },
            state:{
                focus:{
                    lineWidth:"2",
                    stroke:"orange"
                }
            },
            label:node.val,
            labelCfg: {
                position: node.children && node.children.length > 0 ? 'left' : 'right',
                fontSize:1
            },
            animation: {
                enter:"fade",
                exit:"fade"
            },
        }
        },
        /* 传入自定义的edge
         * 返回设置固定样式的edge
         */
        convertEdge(edge){
            console.log(edge);
        }
    },
    mounted() {
        this.tree= new G6.TreeGraph({
            container: 'mountNode',
            width: this.$el.offsetWidth,
            height: this.$el.offsetHeight,
            pixelRatio: 2,
            modes: {
                default: [
                    {
                        type: 'collapse-expand',
                        onChange: function (item, collapsed) {
                            const nodeData = item.get('model').data;
                            nodeData.collapsed = collapsed;
                            return true;
                        },
                    },
                    'drag-canvas',
                    'zoom-canvas',
                ],
            },
            layout: {
                type: 'compactBox',
                direction: 'TB',
                getId: (d) => d.id,
                getHeight: () => 16,
                getWidth: () => 16,
                getVGap: () => 10,
                getHGap: () => 100,
            },
        });

        this.tree.node((node) => (this.convertNode(node)));
        this.tree.edge(()=>({
            type: 'line',
            style: {
                stroke:"#8a8a8a",
                lineWidth:1
            },
            state: {

            },
            palette: {},
            animation: {
                enter:"fade",
                exit:"fade"
            },
        }));
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