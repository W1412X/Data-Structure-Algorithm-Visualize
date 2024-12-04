<template>
    <main style="display: flex;flex-direction: column;min-width: 1500px;overflow: scroll;">
        <div style="display: flex;font-size: 20px;color: #4a4a4a;font-weight: bold;padding: 10px;width: 100%;flex-direction: row;">
            <span>图算法可视化</span>
        </div>
        <div style="height: 2px;background-color: #8a8a8a;margin-bottom: 20px;width: 100%;"></div>
        <div style="display: flex;flex-direction: row-reverse;overflow:scroll;justify-content: center;">
            <div id="mountNode"
                style="border-radius: 10px;border: 2px #8a8a8a solid;width: 1200px; height: 800px;margin-right: 20px;">
            </div>
            <div style="display: flex;flex-direction: column;margin-right: 20px;width: 350px;">
                <div style="display: flex;flex-direction: column;">
                    <div style="font-size:20px;font-weight: bold;">
                        算法部分<br/>
                        <span style="font-size: 18px;">
                            逐步运行算法
                        </span>
                    </div>
                    <v-select variant="outlined" v-model="algorithm" label="选择算法" density="compact" 
                        style="max-height: 60px;width: 300px;margin-top: 10px;"
                        :items="['Kruskal最小生成树']"></v-select>
                    <v-btn @click="step" variant="tonal" style="width: 300px;margin-bottom: 10px;">执行算法</v-btn>
                </div>
                <div v-if="!ifRun" style="display: flex;flex-direction: column;">
                    <div style="font-size:20px;font-weight: bold;">
                        绘制部分<br/>
                        <span style="font-size: 18px;">
                            双击画布创建新节点
                        </span>
                    </div>
                    <div style="display: flex;flex-direction: row;justify-content: center;margin-top: 10px;width: 300px;">
                        <v-text-field variant="outlined" v-model="source" label="起始" density="compact" 
                            style="max-height: 60px;max-width: 150px;margin-right: 10px;"></v-text-field>
                        <v-text-field variant="outlined" v-model="target" label="终止" density="compact" 
                            style="max-height: 60px;max-width: 150px;"></v-text-field>
                        <v-text-field variant="outlined" v-model="val" label="权值" density="compact" 
                            style="max-height: 60px;max-width: 150px;"></v-text-field>
                    </div>
                    <v-btn @click="addEdge" variant="tonal" style="width: 300px;margin-top: 10px;">添加边</v-btn>
                    <v-btn @click="drawBack" variant="tonal" style="width: 300px;margin-top: 10px;">撤销绘制</v-btn>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
// eslint-disable-next-line
import { Kruskal } from '@/algorithm/Kruskal';
import GraphDraw from '@/utils/kruskal_graph';
import { edgeIncludes } from '@/utils/other';
import { isNumericString } from '@/utils/tree_funcs';

export default{
    name: 'TreeGraph',
    setup(){

    },
    data(){
        return{ 
            data:{
                nodes: [],
                edges: [],
            },
            graphDraw:null,
            file:null,
            algorithm:null,
            source:null,
            target:null,
            val:null,
            ifRun:false,
            kruskal:null,
        }
    },
    methods:{
        step(){
            if(this.algorithm==null){
                window.alert("选择一个算法");
                return;
            }
            if(this.ifRun==false){
                this.ifRun=true;
                this.kruskal=new Kruskal(this.graphDraw);
            }
            if(!this.kruskal.step()){
                window.alert("算法已运行完毕")
            }
        },
        drawBack(){
            if(!this.graphDraw.drawBack()){
                window.alert("无更多可撤销绘制");
            }
        },
        addEdge(){
            if(this.source==null||this.target==null||this.val==null){
                window.alert("边未设置");
                return;
            }
            if(!this.graphDraw.nodes.includes(this.source)||!this.graphDraw.nodes.includes(this.target)){
                window.alert("节点不存在");
                return;
            }
            if(edgeIncludes(this.graphDraw.edges,{source:this.source,target:this.target,selectState:false})
            ||edgeIncludes(this.graphDraw.edges,{source:this.source,target:this.target,selectState:true})){
                window.alert("边已存在")
                return;
            }
            if(this.source==this.target){
                window.alert("无法添加自旋边");
                return;
            }
            if(isNumericString(this.val)&&Number(this.val)<=0){
                window.alert("权值错误，必须>0的整数");
                return;
            }
            this.graphDraw.addEdge(this.source,this.target,this.val);
        },
    },
    mounted(){
        this.graphDraw=new GraphDraw("mountNode");
        this.graphDraw.graph.data(this.data);
        this.graphDraw.graph.render();
    }
}
</script>
<style>
/* Hide scrollbar and make the container fill the parent */
#mountNode {
    overflow: hidden;
    margin: 0;
}
</style>