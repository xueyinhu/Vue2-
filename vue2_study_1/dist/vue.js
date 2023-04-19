(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    function parseHTML(html) {
      while (html) {
        html.indexOf('<');
      }
    }
    function compileToFunction(el) {
      parseHTML(template);
    }

    function _typeof(obj) {
      "@babel/helpers - typeof";

      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
        return typeof obj;
      } : function (obj) {
        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      }, _typeof(obj);
    }
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", {
        writable: false
      });
      return Constructor;
    }
    function _toPrimitive(input, hint) {
      if (typeof input !== "object" || input === null) return input;
      var prim = input[Symbol.toPrimitive];
      if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (typeof res !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return (hint === "string" ? String : Number)(input);
    }
    function _toPropertyKey(arg) {
      var key = _toPrimitive(arg, "string");
      return typeof key === "symbol" ? key : String(key);
    }

    var oldArrayProtoMethods = Array.prototype;
    var ArrayMethods = Object.create(oldArrayProtoMethods);
    var methods = ['push', 'pop', 'unshirt', 'shirt', 'splice'];
    methods.forEach(function (item) {
      ArrayMethods[item] = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        var result = oldArrayProtoMethods[item].apply(this, args);
        var inserted;
        switch (item) {
          case 'push':
          case 'unsshift':
            inserted = args;
            break;
          case 'splice':
            inserted = args.splice(2);
            break;
        }
        var ob = this.__ob__;
        if (inserted) {
          ob.observeArray(inserted);
        }
        return result;
      };
    });

    function observer(data) {
      if (_typeof(data) != 'object' || data == null) {
        return data;
      }
      return new Observer(data);
    }
    var Observer = /*#__PURE__*/function () {
      function Observer(data) {
        _classCallCheck(this, Observer);
        Object.defineProperty(data, "__ob__", {
          enumerable: false,
          value: this
        });
        if (Array.isArray(data)) {
          data.__proto__ = ArrayMethods;
          this.observeArray(data);
        } else {
          this.work(data);
        }
      }
      _createClass(Observer, [{
        key: "work",
        value: function work(data) {
          var keys = Object.keys(data);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = data[key];
            defineReactive(data, key, value);
          }
        }
      }, {
        key: "observeArray",
        value: function observeArray(data) {
          for (var i = 0; i < data.length; i++) {
            observer(data[i]);
          }
        }
      }]);
      return Observer;
    }();
    function defineReactive(data, key, value) {
      observer(value);
      Object.defineProperty(data, key, {
        get: function get() {
          return value;
        },
        set: function set(newValue) {
          if (newValue == value) return;
          observer(newValue);
          value = newValue;
        }
      });
    }

    function initState(vm) {
      var opts = vm.$options;
      if (opts.data) {
        initData(vm);
      }
    }
    function initData(vm) {
      var data = vm.$options.data;
      data = vm._data = typeof data == 'function' ? data.call(vm) : data;
      // 数据代理
      for (var key in data) {
        proxy(vm, '_data', key);
      }
      // 数据劫持
      observer(data);
    }
    function proxy(vm, source, key) {
      Object.defineProperty(vm, key, {
        get: function get() {
          return vm[source][key];
        },
        set: function set(newValue) {
          vm[source][key] = newValue;
        }
      });
    }

    function initMixin(Vue) {
      Vue.prototype._init = function (options) {
        var vm = this;
        vm.$options = options;
        // 初始化状态
        initState(vm);
        // 渲染模板
        if (vm.$options.el) {
          vm.$mount(vm.$options.el);
        }
      };
      Vue.prototype.$mount = function (el) {
        var vm = this;
        var options = vm.$options;
        el = document.querySelector(el);
        if (!options.render) {
          var template = options.template;
          if (!template && el) {
            el = el.outerHTML;
            compileToFunction();
          }
        }
      };
    }

    function Vue(options) {
      // 初始化
      this._init(options);
    }
    initMixin(Vue);

    return Vue;

}));
//# sourceMappingURL=vue.js.map
