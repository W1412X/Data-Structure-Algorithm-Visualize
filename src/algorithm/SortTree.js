//import { delay } from "@/utils/funcs";

//import { convertNode } from "@/utils/funcs";

/* 需要传入对应的图对象，将操作直接内嵌到算法 
 * 更新视图方法我试了三种
 * 1. removeChild+addChild 动画很全，缺点是不符合实际算法逻辑，而且需要每次操作delay等待动画播放(更新视图的时候每次更新都等待一段时间无奈之举,也不知道为什么开启动画后会出现布局BUG,每次操作等待一段时间可以解决这个BUG(推测更新视图不能同时进行两个操作，与内部实现逻辑有关？))
 * 2. updateChildren 需要单独调用重新渲染
 * 3. 获取节点操作节点updateItem 符合逻辑，动画有的没有
 */
export class SortTree{
    constructor(treeGraph){
        this.treeGraph=treeGraph;
        this.root=null;
        this.idCounter=0;
    }
    getIdCounter(){
        this.idCounter++;
        return String(this.idCounter);
    }
    /* 传入的node为@/algorithm/Node.js中的类
     */
    async push(val){
        console.log(val)
        if(this.root==null){
            this.root={
                id:this.getIdCounter(),
                val:val,
                pos:"mid",
                vis:true,
                children:[]
            };
            /* 根节点的添加需要首先装配数据
             */
            this.treeGraph.data(JSON.parse(JSON.stringify(this.root)));
            this.treeGraph.render();
            this.treeGraph.fitView();
        }else{
            var node_now=this.root;
            // eslint-disable-next-line
            while(true){
                /* 没有孩子，添加两个节点，一个隐式的  
                 */
                console.log("父节点的VAL",node_now.val);
                console.log(val<=node_now.val);
                if(node_now.children.length==0){
                    if(Number(val)<=Number(node_now.val)){//左子树
                        node_now.children.push({
                            id:this.getIdCounter(),
                            pos:"left",
                            val:val,
                            vis:true,
                            children:[]
                        })
                        node_now.children.push({
                            id:this.getIdCounter(),
                            pos:"right",
                            val:null,
                            vis:false,
                            children:[]
                        })
                    }else{
                        node_now.children.push({
                            id:this.getIdCounter(),
                            val:null,
                            pos:"left",
                            vis:false,
                            children:[]
                        })
                        node_now.children.push({
                            id:this.getIdCounter(),
                            val:val,
                            pos:"right",
                            vis:true,
                            children:[]
                        })
                    }
                    /* 更新绘图数据  
                     */
                    console.log("添加两个节点之前的root",this.root);
                    console.log("添加两个节点之前的treeGraph",this.treeGraph.findDataById("1"));
                    this.treeGraph.updateChildren([
                        JSON.parse(JSON.stringify(node_now.children[0])),
                        JSON.parse(JSON.stringify(node_now.children[1]))
                    ],node_now.id);
                    console.log("添加两个节点之后的root",this.root);
                    console.log("添加两个节点后的treeGraph",this.treeGraph.findDataById("1"));
                    break;
                }
                /* 有孩子
                 * 因为我们已经保证了有孩子的一定有两个孩子(可能有一个不显示)
                 * 所以这里需要先获取当前节点应该往哪插/或者进入下一层
                 * 插入到这一层只有两种情况 
                 * 1. 左节点为不可见且val比父节点小(或等)
                 * 2. 右节点为不可见状态且比父节点大  
                 */
                else{
                    if(Number(val)<=Number(node_now.val)&&!node_now.children[0].vis){
                        node_now.children[0].val=val;
                        node_now.children[0].vis=true;
                        /* 这里调用更新
                         */
                        this.treeGraph.updateChildren([
                            JSON.parse(JSON.stringify(node_now.children[0])),
                            JSON.parse(JSON.stringify(node_now.children[1]))
                        ],node_now.id);
                        this.treeGraph.updateItem(node_now.children[0].id,node_now.children[0])
                        break;
                    }else if(Number(val)>Number(node_now.val)&&!node_now.children[1].vis){
                        node_now.children[1].val=val;
                        node_now.children[1].vis=true;
                        /* 这里调用更新
                         */
                        this.treeGraph.updateChildren([
                            JSON.parse(JSON.stringify(node_now.children[0])),
                            JSON.parse(JSON.stringify(node_now.children[1]))
                        ],node_now.id);
                        this.treeGraph.updateItem(node_now.children[0].id,node_now.children[1])
                        break;
                    }else if(Number(val)<=Number(node_now.val)){
                        node_now=node_now.children[0];
                    }else if(Number(val)>Number(node_now.val)){
                        node_now=node_now.children[1];
                    }
                }
            }
        }
        /* 调整视图
         * 根据当前图的结构缩放和移动视图
         */
        this.treeGraph.fitView(50)
    }
}