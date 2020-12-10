var todo_cells;
var high_priority_todo;
//var colored_adjacents;
var adjacent;
var colormap;
var adjacent_colors;
var colored;

let num_color_space = 3;

function set_leaf_color() {
    let cats = ["leafc1", "leafc2", "leafc3", "leafc4","leafcu"];
    cats.forEach(c => set_color_for_cat(c));
}

function set_color_for_cat(cat){
    todo_cells = [];
    high_priority_todo = [];
    //colored_adjacents = {};
    adjacent = {};
    colormap = {};
    adjacent_colors = {};
    colored =[];

    let leaves = document.getElementsByClassName(cat);
    for(i = 0; i< leaves.length; i++) {
        adjacent[i] = [];
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

    set_color_to_cell(0, cat, leaves);
    while( (todo_cells.length >0 || high_priority_todo.length >0)) {
        let next = high_priority_todo.length >0 ? high_priority_todo.shift() : todo_cells.shift(); 
        set_color_to_cell(next, cat, leaves)
    }
}

function set_color_to_cell(current, cat, leaves){
    if (colored.indexOf(current)<0) {
        let level2 = leaves[current].getAttribute('level2');
        console.log('----- coloring ' + level2 + ', for cell ' + current + ', adjacent colours= ' + adjacent_colors[level2]);
        let adjs = adjacent[current];
        let new_c = get_diff_color(adjacent_colors[level2]);
        colored.push(current);
        colormap [current] = new_c;
        let colorclass = cat + '_' + new_c;
        leaves[current].classList.add( colorclass );
        let siblings = get_cells_in_same_level2(level2, leaves);
        console.log('found ' + siblings.length + ' cells in the same category ' + level2);        
        for(var i=0;i<siblings.length;i++){
            let next = siblings[i];
            if (next != current) {
                colormap[next] = new_c;
                colored.push(next);
                leaves[next].classList.add( colorclass );
            }
        }
        for(var i=0;i<siblings.length;i++){
            process_neighbor_after_coloring(siblings[i], new_c, level2, leaves);
        }
    }
}

function get_diff_color(adjcolors) {
    if (adjcolors === undefined) {
        return 1;
    } else {
        for(var i=1; i<=num_color_space; i++) {
            if (adjcolors.indexOf(i) <0) {
                return i;
            }
        }
        return Math.floor(Math.random() * Math.floor(num_color_space)) + 1;
    }
}

function get_cells_in_same_level2(level2, leaves){
    let samel = [];
    if (level2 != null && level2.length >0) {
        for(var i = 0; i< leaves.length; i++) {
            if (level2 == leaves[i].getAttribute('level2')) {
                samel.push(i);
            }
        }
    }
    return samel;
}

function process_neighbor_after_coloring(current, color, level2, leaves){
    let adjs = adjacent[current];
    for(var i=0;i<adjs.length;i++) {
        let neighbor = adjs[i];
        let elem = leaves[neighbor];
        let sibl2 = elem.getAttribute('level2');
        if (sibl2 != level2) {
            if (!(sibl2 in adjacent_colors)) {
                adjacent_colors[sibl2] = [];
            }
            if (adjacent_colors[sibl2].indexOf(color) <0) {
                adjacent_colors[sibl2].push(color);
            }
        }
    }

    for(var i=0;i<adjs.length;i++) {
        let neighbor = adjs[i];
        if(colored.indexOf(neighbor) < 0){
            let elem = leaves[neighbor];
            let sibl2 = elem.getAttribute('level2');
            if (adjacent_colors[sibl2].length >= 2) {
                if(high_priority_todo.indexOf(neighbor) <0) {
                    high_priority_todo.push(neighbor);
                }
            }
            else {
                if (todo_cells.indexOf(neighbor) <0) {
                    todo_cells.push(neighbor);
                }
            }
        }
    }

}

function is_color_different(current, new_c, adjs){
    for(var i=0; i< adjs.length; i++) {
        if (adjs[i]  in colormap) {
            if ( colormap[adjs[i]] == new_c ) return false;
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
    return Math.abs(x1 - x2) < 5;  
}