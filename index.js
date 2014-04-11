var VNode = require("virtual-dom/vtree/vnode.js")
var VText = require("virtual-dom/vtree/vtext.js")
var isVNode = require("virtual-dom/vtree/is-vnode")
var isVText = require("virtual-dom/vtree/is-vtext")
var isWidget = require("virtual-dom/vtree/is-widget")

var parseTag = require("./parse-tag.js")
var softSetHook = require("./hooks/soft-set-hook.js")
var dataSetHook = require("./hooks/data-set-hook.js")

module.exports = h

function h(tagName, properties, children) {
    var childNodes = []
    var tag, props

    if (!children) {
        if (isChildren(properties)) {
            children = properties
            props = {}
        }
    }

    props = props || properties || {}
    tag = parseTag(tagName, props)

    if (children) {
        if (Array.isArray(children)) {
            for (var i = 0; i < children.length; i++) {
                addChild(children[i], childNodes)
            }
        } else {
            addChild(children, childNodes)
        }
    }

    // fix cursor bug
    if (tag === "input" && "value" in props) {
        props.value = softSetHook(props.value)
    }

    // add data-set support
    var keys = Object.keys(props)
    for (var j = 0; j < keys.length; j++) {
        var propName = keys[j]
        if (propName.substr(0, 5) === "data-") {
            props[propName] = dataSetHook(props[propName])
        }
    }

    return new VNode(tag, props, childNodes)
}

function addChild(c, childNodes) {
    if (typeof c === "string") {
        childNodes.push(new VText(c))
    } else if (isChild(c)) {
        childNodes.push(c)
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x)
}

function isChildren(x) {
    return typeof x === "string" || Array.isArray(x) || isChild(x)
}
