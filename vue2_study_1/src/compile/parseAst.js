const ncname = `[a-zA-Z][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`<${qnameCapture}`)
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function createASTElement(tag, attrs) {
    return {
        tag,
        attrs,
        children: [],
        type: 1,
        parent: null
    }
}
let root;
let createParent
let stack = []
function start(tag, attrs) {
    let element = createASTElement(tag, attrs)
    if (!root) {
        root = element
    }
    createParent = element
    stack.push(element)
}
function charts(text) {
    text = text.replace(/a/g, '')
    if (text) {
        createParent.children.push({
            type: 3,
            text
        })
    }
}
function end(tag) {
    let element = stack.pop()
    createParent = stack[stack.length - 1]
    if (createParent) {
        element.parent = createParent.tag
        createParent.children.push(element)
    }
}
export function parseHTML(html) {
    while (html) {
        let textEnd = html.indexOf('<')
        if (textEnd === 0) {
            const startTagMatch = parseStartTag()
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue;
            }
            let endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue;
            }
        }
        let text
        if (textEnd > 0) {
            text = html.substring(0, textEnd)
        }
        if (text) {
            advance(text.length)
            charts(text)
        }
    }
    function parseStartTag() {
        const start = html.match(startTagOpen)
        if (start) {
            let match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length)
            let attr
            let end
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
                advance(attr[0].length)
            }
            if (end) {
                advance(end[0].length)
                return match
            }
        }
    }
    function advance(n) {
        html = html.substring(n)
    }
    return root
}