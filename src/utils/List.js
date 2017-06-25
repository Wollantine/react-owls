const withoutItem = (itemToRemove, list) => {
    return list.filter((item) => item !== itemToRemove)
}

const isListEmpty = (list) => list.length === 0

const containsItem = (list, item) => !!~list.indexOf(item)

const appendWhen = (condition, list, item) => (
    condition ? [...list, item] : list
)

const prependWhen = (condition, list, item) => (
    condition ? [item, ...list] : list
)

const trace = (obj) => {
    console.log(obj);
    return obj;
}

// Functor
const List = array => {
    if (array.isList && array.isList()) {
        return List(array.valueOf())
    }
    if (!Array.isArray(array.valueOf())) {
        throw new Error(`Array expected in List(${array})`)
    }
    return {
        map: fn => List(array.map(fn)),
        filter: fn => List(array.filter(fn)),
        reduce: (fn, initialValue) => List(array.reduce(fn, initialValue)),
        sort: fn => List(array.sort(fn)),
        valueOf: () => array.valueOf(),
        indexOf: array.indexOf.bind(array),
        toString: () => `List(${array})`,
        [Symbol.iterator]: () => {
            let nextIndex = 0
            return {
                next: () => (nextIndex < array.length ?
                   {value: array[nextIndex++], done: false} :
                   {done: true}
                )
            }
        },
        constructor: List,
        isList: true,
        without: (item) => List(withoutItem(item, array)),
        isEmpty: () => isListEmpty(array),
        contains: (item) => containsItem(array, item),
        when: (condition) => ({
            append: (item) => List(appendWhen(condition, array, item)),
            prepend: (item) => List(prependWhen(condition, array, item)),
        }),
        trace: () => List(trace(array)),
    }
}

Object.assign(List, {
    toString: () => 'List',
    isList: (obj) => obj.isList || false,
})

export default List;
