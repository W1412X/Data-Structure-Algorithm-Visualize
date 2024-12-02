export function isNumericString(str) {
    if (typeof str !== 'string') return false; // 确保输入是字符串
    return /^-?[0-9]+$/.test(str); // 支持负号的正则表达式;
  }
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function convertNode(node) {
  return {
      size: 16,
      style: {
          stroke:node.vis?"#eff4ff":"#00000000",
          fill:node.vis?"#5f95ff":"#00000000"
      },
      state: {
          focus: {
              lineWidth: "2",
              stroke: "orange"
          }
      },
      label: node.vis?node.val:" ",
      labelCfg: {
          position: "left",
          fontSize: 1
      },
  }
}

/**
 * 深拷贝
 */
export function copy(json){
    return JSON.parse(JSON.stringify(json));
}

/**
 * 获取新的图对象  
 */
import G6 from '@antv/g6';
export function getTreeGraph(){
    var treeGraph= new G6.TreeGraph({
        container: 'mountNode',
        width: 1200,
        height: 800,
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
            getHGap: () => 20,
        },
        animate:true,
        animateCfg: {
            duration: 500, // Number，一次动画的时长
            easing: 'easeLinear', // String，动画函数
        },
    });

    treeGraph.node((node) => (convertNode(node)));
    treeGraph.edge(()=>({
        type: 'line',
        style: {
            stroke:"#8a8a8a",
            lineWidth:1
        },
        state: {

        },
        palette: {},
    }));
    return treeGraph;
}
/**
 * 从树数据结构中获取一个id对应的节点
 * 返回一个深拷贝的节点  
 */
export function getNodeById(root,id){
    if(root.id==id){
        return copy(root);
    }else{
        for(var i=0;i<root.children.length;i++){
            var tmp_node=getNodeById(root.children[i],id);
            if(tmp_node==null){
                continue;
            }else{
                return copy(tmp_node);
            }
        }
    }
    return null;
}

/**
 * 通过id获取其父节点
 * 如果id是根节点，则返回"root"
 * 否则返回父节点的一个深拷贝
 * 没有找到返回null
 */
export function getFatherById(root,id){
    if(root.id==id){
        return "root";
    }
    for(let i=0;i<root.children.length;i++){
        if(root.children[i].id==id){
            return copy(root);
        }
    }
    for(let i=0;i<root.children.length;i++){
        var tmp_node=getFatherById(root.children[i],id);
        if(tmp_node==null){
            continue;
        }else{
            return tmp_node;
        }
    }
    return null;
}

/**
 * 通过id获取其父节点
 * 如果id是根节点，则返回"root"
 * 否则返回父节点的一个引用
 * 没有找到返回null
 */
export function getFatherByIdRefer(root,id){
    if(root.id==id){
        return "root";
    }
    for(let i=0;i<root.children.length;i++){
        if(root.children[i].id==id){
            return root;
        }
    }
    for(let i=0;i<root.children.length;i++){
        var tmp_node=getFatherByIdRefer(root.children[i],id);
        if(tmp_node==null){
            continue;
        }else{
            return tmp_node;
        }
    }
    return null;
}


/**
 * 从树数据结构中获取一个id对应的节点
 * 返回一个节点的引用  
 */
export function getNodeByIdRefer(root,id){
    if(root.id==id){
        return root;
    }else{
        for(var i=0;i<root.children.length;i++){
            var tmp_node=getNodeByIdRefer(root.children[i],id);
            if(tmp_node==null){
                continue;
            }else{
                return tmp_node;
            }
        }
    }
    return null;
}


/**
 * 获取最小的节点的id
 */
export function getMinNodeId(root){
    if(root.children.length==0||!root.children[0].vis){
        return root.id;
    }
    return getMinNodeId(root.children[0]);
}
