var todo_cells = [];
var colored_adjacents = {};
var adjacent = {};
var total_count = 0;
var color_max = 500;

function set_leaf_color() {
    let cat = "leafc1";
    let leaves = document.getElementsByClassName(cat);

    let colors = {};
    for(i = 0; i< leaves.length; i++) {
        adjacent[i] = [];
        colored_adjacents[i] = [];
    }
    // find the adjacents for every cell
    for(var i = 0; i< leaves.length - 1; i++) {
        let rect1 = leaves[i].getBoundingClientRect();
        for(var j=i+1; j < leaves.length; j++ ) {
            if (is_adjacent(rect1, leaves[j].getBoundingClientRect() )){
                adjacent[i].push(j);
                adjacent[j].push(i);
            }
        }
    }

    set_color_to_cell(0, cat, adjacent[0], colors, leaves);
    while(todo_cells.length >0 && total_count < color_max) {
        let next = todo_cells.shift(); 
        set_color_to_cell(next, cat, adjacent[next], colors, leaves)
        total_count += 1;
        console.log('after ' + todo_cells);
    }
}

function set_color_to_cell(current, cat, adjs, colors, leaves){
    if (! (current in colors)) {
        console.log('processing ' + current);
        let new_c = get_diff_color(current, adjs, colors);
        colors [current] = new_c;
        leaves[current].classList.add( cat + '_' + new_c);
        for(var i=0;i<adjs.length;i++) {
            let neighbor = adjs[i];
            colored_adjacents[neighbor].push(current);
        }
        for(var i=0;i<adjs.length;i++) {
            let neighbor = adjs[i];
            if(!(neighbor in colors)){
                let calen = colored_adjacents[neighbor].length;
                console.log(neighbor + ' has ' + calen + ' colored adjacents.');
                if (calen > 2) {
                    console.log('put ' + neighbor + ' to the beginning of todo_cells - 3');
                    todo_cells.unshift(neighbor);
                } else if (calen == 2){
                    let c0 = colored_adjacents[neighbor][0];
                    if( neighbor == 3 ) {
                        console.log('----- cell 3 coloured => ' + colored_adjacents[neighbor]); 
                        console.log('----- cell 0 neighbours => ' + adjacent[c0]); 
                        let c1 = colored_adjacents[neighbor][1];
                        console.log('----- c1 = ' + c1);
                        console.log(c1 in adjacent[c0]);
                    }
                    if ( adjacent[c0].indexOf(colored_adjacents[neighbor][1]) >=0 ) {
                        console.log('put ' + neighbor + ' to the beginning of todo_cells - 2');
                        todo_cells.unshift(neighbor);
                    } 
                } else {
                    console.log('add ' + neighbor + ' to the end of todo_cells');
                    todo_cells.push(neighbor);
                }
            }
        }
    }
}

function get_diff_color(current, adjs, colors) {
    if (is_color_different(current, 1, adjs, colors)) {
        return 1;
    }
    if (is_color_different(current, 2, adjs, colors)) {
        return 2;
    }
    return 3;
}

function is_color_different(current, new_c, adjs, colors){
    for(var i=0; i< adjs.length; i++) {
        if (adjs[i]  in colors) {
            if ( colors[adjs[i]] == new_c ) return false;
        }
    }
    return true;
}

function is_adjacent(rect1, rect2) {
    if (is_same(rect1.top, rect2.bottom) || is_same(rect1.bottom, rect2.top)){
        return rect1.left > rect2.right || rect1.right < rect2.left ? false : true;
    }
    if (is_same(rect1.left, rect2.right) || is_same(rect1.right, rect2.left)){
        return rect1.top > rect2.bottom || rect1.bottom < rect2.top ? false : true;
    }    
    return false;
}

function is_same(x1, x2) {
    return Math.abs(x1 - x2) < 4;  
}