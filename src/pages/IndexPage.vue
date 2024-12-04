<template>
    <main style="display: flex;flex-direction: column;min-width: 1500px;overflow: scroll;">
        <div style="display: flex;font-size: 20px;color: #4a4a4a;font-weight: bold;padding: 10px;width: 100%;flex-direction: row;justify-content:center">
            <span style="font-size: 30px;margin-top: 50px;">树状数据结构/图算法可视化</span>
        </div>
        <div style="display: flex;flex-direction: row;padding: 50px;justify-content: center;">
            <v-btn style="width: 40%;height: 200px;margin: 20px;font-size: 28px;" color="#4faca9" @click="toTreePage">树状数据结构</v-btn>
            <v-btn style="width: 40%;height: 200px;margin: 20px;font-size: 28px;" color="#4faca9" @click="toMapPage">图算法</v-btn>
        </div>
    </main>
</template>
<script>
import { useRouter } from 'vue-router';
export default{
    setup(){
        const router=useRouter();
        return {
            router,
        }
    },
    data(){

    },
    methods:{
        toTreePage(){
            this.router.push({name:"TreePage",params:{}});
        },
        toMapPage(){
            this.router.push({name:"MapPage",params:{}});
        }
    }
}
</script>