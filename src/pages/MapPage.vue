<template>
    <main style="display: flex; flex-direction: column; min-width: 1500px; overflow: scroll;">
        <div
            style="display: flex; font-size: 20px; color: #4a4a4a; font-weight: bold; padding: 10px; width: 100%; flex-direction: row;">
            <span>图算法可视化</span>
        </div>
        <div style="height: 2px; background-color: #8a8a8a; margin-bottom: 20px; width: 100%;"></div>
        <div style="display: flex; flex-direction: row-reverse; overflow: scroll; justify-content: center;">
            <div id="mountNode"
                style="border-radius: 10px; border: 2px #8a8a8a solid; width: 1200px; height: 800px; margin-right: 20px;">
            </div>
            <div style="display: flex; flex-direction: column; margin-right: 20px; width: 350px;">
                <div style="display: flex; flex-direction: column;">
                    <div style="font-size:20px; font-weight: bold;">
                        算法部分<br />
                        <span style="font-size: 18px;">
                            逐步运行算法
                        </span>
                    </div>
                    <v-select variant="outlined" v-model="algorithm" label="选择算法" density="compact"
                        style="max-height: 60px; width: 300px; margin-top: 10px;"
                        :items="['Kruskal最小生成树', 'Dijkstra最短路径']">
                    </v-select>

                    <!-- 当选择 Dijkstra 时显示起始节点选择 -->
                    <div v-if="algorithm === 'Dijkstra最短路径'" style="margin-top: 10px;">
                        <v-select variant="outlined" v-model="dijkstraSource" label="选择起始节点" density="compact"
                            style="max-height: 60px; width: 300px;" :items="nodes">
                        </v-select>
                    </div>

                    <v-btn @click="step" variant="tonal" style="width: 300px; margin-bottom: 10px;">执行算法</v-btn>
                </div>

                <div v-if="!ifRun" style="display: flex; flex-direction: column;">
                    <div style="font-size:20px; font-weight: bold;">
                        绘制部分<br />
                        <span style="font-size: 18px;">
                            双击画布创建新节点
                        </span>
                    </div>
                    <div
                        style="display: flex; flex-direction: row; justify-content: center; margin-top: 10px; width: 300px;">
                        <v-text-field variant="outlined" v-model="source" label="起始" density="compact"
                            style="max-height: 60px; max-width: 150px; margin-right: 10px;">
                        </v-text-field>
                        <v-text-field variant="outlined" v-model="target" label="终止" density="compact"
                            style="max-height: 60px; max-width: 150px;">
                        </v-text-field>
                        <v-text-field variant="outlined" v-model="val" label="权值" density="compact"
                            style="max-height: 60px; max-width: 150px;">
                        </v-text-field>
                    </div>
                    <v-btn @click="addEdge" variant="tonal" style="width: 300px; margin-top: 10px;">添加边</v-btn>
                    <v-btn @click="drawBack" variant="tonal" style="width: 300px; margin-top: 10px;">撤销绘制</v-btn>
                </div>

                <!-- Dijkstra 距离表格展示 -->
                <div v-if="algorithm === 'Dijkstra最短路径'" style="margin-top: 20px;">
                    <div>当前算法: {{ algorithm }}</div> <!-- 调试信息 -->
                    <div style="font-size:20px; font-weight: bold;">
                        距离表
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>节点</th>
                                <th>距离</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in distanceItems" :key="item.node">
                                <td>{{ item.node }}</td>
                                <td>{{ item.distance }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
import { Kruskal } from '@/algorithm/Kruskal';
import { Dijkstra } from '@/algorithm/Dijkstra';
import GraphDraw from '@/utils/kruskal_graph';
import { edgeIncludes } from '@/utils/other';
import { isNumericString } from '@/utils/tree_funcs';

export default {
    name: 'TreeGraph',
    data() {
        return {
            data: {
                nodes: [],
                edges: [],
            },
            graphDraw: null,
            file: null,
            algorithm: null,
            source: null,
            target: null,
            val: null,
            ifRun: false,
            kruskal: null,
            dijkstra: null,
            dijkstraSource: null,
            nodes: [], // 使用简单的字符串数组
            dijkstraDistances: {}, // 用于存储 Dijkstra 距离的数据
            distanceHeaders: [
                { text: '节点', value: 'node' },
                { text: '距离', value: 'distance' },
            ],
        }
    },
    computed: {
        distanceItems() {
            const items = Object.keys(this.dijkstraDistances).map(node => ({
                node: node,
                distance: this.dijkstraDistances[node] === Infinity ? '∞' : this.dijkstraDistances[node]
            }));
            console.log("Computed distanceItems:", items); // 调试信息
            return items;
        }
    },
    methods: {
        step() {
            if (this.algorithm == null) {
                window.alert("选择一个算法");
                return;
            }
            if (this.algorithm === 'Kruskal最小生成树') {
                if (this.ifRun == false) {
                    this.ifRun = true;
                    this.kruskal = new Kruskal(this.graphDraw);
                }
                if (!this.kruskal.step()) {
                    window.alert("算法已运行完毕")
                }
            } else if (this.algorithm === 'Dijkstra最短路径') {
                console.log("Before any updates, dijkstraDistances:", this.dijkstraDistances); // 调试信息
                if (this.dijkstraSource == null) {
                    window.alert("请选择 Dijkstra 的起始节点");
                    return;
                }
                if (this.ifRun == false) {
                    this.ifRun = true;
                    this.dijkstra = new Dijkstra(this.graphDraw, this.dijkstraSource);
                    console.log("Dijkstra initialized with source:", this.dijkstraSource); // 调试信息
                }
                if (this.dijkstra.step()) {
                    // 如果算法未结束，更新距离数据
                    this.dijkstraDistances = { ...this.dijkstra.distances };
                    console.log("Updated dijkstraDistances:", this.dijkstraDistances); // 调试信息

                    // 动态标记有用和无用的边
                    this.dijkstra.markUsefulEdges();
                } else {
                    window.alert("算法已运行完毕");
                    // 最后一步也需要更新距离数据
                    this.dijkstraDistances = { ...this.dijkstra.distances };
                    console.log("Final dijkstraDistances:", this.dijkstraDistances); // 调试信息

                    // 标记有用和无用的边
                    this.dijkstra.markUsefulEdges();
                }
            }
        },
        drawBack() {
            if (!this.graphDraw.drawBack()) {
                window.alert("无更多可撤销绘制");
            }
        },
        addEdge() {
            if (this.source == null || this.target == null || this.val == null) {
                window.alert("边未设置");
                return;
            }
            if (!this.graphDraw.nodes.includes(this.source) || !this.graphDraw.nodes.includes(this.target)) {
                window.alert("节点不存在");
                return;
            }
            if (edgeIncludes(this.graphDraw.edges, { source: this.source, target: this.target, selectState: false })
                || edgeIncludes(this.graphDraw.edges, { source: this.source, target: this.target, selectState: true })) {
                window.alert("边已存在")
                return;
            }
            if (this.source == this.target) {
                window.alert("无法添加自旋边");
                return;
            }
            if (isNumericString(this.val) && Number(this.val) <= 0) {
                window.alert("权值错误，必须>0的整数");
                return;
            }
            this.graphDraw.addEdge(this.source, this.target, this.val);
            this.updateNodes(); // 更新节点列表
        },
        updateNodes() {
            this.nodes = this.graphDraw.nodes.map(id => id.toString()); // 使用简单的字符串数组
            console.log("Updated nodes:", this.nodes); // 调试输出
        },
    },
    mounted() {
        this.graphDraw = new GraphDraw("mountNode");
        this.graphDraw.graph.data(this.data);
        this.graphDraw.graph.render();
        this.updateNodes(); // 初始化节点列表

        console.log("Initial nodes:", this.graphDraw.nodes);
        console.log("Initial edges:", this.graphDraw.edges);

        // 监听节点添加事件，更新节点列表
        this.graphDraw.graph.on("node:added", () => {
            this.updateNodes();
        });

        // 如果有初始节点，确保它们被加载
        if (this.graphDraw.nodes.length > 0) {
            this.updateNodes();
        }

        // 手动设置 dijkstraDistances 以测试表格（可选）
        // this.dijkstraDistances = { "1": 0, "2": 3 };
        // console.log("Manually set dijkstraDistances:", this.dijkstraDistances);
    }
}
</script>

<style>
/* Hide scrollbar and make the container fill the parent */
#mountNode {
    overflow: hidden;
    margin: 0;
}

.dom-node {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    /* 确保文本居中显示 */
    overflow: hidden;
    /* 防止文本溢出 */
}

/* 添加表格样式 */
table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    border: 1px solid #8a8a8a;
    padding: 8px;
    text-align: center;
}

th {
    background-color: #f2f2f2;
}
</style>
