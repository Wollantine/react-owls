import reducer from '../../reducer';
import {createAction} from 'redux-action-factory';

describe('Reducer, upon CHANGE_ITEM_STATUS', () => {
    let initialState;
    let existingItemId;
    let existingListId;

    before(() => {
        initialState = reducer(undefined, {});
        existingListId = initialState.present.selectedList.id;
        existingItemId = initialState.present.lists[existingListId].pending[0];
    });

    describe('for an existing item', () => {

    	it('should set done to true', () => {
    		const action = createAction('CHANGE_ITEM_STATUS', {id: existingItemId, done: true});
    		const finalState = reducer(initialState, action);
    		finalState.present.items[existingItemId].done.should.equal(true);
    	});

    	it('should set done to false', () => {
    		const action = createAction('CHANGE_ITEM_STATUS', {id: existingItemId, done: false});
    		const finalState = reducer(initialState, action);
    		finalState.present.items[existingItemId].done.should.equal(false);
    	});

    });

    it('should do nothing when the item does not exist', () => {
		const action1 = createAction('CHANGE_ITEM_STATUS', {id: 'non existing item', done: true});
		const action2 = createAction('CHANGE_ITEM_STATUS', {id: 'non existing item', done: false});
		const finalState1 = reducer(initialState, action1);
		const finalState2 = reducer(initialState, action2);

		finalState1.present.should.deep.equal(initialState.present);
		finalState2.present.should.deep.equal(initialState.present);
    });

});
