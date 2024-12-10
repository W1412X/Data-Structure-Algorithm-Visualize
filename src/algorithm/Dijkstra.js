// @/algorithm/Dijkstra.js
import { copy } from "@/utils/tree_funcs";

export class Dijkstra {
    constructor(graphDraw, source) {
        this.graphDraw = graphDraw;
        this.source = source;
        this.nodes = {};
        this.edges = copy(this.graphDraw.edges);
        this.visited = new Set();
        this.distances = {};
        this.previous = {};
        this.queue = new Set();
        
        // 初始化节点数据
        this.graphDraw.nodes.forEach(nodeId => {
            this.distances[nodeId] = Infinity;
            this.previous[nodeId] = null;
            this.nodes[nodeId] = {
                id: nodeId,
                distance: Infinity,
                selectState: false,
            };
        });
        this.distances[source] = 0;
        this.nodes[source].distance = 0;
        this.queue = new Set(this.graphDraw.nodes);
        
        // 更新起始节点显示
        this.graphDraw.setNode(copy(this.nodes[source]));
    }

    /**
     * 执行算法的一步
     * @returns bool 如果为false则说明算法已经运行完毕
     */
    step() {
        if (this.queue.size === 0) {
            return false;
        }

        // 找到距离最小的节点
        let current = null;
        let minDistance = Infinity;
        this.queue.forEach(nodeId => {
            if (this.distances[nodeId] < minDistance) {
                minDistance = this.distances[nodeId];
                current = nodeId;
            }
        });

        if (current === null) {
            return false;
        }

        // 标记当前节点为已访问
        this.queue.delete(current);
        this.visited.add(current);
        this.nodes[current].selectState = true;
        this.graphDraw.setNode(copy(this.nodes[current]));

        // 遍历当前节点的邻居
        this.edges.forEach(edge => {
            if (edge.source === current || edge.target === current) {
                const neighbor = edge.source === current ? edge.target : edge.source;
                if (!this.visited.has(neighbor)) {
                    const alt = this.distances[current] + Number(edge.val);
                    if (alt < this.distances[neighbor]) {
                        this.distances[neighbor] = alt;
                        this.previous[neighbor] = current;
                        this.nodes[neighbor].distance = alt;
                        this.graphDraw.setNode(copy(this.nodes[neighbor]));
                        // 更新边的显示，例如显示最短路径的边
                        this.graphDraw.setEdge({
                            source: edge.source,
                            target: edge.target,
                            selectState: 1, // 选中状态 (绿色)
                            val: edge.val
                        });
                    }
                }
            }
        });

        return true;
    }

    /**
     * 回溯并标记有用的边
     */
    markUsefulEdges() {
        const usefulEdges = new Set();

        // 回溯所有节点的前驱节点，标记有用的边
        Object.keys(this.previous).forEach(nodeId => {
            const prev = this.previous[nodeId];
            if (prev !== null) {
                // 创建一个唯一的边标识，可以考虑源和目标的组合
                const edgeKey1 = `${prev}-${nodeId}`;
                const edgeKey2 = `${nodeId}-${prev}`;
                usefulEdges.add(edgeKey1);
                usefulEdges.add(edgeKey2);
            }
        });

        // 遍历所有边，标记有用和无用的边
        this.edges.forEach(edge => {
            const edgeKey = `${edge.source}-${edge.target}`;
            const edgeKeyReverse = `${edge.target}-${edge.source}`;
            if (usefulEdges.has(edgeKey) || usefulEdges.has(edgeKeyReverse)) {
                // 标记为有用的边（绿色）
                this.graphDraw.setEdge({
                    source: edge.source,
                    target: edge.target,
                    selectState: 1, // 绿色
                    val: edge.val
                });
            } else {
                // 标记为无用的边（灰色）
                this.graphDraw.setEdge({
                    source: edge.source,
                    target: edge.target,
                    selectState: 0, // 灰色
                    val: edge.val
                });
            }
        });
    }
}
