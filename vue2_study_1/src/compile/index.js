import { parseHTML } from "./parseAst";
import { generate } from "./generate";

export function compileToFunction(el) {
    let ast = parseHTML(el)
    let code = generate(ast)
    let render = new Function(`with(this){return ${code}}`)
}

