import { copy } from "@/utils/tree_funcs";

export class Kruskal{
    constructor(graphDraw){
        this.graphDraw=graphDraw;
        this.nodes=[];
        this.added_nodes=[];
        this.added_edges=[];
        for(let i=0;i<=this.graphDraw.nodes.length;i++){
            this.nodes.push({
                id:String(i),
                selectState:false,
                root:String(i)
            })
        }
        this.edges=copy(this.graphDraw.edges);
        this.idCounter=0;
        this.edges.sort((a,b)=>b.val-a.val);
        console.log(this.edges);
    }
    /**
     * 并查集的查找  
     * @returns 节点的根
     */
    find(index){
        if(this.nodes[index].root==index){
            return index;
        }else{
            this.nodes[index].root=this.find(this.nodes[index].root);
            //更新图
            this.graphDraw.setNode(copy(this.nodes[index]));
            return this.nodes[index].root;
        }
    }
    /**
     * 并查集的合并 
     */
    combine(a,b){
        var root_a=this.find(a);
        var root_b=this.find(b);
        if(root_a==root_b){
            return;
        }else{
            this.nodes[root_a].root=this.nodes[root_b].root;
            //更新图
            this.graphDraw.setNode(copy(this.nodes[root_a]));
        }
    }
    /**
     * 执行算法的一步
     * @returns bool 如果为false则说明算法已经运行完毕
     */
    step(){
        if(this.added_edges.length==this.nodes.length-2){
            return false;
        }else{
            var edge=this.edges.pop();
            if(this.find(edge.source)==this.find(edge.target)){
                return true;
            }else{
                this.combine(edge.source,edge.target);
                edge.selectState=true;
                this.nodes[edge.source].selectState=true;
                this.nodes[edge.target].selectState=true;
                this.added_edges.push(copy(edge));
                this.graphDraw.setEdge(copy(edge));
                this.graphDraw.setNode(copy(this.nodes[edge.source]));
                this.graphDraw.setNode(copy(this.nodes[edge.target]));
            }
            return true;
        }
    }
}