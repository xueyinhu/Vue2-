import { compileToFunction } from "./compile/index"
import { initState } from "./initState"

export function initMixin(Vue) {
    Vue.prototype._init = function(options) {
        let vm  = this
        vm.$options = options
        // 初始化状态
        initState(vm)
        // 渲染模板
        if(vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }

    Vue.prototype.$mount = function(el) {
        let vm = this
        let options = vm.$options
        el = document.querySelector(el)
        if(!options.render) {
            let template = options.template
            if (!template && el) {
                el = el.outerHTML
                let ast = compileToFunction(el)
            }
        }
    }
}

