import { ArrayMethods } from "./arr"

export function observer(data) {
    if(typeof data != 'object' || data == null) {
        return data
    }
    return new Observer(data)
}

class Observer {
    constructor(data) {
        Object.defineProperty(data, "__ob__", {
            enumerable: false,
            value: this
        })
        if(Array.isArray(data)) {
            data.__proto__ = ArrayMethods
            this.observeArray(data)
        } else {
            this.work(data)
        }
    }
    work(data) {
        let keys = Object.keys(data)
        for(let i=0; i<keys.length; i++) {
            let key = keys[i]
            let value = data[key]
            defineReactive(data, key, value)
        }
    }
    observeArray(data) {
        for (let i = 0; i < data.length; i++) {
            observer(data[i])
        }
    }
}

function defineReactive(data, key, value) {
    observer(value)
    Object.defineProperty(data, key, {
        get() {
            return value
        },
        set(newValue) {
            if (newValue == value) return
            observer(newValue)
            value = newValue
        }
    })
}

