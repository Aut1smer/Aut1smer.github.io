//解析正则模式，返回正则语法树
function parsePattern(input) {
    let str = input.toString()
    let i = 0
    let groupIndex = 1 //括号从第1组开始计数，非捕获分组标记为0


    //路由解析函数
    function parseRoute() {
        if (str[i] == '[') {
            return parseCharacterClass()
        } else if (str[i] == '(') {
            return parseCaptureGroup()
        } else if (str[i] == '*' || str[i] == '+' || str[i] == '?' || str[i] == '{') {
            return parseQuantifier()
        } else if (str[i] == '\\') {
            return parseEscape()
        } else {
            return parseCharacter()
        }
    }

    //解析字符  a
    function parseCharacter() {
        let node = {
            type: 'Character',
            value: str[i],
            raw: str[i],
            ascii: str.charCodeAt(i),
            startIdx: i,
            endIdx: 0,
        }
        i++
        return node
    }




    //解析字符集 [^abc]
    function parseCharacterClass() {
        /*未考虑[a-z] [0-9]这种情况*/
        let node = {
            type: 'CharacterClass',
            elements: [],
            reverse: false,
            raw: '',
            startIdx: i,
            endIdx: 0
        }
        let iFrom = i //记录i进入的初始值
        i++ //skip [
        if (str[i] == '^') {
            node.reverse = true
            i++ //skip ^
        } else if (str[i] == ']') { //[]
            i = iFrom
            return parseCharacter()
        }
        while (str[i] !== ']' && i < str.length) {
            let charNode = parseRoute()
            if (charNode.value == '-' && node.elements.length > 0 && i + 1 < str.length) {
                let prevNode = node.elements.pop() // 0
                let postNode = parseCharacter()
                let rangeNode = {
                    type: 'Character',
                    value: prevNode.value + charNode.value + postNode.value,
                    raw: '',
                    ascii: prevNode.value.charCodeAt(0) + '-' + postNode.value.charCodeAt(0),
                    startIdx: prevNode.startIdx,
                    endIdx: postNode.endIdx,
                }
                rangeNode.raw = str.slice(rangeNode.startIdx, rangeNode.endIdx)
                node.elements.push(rangeNode)
            } else {
                node.elements.push(charNode)
            }
        }

        i++ //skip ]
        node.endIdx = i
        node.raw = str.slice(node.startIdx, node.endIdx)
        return node
    }

    //解析转义字符
    function parseEscape() {

    }

    //解析量词
    function parseQuantifier() {
        let node = {
            type: 'Quantifier',
            element: null, //wait for branch's pop
            raw: '',
            startIdx: i,
            endIdx: 0,
            max: Infinity,
            min: 0,
            greedy: true
        }
        let iFrom = i
        let min = 0,
            max = Infinity
        if (str[i] == '*') {
            i++
        } else if (str[i] == '+') {
            min = 1
            i++
        } else if (str[i] == '?') {
            max = 1
            i++
        } else if (str[i] == '{') { // {2,3} {2} {2,}的量词
            i++ //skip {
            if (str[i] >= '0' && str[i] <= '9') { //遇到数字
                min = parseNum()

                if (str[i] == ',') { //{2,
                    i++ //skip ,
                    if (str[i] >= '0' && str[i] <= '9') { //{2,3}
                        max = parseNum()
                        if (!str[i] == '}') { //{2,3abc
                            i = iFrom
                            return parseCharacter()
                        }
                    } else if (str[i] == '}') { //{2,}
                        max = Infinity
                    } else { //{2,abc
                        i = iFrom
                        return parseCharacter()
                    }
                } else if (str[i] == '}') { // {2}
                    max = min
                } else { //{2abc
                    i = iFrom
                    return parseCharacter()
                }
                i++ //skip }
            } else { //遇到{}或者{.等其他情况，遇到的min不是数字
                i = iFrom
                return parseCharacter()
            }
        }

        if (str[i] == '?') {
            node.greedy = false
            i++ // skip ?
        }
        node.min = min
        node.max = max
        node.endIdx = i
        node.raw = str.slice(node.startIdx, node.endIdx)
        return node
    }

    function parseNum() {
        let numStr = ''
        while (str[i] >= '0' && str[i] <= '9') {
            numStr += str[i]
            i++
        }
        return Number(numStr)
    }

    //解析捕获分组
    function parseCaptureGroup() {
        let node = {
            type: 'CaptureGroup',
            branches: null,
            groupName: '',
            groupIndex: groupIndex++, //非捕获分组，信息是groupIndex为0
            assertion: false, // 是否零宽断言
            lookahead: true, //预测先行true  回顾后发false
            positive: true, //零宽正负，正向断言
            raw: '',
            startIdx: i,
            endIdx: 0
        }

        /* there are all of situation
        (foo|bar)
        (?:foo)
        (?=foo)
        (?!foo)
        (?<=foo)
        (?<!foo)
        (?<name>foo)
        */
        let iFrom = i
        i++ // skip (
        if (str[i] == '?') {
            i++ // skip ?
            if (str[i] == ':') {
                node.groupIndex = 0
                groupIndex--
                i++
            } else if (str[i] == '=') {
                node.assertion = true
                node.groupIndex = 0
                groupIndex--
                i++
            } else if (str[i] == '!') {
                node.assertion = true
                node.positive = false
                node.groupIndex = 0
                groupIndex--
                i++
            } else if (str[i] == '<') {
                i++ //skip <
                if (str[i] == '=') {
                    node.assertion = true
                    node.lookahead = false
                    node.groupIndex = 0
                    groupIndex--
                    i++
                } else if (str[i] == '!') {
                    node.assertion = true
                    node.lookahead = false
                    node.positive = false
                    node.groupIndex = 0
                    groupIndex--
                    i++
                } else { //具名分组
                    let thisName = parseGroupName()
                    if (thisName === false) {
                        i = iFrom
                        return parseCharacter()
                    }
                    node.groupName = thisName
                }
            }
        }

        node.branches = parseBranches()
        i++ //skip )
        node.endIdx = i
        node.raw = str.slice(node.startIdx, node.endIdx)
        return node
    }


    function parseGroupName() {
        let nameStr = ''
        while (str[i] != '>' && i < str.length) {
            nameStr += str[i]
            i++
        }
        if (str[i] !== '>') {
            return false
        }
        i++ //skip >
        return nameStr.trim()
    }


    //解析分支集合  被用于pattern和captureGroup中
    // 解析每条分支
    function parseBranches() {
        let branches = []
        do {
            let branch = parseBranch()
            if (branch.elements.length != 0) { // '(avs{3,}|q()a*f??)' 的()设为返回无内容
                branches.push(branch)
            }
            if (str[i] == '|') {
                i++
            }
        } while (i < str.length && str[i] != ')')
        return branches
    }

    //解析单分支 a[1234]*?(xyz)|abcd 、 (asbd) 、 (foo|bar|baz)
    function parseBranch() {
        let node = {
                type: 'Branch',
                elements: [], //maybe 字符、字符集、量词、括号
                startIdx: i,
                endIdx: 0,
                raw: ''
            }
            //遇到 | ) 或者结束时停止，处理量词的
        while (str[i] !== '|' && str[i] !== ')' && i < str.length) {
            try {
                let elt = parseRoute()
                if (elt.type == 'Quantifier') { //若解析出量词结点，更新量词属性
                    let prevElt = node.elements.pop()
                    if (prevElt.type == 'Quantifier') { // such as /a**/
                        throw new SyntaxError('unexpected type of quantifier' + prevElt.raw + str[i] + ' at pos:' + elt.startIdx)
                    }
                    elt.element = prevElt
                    elt.startIdx = prevElt.startIdx
                    elt.raw = str.slice(elt.startIdx, elt.endIdx)
                }
                node.elements.push(elt)
            } catch (e) {
                if (e.message == 'not quantifier but two {} elements of Character type') {
                    node.elements.push(parseCharacter()) // {
                    node.elements.push(parseCharacter()) // }
                } else {
                    throw e
                }
            }
        }

        node.endIdx = i
        node.raw = str.slice(node.startIdx, node.endIdx)
        return node
    }


    return {
        type: 'Pattern',
        branches: parseBranches(),
        raw: str.slice(),
        startIdx: 0,
        endIdx: i,
    }
}
/*----------------解析Pattern结束-----------------*/









/* -------------------Graph drawing----------------- */
function createRegExp(pattern, graphPadding = 10, fontSize = 16) {
    const svg = document.querySelector('svg')
        // let graphPadding = 10
        // let fontSize = 16
        //路由绘制
    function createGraph(node) {
        switch (node.type) {
            case 'Pattern':
                return createPatternGraph(node) // node.elements
            case 'CaptureGroup':
                return createCaptureGroupGraph(node) // node.elements
            case 'Quantifier':
                return createQuantifierGraph(node)
            case 'Branch':
                return createBranchGraph(node)
                    // case 'Branches'
            case 'CharacterClass':
                return createCharacterClassGraph(node)
            case 'Character':
                return createCharacterGraph(node)
        }
    }

    //画整个REGEXP模式
    function createPatternGraph(node) {
        let subGraph = createBranchesGraph(node.branches, true)
        let width = subGraph.box.width + 6 * graphPadding
        let height = subGraph.box.height + 2 * graphPadding

        let g = svgElt('g')
        let rect = svgElt('rect', {
            width,
            height,
            fill: 'none',
        })
        g.append(rect)
        g.append(subGraph.g)
        subGraph.g.style.transform = `translate(${3 * graphPadding}px, ${graphPadding}px)`

        let radius = graphPadding
        let circleStart = svgElt('circle', {
                'cx': radius + 1,
                'cy': height / 2,
                'r': radius,
                'stroke': 'black',
                'fill': '#6B6659',
                'stroke-width': '2',
            }),
            circleEnd = svgElt('circle', {
                'cx': width - radius - 1,
                'cy': height / 2,
                'r': radius,
                'stroke': 'black',
                'fill': '#6B6659',
                'stroke-width': '2',
            })


        let path = svgElt('path', {
            stroke: 'black',
            'stroke-width': '2',
        })
        g.append(path)
        let d = `M ${radius * 2} ${height / 2}
                 h ${graphPadding}
                 M ${width - 2 * radius} ${height / 2}
                 h -${graphPadding}
        `
        path.setAttribute('d', d)

        g.append(circleStart, circleEnd)

        return {
            g,
            box: g.getBBox()
        }
    }

    //画捕获分组
    function createCaptureGroupGraph(node) {
        let graph = createBranchesGraph(node.branches)
        let width = graph.box.width + 2 * graphPadding
        let height = graph.box.height + 4 * graphPadding

        let g = svgElt('g')
        let rect = svgElt('rect', {
                width,
                height,
                fill: 'none' //包住边框 skyblue
            })
            //边框范围： 与多分支branches的图一样大
        let border = svgElt('rect', {
            width: graph.box.width,
            height: graph.box.height,
            fill: 'none',
            stroke: 'grey',
            'stroke-dasharray': '4 5', //虚线
            rx: graphPadding,
            ry: graphPadding
        })
        g.append(rect, graph.g, border)
            // graph.g.style.transform = `translate(${graphPadding}px, ${2.5 * graphPadding}px)`
        graph.g.style.transform = `translate(${graphPadding}px, ${2 * graphPadding}px)`
            // border.style.transform = `translate(${graphPadding}px, ${2.5 * graphPadding}px)`
        border.style.transform = `translate(${graphPadding}px, ${2 * graphPadding}px)`
        let text
        if (!node.assertion) {
            text = createTextGraph(node.groupIndex > 0 ? `Group#${node.groupIndex} ${node.groupName ? '<' + node.groupName + '>' : ''} ` : 'non-capture')
        } else {
            let str = ''
            if (node.positive) {
                str += 'positive'
            } else {
                str += 'negative'
            }
            if (node.lookahead) {
                str += ' lookahead'
            } else {
                str += ' lookbehind'
            }
            text = createTextGraph(str)
        }
        g.append(text.g)

        //缺失的连接线 奇数续 偶数不续 ctrl z
        // if (node.branches.length & 1) {

        let path = svgElt('path', {
            stroke: 'black',
            'stroke-width': '2',
        })
        g.append(path)
        let d = `M ${0} ${(4 * graphPadding + graph.box.height) / 2}
                    h ${graphPadding}
                    m ${graph.box.width} ${0}
                    h ${graphPadding}
            `
        path.setAttribute('d', d)


        return {
            g,
            box: g.getBBox(),
            // isCG: true,
        }
    }




    //画多分支的所有branch
    function createBranchesGraph(nodes) {
        //竖向排列
        let subGraphs = nodes.map(createGraph)
        let width = Math.max(...subGraphs.map(it => it.box.width))
        width = nodes.length > 1 ? width + 6 * graphPadding : width // 左右额外3padding绘制path
        let height = subGraphs.map(it => it.box.height).reduce(add) + (subGraphs.length + 1) * graphPadding
        let g = svgElt('g')
        let rect = svgElt('rect', {
            width,
            height,
            fill: 'none', //lightgreen
            rx: graphPadding,
            ry: graphPadding,
        })
        g.append(rect)

        //连接线
        let path = svgElt('path', {
            stroke: 'black',
            'stroke-width': '2',
            fill: 'none'
        })
        g.append(path)
        let d = '' // path路径绘图指令
        let offsetY = graphPadding
        for (let graph of subGraphs) {
            graph.g.style.transform = `translate(${(width - graph.box.width) / 2}px, ${offsetY}px)`;
            d +=
                `
                    M ${0} ${height / 2} 
                    C ${graphPadding * 2} ${height / 2} ${graphPadding * 2} ${offsetY + graph.box.height / 2} ${3 * graphPadding} ${offsetY + graph.box.height / 2} 
                    l ${(width - graph.box.width) / 2 - 3 * graphPadding}  ${0} `
                // path.setAttribute('d', d)
            d +=
                `
                    M ${width} ${height / 2} 
                    C ${width - graphPadding * 2} ${height / 2} ${width - graphPadding * 2} ${offsetY + graph.box.height / 2} ${width - graphPadding * 3} ${offsetY + graph.box.height / 2} 
                    l ${3 * graphPadding - (width - graph.box.width) / 2} ${0} `

            offsetY += graph.box.height + graphPadding
            g.append(graph.g)
        }
        path.setAttribute('d', d)


        return {
            g,
            box: g.getBBox()
        }
    }

    //画单分支的所有elements
    function createBranchGraph(node) {
        let subGraphs = node.elements.map(createGraph)
            //宽度： -元素-元素-
        let width = subGraphs.map(it => it.box.width).reduce(add) + (subGraphs.length + 1) * graphPadding
            //高度： 最大元素高度 + 2*padding
        let height = subGraphs.map(it => it.box.height).reduce((max, height) => Math.max(max, height), -Infinity) + 2 * graphPadding
        let g = svgElt('g')
        let rect = svgElt('rect', {
            width,
            height,
            fill: 'none', //pink
            rx: graphPadding,
            ry: graphPadding
        })
        g.append(rect)

        //间隔线  
        let line = svgElt('path', {
            'stroke-width': '2',
            fill: 'none',
            stroke: 'black' // line-color
        })
        g.append(line)
        let d = '',
            posY = height / 2
            //横向排列每个图形
        let offsetX = graphPadding
        for (let graph of subGraphs) {
            // posY = graph.isCG ? 1.5 * graphPadding + graph.box.height / 2 : height / 2
            graph.g.style.transform = `translate(${offsetX}px, ${(height - graph.box.height) / 2}px)`
            d += `M ${offsetX} ${posY} h -${graphPadding} `
                // line.setAttribute('d', d)
            offsetX += graph.box.width + graphPadding
            g.append(graph.g)
        }
        d += `M ${offsetX} ${posY} h -${graphPadding} Z`

        line.setAttribute('d', d) //多出来的最右侧

        return {
            g,
            box: g.getBBox()
        }
    }

    //画文本
    function createTextGraph(strText) {
        //g > rect + text
        let text = svgElt('text', {
            'font-size': fontSize * .8,
            'dominant-baseline': 'text-before-edge',
            'stroke': 'balck',
        })
        text.textContent = strText
        let textBox = text.getBBox()
        let rect = svgElt('rect', {
            width: textBox.width,
            height: textBox.height,
            fill: 'none', //yellow
        })

        let g = svgElt('g')
        g.append(rect, text)
        return {
            g,
            box: g.getBBox()
        }
    }

    //画量词
    function createQuantifierGraph(node) {

        //explain text
        let str = ''
        if (!Number.isFinite(node.max)) { //  + * 不计入内
            if (node.min > 1) { // {2,}
                str = `at least ${node.min} times`
            }
        } else if (!(node.min == 0 && node.max == 1)) { // ?不计入内
            if (node.min == node.max) { // {2}
                str = `${node.min} times`
            } else if (node.max > node.min) {
                if (node.min == 0) { // {0, 123}
                    str = `at most ${node.max} times`
                } else { // ${2, 123}
                    str = `${node.min}...${node.max} times`
                }
            }
        }

        let text = createTextGraph(str) //最后面加


        let subGraph = createGraph(node.element)
            // * + ?将分类讨论，+:2*radius+subG.width & x*radius + subG.height
        let radius = graphPadding // 1/4圆的半径
        let height = subGraph.box.height + 4 * radius
        let noTextWidth = node.min == 0 || node.greedy ? subGraph.box.width + 4 * radius : subGraph.box.width + 2 * radius //不算文字的图形宽度
        let width = Math.max(noTextWidth, text.box.width)
        let g = svgElt('g')
        let rect = svgElt('rect', {
            width,
            height,
            fill: 'none', //violet
        })
        g.append(rect)

        subGraph.g.style.transform = `translate(${(width - subGraph.box.width) / 2}px, ${(height - subGraph.box.height) / 2}px)`
        g.append(subGraph.g)

        //line
        let line = svgElt('path', {
            'stroke-width': '2',
            stroke: 'black',
            fill: 'none',
        })
        g.append(line)
        let d = ''
        if (node.min == 0) { // ? * 上分支
            d += `M ${noTextWidth == width ? 0 : (width - noTextWidth) / 2} ${height / 2}
                  a ${radius} ${radius} 0 0 0 ${radius} -${radius}
                  V ${radius + 2}
                  a ${radius} ${radius} 0 0 1 ${radius} -${radius}
                  h ${subGraph.box.width} 
                  a ${radius} ${radius} 0 0 1 ${radius} ${radius}
                  V ${height / 2 - radius}
                  a ${radius} ${radius} 0 0 0 ${radius} ${radius} 
            `
            if (!node.greedy) { // b?? b*? 非贪心走上分支
                d += `M ${noTextWidth == width ? radius : (width - noTextWidth) / 2 + radius} ${height / 4}
                      l -${radius / 3} ${radius * 1.73 / 4}
                      M ${ noTextWidth == width ? radius : (width - noTextWidth) / 2 + radius} ${height / 4}
                      l ${radius / 3} ${radius * 1.73 / 4}
                `
            }
        }

        if (node.max > 1) { // + {2,xx}  下分支
            d += `M ${(width - subGraph.box.width) / 2} ${height / 2} 
                  a ${radius} ${radius} 0 0 0 -${radius} ${radius} 
                  V ${node.element.type == 'CaptureGroup' ? height - 3 * radius : height - radius * 5 / 2} 
                  a ${radius} ${radius} 0 0 0 ${radius} ${radius}
                  h ${subGraph.box.width} 
                  a ${radius} ${radius} 0 0 0 ${radius} -${radius}
                  V ${height / 2 + radius}
                  a ${radius} ${radius} 0 0 0 -${radius} -${radius}
            `
            if (node.greedy) { // b* b+
                d += `M ${(width + subGraph.box.width) / 2 + radius - (node.element.type == 'CaptureGroup' ? 0 : 0.5)}  ${node.element.type == 'CaptureGroup' ? height * 3 / 4 - radius : (height + 3 * radius) / 2}
                      l -${radius / 3} -${radius * 1.73 / 4}
                      M ${(width + subGraph.box.width) / 2 + radius - (node.element.type == 'CaptureGroup' ? 0 : 0.5)}  ${node.element.type == 'CaptureGroup' ? height * 3 / 4 - radius : (height + 3 * radius) / 2}
                      l ${radius / 3} -${radius * 1.73 / 4}
                `
            }
        }

        d += `M ${0} ${height / 2}
              h ${(width - subGraph.box.width) / 2}
              m ${subGraph.box.width} ${0}
              h ${(width - subGraph.box.width) / 2}
        `

        line.setAttribute('d', d)


        text.g.style.transform = `translate(${(width - text.box.width) / 2}px, ${height - text.box.height}px)`
        g.append(text.g)

        return {
            g,
            box: g.getBBox()
        }
    }


    //画单字符
    function createCharacterGraph(node) {
        let text = svgElt('text', {
            // y: 10,
            // x: graphPadding,
            'font-size': fontSize, //字体大小
            'text-anchor': 'middle', //水平对齐居中
            'dominant-baseline': 'middle', //垂直对齐居中 控制基线
        })
        text.textContent = node.value
        let textBox = text.getBBox()
        text.setAttribute('x', textBox.width / 2 + graphPadding)
        text.setAttribute('y', textBox.height / 2 + graphPadding)
            // g > (rect + text)
        let g = svgElt('g')
        let rect = svgElt('rect', {
            width: textBox.width + 2 * graphPadding,
            height: textBox.height + 2 * graphPadding,
            fill: '#dae9e5', //青色文字底色
            rx: graphPadding / 4, //圆角
            ry: graphPadding / 4
        })

        g.append(rect, text)
        return {
            g,
            box: g.getBBox()
        }
    }


    //画字符集 待完善[0-9a-zA-Z]
    function createCharacterClassGraph(node) {

        //顶联
        let topText = node.reverse ? ' none of ' : 'one of '
        let text = svgElt('text', {
            'font-size': fontSize * .6,
            // 'text-anchor': 'middle', //水平对齐居中
            'dominant-baseline': 'text-before-edge', //恰好完全显示字 控制基线
        })
        text.textContent = topText
        let textBox = text.getBBox()
        let topG = svgElt('g')
        let topRect = svgElt('rect', {
            width: textBox.width,
            height: textBox.height,
            fill: 'none', //透明文字底色
        })
        topG.append(topRect, text)
        let g = svgElt('g')
        g.append(topG)

        // 字符集
        let subGraphs = node.elements.map(createGraph) // 语法树 -> 图像对象
        let width = Math.max(...subGraphs.map(it => it.box.width)) + 2 * graphPadding
        let height = subGraphs.map(it => it.box.height).reduce(add) + (subGraphs.length + 1) * graphPadding

        let classG = svgElt('g')
        classG.style.transform = `translate(0px, ${textBox.height}px)`
        let rect = svgElt('rect', {
            width,
            height,
            fill: '#CBCBBA', //土黄色底色
            rx: width / 8,
            ry: width / 8
        })
        classG.append(rect)
            // debugger;
        let offsetY = graphPadding
        for (let graph of subGraphs) {
            graph.g.style.transform = `translate(${(width - graph.box.width) / 2}px, ${offsetY}px)`
            offsetY += graph.box.height + graphPadding
            classG.append(graph.g)
        }


        g.append(classG)
        return {
            g,
            box: g.getBBox()
        }
    }


    //绘制工具函数-----------------------------------------------------

    function svgElt(tagName, attrs) {
        let elt = document.createElementNS('http://www.w3.org/2000/svg', tagName)
        for (let k in attrs) {
            elt.setAttribute(k, attrs[k])
        }
        svg.append(elt)
        return elt
    }

    function add(a, b) {
        return a + b
    }

    return createPatternGraph(pattern)


}
/*----------------绘图结束-----------------*/


//测试用例--------------------------------------------------------
// var svg = document.querySelector('svg')
// svg.setAttribute('width', '100%')
// svg.setAttribute('height', '800px')

// debugger
// let str = '(a(a(a)??)+)*(p|d|(?<testname>ccc|ddd|eee|fff))(?!foo)(hufa|((a{2,4}b{0,99}c{1,99}d{3}e{4}f{4,})*)*(?:[^aeiwu]*?)*(cd|ef|(fo[odc]+?)+dd)+c[def]|def|abc)'
// let str = '(a)*b*ef|cd|g(h*i+)'
// let str = '(ab[cqwd]w[^a-z]q|as|sad)'
// let str = '(abc*|d(e)f+|gh)'
// let str = '(a)*b*c+?d{1,3}e{3}f{3,}g{3,3}h{0,123}'
// let str = '(a|b|c|f|g)'
// let i = 0,
//     groupIndex = 1
// let node = parsePattern(str)

// var g = createRegExp(node, Number(padding.value), Number(fontS.value))
// debugger
// g.g.style.transform = `translate( ${(svg.getClientRects().width - g.box.width) / 2}px, ${(svg.getClientRects().height - g.box.height) / 2}px)`


//★★★★★测试完毕



/*----------------------测试结束--------------------*/








/*  事件监听----------------------------------------------  */

//绘制
let contentBox = document.querySelector('.content')
    // let contentBoxWidth = contentBox.getBoundingClientRect().width + 'px'
    // let contentBoxHeight = contentBox.getBoundingClientRect().height + 'px'
let strInput = document.querySelector('textarea')
strInput.defaultValue = '(a(a(a)??)+)*(p|d|(?<testname>ccc|ddd|eee|fff))(?!foo)(rail|((a{2,4}b{0,99}c{1,99}d{3}e{4}f{4,})*)*(?:[^aiueo]*?)*(cd|ef|(fo[odc]+?)+d??d)+c[0-9a-zA-Z]|def|(?<=abc))'

let drawBtn = document.querySelector('.component button:nth-of-type(1)')
drawBtn.addEventListener('click', function(e) {
    // console.log(1);
    // debugger
    let svg = document.querySelector('svg')
    svg.innerHTML = ''
        // svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    try {
        let node = parsePattern(strInput.value)
        var graph = createRegExp(node, Number(padding.value), Number(fontS.value))

        let outSideBox = contentBox.getBoundingClientRect()
            // let outSideBox = window.getComputedStyle(contentBox)
        if (graph.box.width + 20 > outSideBox.width) {
            outSideBox.width = graph.box.width + 20
            contentBox.style.width = (graph.box.width + 20) + 'px'
        } else {
            outSideBox.width = window.innerWidth - 80
            contentBox.style.width = '100%'
        }
        if (graph.box.height + 20 > outSideBox.height) {
            outSideBox.height = graph.box.height + 20
            contentBox.style.height = (graph.box.height + 20) + 'px'
        } else {
            outSideBox.height = 600
            contentBox.style.height = '600px'
        }

        // outSideBox = contentBox.getBoundingClientRect()

        svg.style.transform = `translate(${(outSideBox.width - graph.box.width) / 2}px, ${(outSideBox.height - graph.box.height) / 2}px)`
        svg.setAttribute('width', `${graph.box.width}`)
        svg.setAttribute('height', `${graph.box.height}`)
    } catch (e) {
        strInput.style.color = 'red'
        strInput.value = '请输入语法正确的正则表达式内容！'
        throw e
    }

})

let textPadding = document.querySelector('.leftSetting em:first-of-type i')
let textFontS = document.querySelector('.leftSetting em:last-of-type i')

strInput.addEventListener('focus', function() {
    if (this.style.color == 'red') {
        this.value = ''
        this.style.color = '#333'
    }
})
padding.addEventListener('change', () => {
    textPadding.textContent = padding.value
})

fontS.addEventListener('change', () => {
    textFontS.textContent = fontS.value
})

// 下载
let saveSVG = document.querySelector('#saveSVG'),
    savePNG = document.querySelector('#savePNG')

saveSVG.addEventListener('click', function() {
    let svg = document.querySelector('svg')
    let svgStyle = window.getComputedStyle(svg) //实时更新
    let width = parseFloat(svgStyle.width),
        height = parseFloat(svgStyle.height)

    let svgHead = `<?xml version="1.0" encoding="utf-8"?> <svg version="1.1" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">`
    let svgSrc = svg.innerHTML.slice()
    let svgTail = `</svg>`
        // svg文件头 文件内容 文件尾 拼接创建二进制大对象
    let blob = new Blob([svgHead, svgSrc, svgTail], {
            type: 'image/xml+svg'
        })
        // 生成该svg文件的地址，创建a标签指向该地址并添加download属性，模拟点击a标签以触发下载
    let url = URL.createObjectURL(blob)
    let anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'default.svg' //download控制下载名称
    anchor.click()
    anchor.remove() //移除自身
})

savePNG.addEventListener('click', function() {
    //使用XML序列化对象，将字串转码URI后附到<image>上，用canvas画出image，a标签下载canvas导出的png
    let svg = document.querySelector('svg')
    let serializer = new XMLSerializer()
    let clonedSVG = svg.cloneNode(true)
    clonedSVG.style.transform = ''
        // let clonedSVG = svg.outerHTML.slice()
    let svgBox = svg.getBBox()
    svg.setAttribute('viewBox', `${svgBox.x} ${svgBox.y} ${svgBox.width} ${svgBox.height}`)
    svg.setAttribute('width', svgBox.width)
    svg.setAttribute('height', svgBox.height)

    let src = '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(clonedSVG)
    let image = new Image()
    image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(src)

    let canvas = document.createElement('canvas')
    canvas.width = svgBox.width
    canvas.height = svgBox.height

    let ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff' //背景色
    ctx.fillRect(0, 0, canvas.width, canvas.height)


    image.onload = () => {
        ctx.drawImage(image, 0, 0)
        let a = document.createElement('a')
        a.href = canvas.toDataURL('image/png') //满质量，默认0.92
        a.download = 'default.png'
        a.click()
        a.remove()
    }
})