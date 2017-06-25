const denormalizeItem = (item) => {
    let denormItem = Object.assign({}, item);
    delete denormItem.id;
    delete denormItem.listId;
    return denormItem;
};

const denormalizeList = (list, allItems) => {
    let denormList = Object.assign({}, list, {
        pending: list.pending.map( (itemId) => (denormalizeItem(allItems[itemId])) ),
        archive: list.archive.map( (itemId) => (denormalizeItem(allItems[itemId])) )
    });
    delete denormList.id;
    return denormList;
};

export default (state) => {
    let denormalizedState = {
        lists: Object.keys(state.lists).map( key => ( denormalizeList(state.lists[key], state.items) ) ),
        selectedList:  Object.assign({}, { name: state.selectedList.name }),
        // Erasing redux-form's 'form' field
    };
    return denormalizedState;
};
