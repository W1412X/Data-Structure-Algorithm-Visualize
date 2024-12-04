import G6 from '@antv/g6';

class GraphDraw {
  constructor(containerId) {
    this.idCounter = 1;
    this.nodes = [];
    this.edges = [];
    this.drawStack = [];
    this.UNSELECTED_COLOR = "#aaaaaa";
    this.SELECTED_COLOR = "#00804b";
    this.graph = this.createGraph(containerId);
  }

  // 获取唯一ID
  getIdCounter() {
    return String(this.idCounter++);
  }

  //获取当前所有节点
  getNodes() {
    return this.nodes;
  }

  //获取当前所有边
  getEdges() {
    return this.edges;
  }

  //创建Graph实例
  createGraph(containerId) {
    G6.registerNode('dom-node', {
      draw: (cfg, group) => {
        const shape = group.addShape('dom', {
          attrs: {
            width: cfg.size[0],
            height: cfg.size[1],
            html: `
            <div id=${cfg.id} class='dom-node' style="background-color: #fff; border: 2px solid ${cfg.stateColor}; border-radius: 5px; width: ${cfg.size[0] - 5}px; height: ${cfg.size[1] - 5}px; display: flex;">
              <div style="display:flex;flex-direction:column;height: 100%; width: 30%; background-color: ${cfg.stateColor};justify-content:center;">
                <div style="display:flex;flex-direction:row;justify-content:center;">
                    <span style="font-size:25px;font-weight:bold;color:#ffffff;">${cfg.id}</span>
                </div>
              </div>
              <div style="display:flex;flex-direction:column;margin:auto; padding:auto; color: #5B8FF9;justify-content:center;">
                <div style="font-size:18px;color:#000000;">root:${cfg.root}</div>
              </div>
            </div>
          `,
          },
          draggable: true,
        });
        return shape;
      },
    });

    const graph = new G6.Graph({
      container: containerId,
      width: 1200,
      height: 800,
      fitCenter: true,
      renderer: 'svg',
      linkCenter: true,
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
      animate: true,
      animateCfg: {
        duration: 500, // Number，一次动画的时长
        easing: 'linearEasing', // String，动画函数
      },
    });

    graph.on("dblclick", evt => {
      const model = {
        id: this.getIdCounter(),
        x: evt.x,
        y: evt.y,
      };
      graph.addItem("node", model);
      this.drawStack.push({ type: "node", id: model.id});
      this.nodes.push(model.id);
    });

    graph.node((node) => {
      return this.convertNode(node);
    });
    graph.edge((edge)=>{
      return this.convertEdge(edge);
    })

    return graph;
  }

  convertEdge(edge){
    return{
      source:edge.source,
      target:edge.target,
      type: 'line',
      style: {
        stroke: edge.selectState?this.SELECTED_COLOR:this.UNSELECTED_COLOR,
        lineWidth: 3,
      },
      label:edge.val,
      labelCfg:{
        style:{
          fill: edge.selectState?this.SELECTED_COLOR:this.UNSELECTED_COLOR,
          fontWeight:'bold',
          fontSize:'20px',
        },
        refX:10,
        refY:10
      },
      state: {},
      palette: {},
    }
  }
  // 转换节点格式
  convertNode(node) {
    return {
      type: 'dom-node',
      stateColor: node.selectState?this.SELECTED_COLOR:this.UNSELECTED_COLOR,
      size: [120, 60],
      root: node.id,
      id: node.id
    };
  }

  // 查找边
  findEdge(edge_) {
    return this.graph.find('edge', (edge) => {
      return edge.get('model').source === edge_.source && edge.get('model').target === edge_.target;
    });
  }

  // 回溯操作
  drawBack() {
    if (this.drawStack.length === 0) {
      return false;
    }
    const item = this.drawStack.pop();
    if (item.type == "node") {
      this.idCounter--;
      this.nodes.pop();
      this.graph.removeItem(item.id);
    } else {
      this.edges.pop();
      const model = this.findEdge(item.edge);
      this.graph.removeItem(model);
    }
    return true;
  }
  // 添加边
  addEdge(source, target,val) {
    this.graph.addItem("edge", { source: source, target: target,selectState:false,val:val });
    this.edges.push({ source: source, target: target,selectState:false,val:val });
    this.drawStack.push({ type: "edge", edge: { source: source, target: target,selectState:false,val:val } });
  }
  /**
   * 在kruskal算法中，所有的边分为两种 已选中和未选中
   * 传入参数ture/false 代表选中/未选中
   * {
   *  source
   *  target
   *  selectstate
   * }
   */
  setEdge(edge) {
    this.graph.updateItem(this.findEdge(edge),this.convertEdge(edge));
  }
  /**
   * 在kruskal算法中，节点需要更新的状态有
   * 1.是否选中
   * 2.并查集根
   * 传入{
   *  id
   *  root
   *  selectState
   * }
   */
  setNode(node){
    var tmp=this.convertNode(node);
    tmp.root=node.root;
    this.graph.updateItem(node.id,tmp)
  }

}

export default GraphDraw;
