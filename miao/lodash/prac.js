function createTreeNode(val) {
    return {
        val: val,
        left: null,
        right: null
    }
}

//将存储在ary中的根节点在rootIdx位置的二叉树转为二叉链表(空的地方全填null)
function arrayToTree(ary, rootAt = 0) {
    if (ary[rootAt] == null) {
        return null
    }

    let root = createTreeNode(ary[rootAt])
    root.left = arrayToTree(ary, rootAt * 2 + 1)
    root.right = arrayToTree(ary, rootAt * 2 + 2)
    return root
}
let t1 = arrayToTree([1, 2, 3, 4, 5, 6, 7])




function treeToArray(root, idx = 0, ary = []) { //ary每次接的都是同一个数组
    if (root) { //结点为null啥也不做，所以只考虑结点存在的情况
        ary[idx] = root.val
        treeToArray(root.left, idx * 2 + 1, ary)
        treeToArray(root.right, idx * 2 + 2, ary)
    } else { //给没有结点的null填个null
        ary[idx] = null
    }
    return ary
}

let a1 = treeToArray(t1)


//借助队列 把树转换成稠密数组
function treeToCondenseArray(root) {

    if (!root) {
        return []
    }
    let queue = [root]
    let res = []

    while (queue) {
        let node = queue[0].shift() //这是一个O(n)操作，需要改变数组后续元素
        if (node) {
            res.push(node.val)
            queue.push(node.left)
            queue.push(node.right)
        } else {
            res.push(null)
        }
    }

    return res
}

//借助数组 把树转换成稠密数组
function treeToCondenseArray(root) {
    if (!root) {
        return []
    }
    let nodes = [root]
    let res = []
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]
        if (node) {
            res.push(node.val)
            nodes.push(node.left)
            nodes.push(node.right)
        } else {
            res.push(null)
        }
    }
    return res
}

//借助队列 把稠密型数组转换成链式二叉树
function condensedArrayToTree(ary) {
    if (ary.length == 0) {
        return null
    }
    let root = createTreeNode(ary[0])
    let supNodes = [root]

    for (let i = 1; i < ary.length; i++) {
        let node = supNodes.shift()

        //连接node.left并将该结点推入辅助队列待处理
        if (ary[i] == null) {
            node.left = null
        } else {
            node.left = createTreeNode(ary[i])
            supNodes.push(node.left)
        }

        i++
        //连接node.right并将右节点推入辅助队列待处理
        if (ary[i] == null) {
            node.right = null
        } else {
            node.right = createTreeNode(ary[i])
            supNodes.push(node.right)
        }
    }
    return root
}


var inorderTraversal = function(root, ary = []) {
    if (root) {
        inorderTraversal(root.left)
        ary.push(root.val)
        inorderTraversal(root.right)
    }
    return ary
};
var inorderTraversal = function(root, ary = []) {
    if (root) {
        inorderTraversal(root.left, ary)
        ary.push(root.val)
        inorderTraversal(root.right, ary)
    }
    return ary
};

addEventListener('message', function() {

})