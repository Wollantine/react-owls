import reducer from '../../reducer';
import {createAction, createRawAction} from 'redux-action-factory';

describe('Reducer, upon DELETE_ITEM', () => {
    let initialState;
    let existingListId;
    let existingItemId;
    let finalState, action;

    beforeEach(() => {
        initialState = reducer(undefined, {});
        existingListId = initialState.present.selectedList.id;
        existingItemId = initialState.present.lists[existingListId].pending[0];
    });

    it('should delete an existing item', () => {
    	action = createAction('DELETE_ITEM', {listId: existingListId, id: existingItemId});
    	finalState = reducer(initialState, action);

    	finalState.present.items.should.not.have.property(existingItemId);
    });

    it('should be equivalent to as if the item had not been added', () => {
    	// Add a new item and delete it
    	let addItem = createRawAction('ADD_ITEM', {listId: existingListId, name:'a'});
    	addItem.newId = 'item-0';
    	let deleteItem = createAction('DELETE_ITEM', {listId: existingListId, id: addItem.newId});
    	finalState = reducer(reducer(initialState, addItem), deleteItem);

    	finalState.present.should.deep.equal(initialState.present);
    });

    it('should not do anything if the item does not exist', () => {
    	action = createAction('DELETE_ITEM', {listId: existingListId, id: 'non-existing item'});
    	finalState = reducer(initialState, action);

    	finalState.present.should.deep.equal(initialState.present);
    });

    it('should not do anything if the list does not exist', () => {
    	action = createAction('DELETE_ITEM', {listId: 'non-existing list', id: existingItemId});
    	finalState = reducer(initialState, action);

    	finalState.present.should.deep.equal(initialState.present);
    });

    it('should not do anything if the item does not belong to this list', () => {
    	// Add a new list
    	let addList = createRawAction('ADD_LIST', {name: 'A'});
    	addList.newId = 'list-0';
    	let firstState = reducer(initialState, addList);

    	// Locate the new list ID
    	let newListId = Object.keys(firstState.present.lists).find((key) => {
    		return firstState.present.lists[key].name === 'A';
    	});

    	// Delete the item in the other list from the new list
    	action = createAction('DELETE_ITEM', {listId: newListId, id: existingItemId});
    	finalState = reducer(firstState, action);

    	finalState.present.should.deep.equal(firstState.present);
    });

});
