//import { delay } from "@/utils/funcs";

import { copy, getFatherById, getFatherByIdRefer, getMinNodeId, getNodeById, getTreeGraph } from "@/utils/funcs";

//import { convertNode } from "@/utils/funcs";

/**
 * 需要传入对应的图对象，将操作直接内嵌到算法 
 * 更新视图方法我试了三种
 * 1. removeChild+addChild 动画很全，缺点是不符合实际算法逻辑，而且需要每次操作delay等待动画播放(更新视图的时候每次更新都等待一段时间无奈之举,也不知道为什么开启动画后会出现布局BUG,每次操作等待一段时间可以解决这个BUG(推测更新视图不能同时进行两个操作，与内部实现逻辑有关？))
 * 2. updateChildren 需要单独调用重新渲染
 * 3. 获取节点操作节点updateItem 符合逻辑，动画有的没有
 * 
 * 另外使用updateChildren的时候要注意
 * 如果对一个节点father的子树做更新，并且需要应用到布局，就要更新这个子树所有节点的id(我使用调用uodataNodeIds实现更新)
 * 如果说father的节点数据没有改变，可以不更新id
 * 
 * 还有就是区分引用和copy
 * 我是调用库中的函数时都传入一个深拷贝防止出现问题
 */
export class SortTree{
    constructor(treeGraph){
        this.treeGraph=treeGraph;
        this.root=null;
        this.idCounter=0;
    }
    updateNodeIds(node) {
        node.id = this.getIdCounter();
        if (node.children && node.children.length > 0) {
            for (let i = 0; i < node.children.length; i++) {
                this.updateNodeIds(node.children[i]);
            }
        }
    }
    getIdCounter(){
        this.idCounter++;
        return String(this.idCounter);
    }
    /**
     * 传入的node为@/algorithm/Node.js中的类
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
            /**
             * 根节点的添加需要首先装配数据
             */
            this.treeGraph.data(copy(this.root));
            this.treeGraph.render();
            this.treeGraph.fitView();
        }else{
            var node_now=this.root;
            // eslint-disable-next-line
            while(true){
                /**
                 * 没有孩子，添加两个节点，一个隐式的  
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
                    /**
                     * 更新绘图数据  
                     */
                    this.treeGraph.updateChildren([
                        copy(node_now.children[0]),
                        copy(node_now.children[1])
                    ],node_now.id);
                    break;
                }
                /**
                 * 有孩子
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
                        /**
                         * 这里调用更新
                         */
                        this.treeGraph.updateItem(node_now.children[0].id,copy(node_now.children[0]))
                        break;
                    }else if(Number(val)>Number(node_now.val)&&!node_now.children[1].vis){
                        node_now.children[1].val=val;
                        node_now.children[1].vis=true;
                        /**
                         * 这里调用更新
                         */
                        this.treeGraph.updateItem(node_now.children[1].id,copy(node_now.children[1]))
                        break;
                    }else if(Number(val)<=Number(node_now.val)){
                        node_now=node_now.children[0];
                    }else if(Number(val)>Number(node_now.val)){
                        node_now=node_now.children[1];
                    }
                }
            }
        }
        /**
         * 调整视图
         * 根据当前图的结构缩放和移动视图
         */
        this.treeGraph.fitView(50)
    }
    /**
     * 弹出最小的
     */
    async pop_min(){
        /**
         * 首先获取最小的节点的id
         */
        var minId=getMinNodeId(this.root);
        // eslint-disable-next-line
        var minNode=getNodeById(this.root,minId);
        // eslint-disable-next-line
        var minFather=getFatherById(this.root,minId);
        /**
         * 如果是根节点
         */
        if(minId==this.root.id){
            /**
             * 如果没有子节点
             */
            if(this.root.children.length==0){
                this.root=null;
                this.treeGraph.destroy();
                this.treeGraph=getTreeGraph();
            }
            /**
             * 有子节点，一定是右子节点
             */
            else{
                this.root=copy(this.root.children[1]);
                this.treeGraph.destroy();
                this.treeGraph=getTreeGraph();
                this.treeGraph.data(copy(this.root));
                this.treeGraph.render();
                this.treeGraph.fitView(50);
            }
        }
        /**
         * 其他节点
         * 则有两种情况
         * 1.节点没有右子节点
         * 2.节点有右子节点
         */
        else{
            /**
             * 没有右子节点
             * 更新父节点  
             *   如果父节点含有右子节点，则更新为[新节点，右子节点]
             *   反之，更新为[]
             */
            if(minNode.children.length==0){
                /**
                 * 更新父节点
                 */
                if(minFather.children[1].vis==false){
                    getFatherByIdRefer(this.root,minId).children=[];
                    this.treeGraph.updateChildren([],minFather.id);
                }else{
                    var newNode={
                        id:this.getIdCounter(),
                        pos:"left",
                        val:null,
                        vis:false,
                        children:[]
                    }
                    getFatherByIdRefer(this.root,minId).children=[
                        copy(newNode),
                        copy(minFather.children[1])
                    ];
                    this.treeGraph.updateChildren([
                        copy(newNode),
                        copy(minFather.children[1])
                    ],minFather.id);
                }
            }
            /**
             * 有右子节点
             */
            else{
                /**
                 * 更新父节点
                 * 只需要更新夫节点的children为[minNode的右子节点,父节点的右子节点]
                 * 不需要关注夫节点的右子节点的可见性
                 */
                console.log(this.root)
                var leftNode=copy(minNode.children[1]);
                leftNode.pos="left";
                this.updateNodeIds(leftNode);
                /**
                 * 这里值所以采用新的id是因为
                 * 不采用新的他不渲染
                 * 而且是子树全部都要更新
                 */
                getFatherByIdRefer(this.root,minId).children=[
                    copy(leftNode),
                    copy(minFather.children[1])
                ];
                console.log(this.root);
                this.treeGraph.updateChildren([
                    copy(leftNode),
                    copy(minFather.children[1])
                ],minFather.id);
                console.log(this.treeGraph.findDataById(this.root.id));
                this.treeGraph.updateItem(minNode.id,copy(minNode.children[1]))
            }
        }
    }
}