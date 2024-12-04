export function dictIncludes(arr,dict){
    for(let i=0;i<arr.length;i++){
        if(JSON.stringify(arr[i])==JSON.stringify(dict)){
            return true;
        }
    }
    return false;
}
export function edgeIncludes(edges,edge){
    for(let i=0;i<edges.length;i++){
        if(edges[i].source==edge.source&&edges[i].target==edge.target){
            return true;
        }
    }
    return false;
}