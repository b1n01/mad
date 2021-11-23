const process = () => {
    let blocks = [], prev = data.shift();
    for(let block of data) {
        if(block.t === prev.t && block.s === 0) {
            prev.v = prev.v.concat(block.v);
        } else {
            blocks.push(prev);
            prev = block;
        }
    }
    return blocks;
}