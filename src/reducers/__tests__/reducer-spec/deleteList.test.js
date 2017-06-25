import reducer from '../../reducer';
import denormalizeState from './DenormalizeState';
import {createAction, createRawAction} from 'redux-action-factory';

describe('Reducer, upon DELETE_LIST', () => {
    let initialState;
    let existingListId;

    const newListName = 'New List';
    const newListId = 'list-0';

    const addNewList = (initialState) => {
        let addListAction = createRawAction('ADD_LIST', {name: newListName});
        addListAction.newId = newListId;
        return reducer(initialState, addListAction);
    };

    before(() => {
        initialState = reducer(undefined, {});
        existingListId = initialState.present.selectedList.id;
    });

    it('Should empty the last list instead of deleting it', () => {
        // We try to delete the only list in the state
        let finalState = reducer(initialState, createAction('DELETE_LIST', {id: existingListId}));

        // We compute aux state := initial state without items
        const itemId = initialState.present.lists[existingListId].pending[0];
        const delOnlyItemAction = createAction('DELETE_ITEM', {listId: existingListId, id: itemId});
        const auxState = reducer(initialState, delOnlyItemAction);

        // Check the final state is the same as the initial without items
        finalState.present.should.deep.equal(auxState.present);
    });

    it('Should delete an existing list', () => {
        // We add a new list and then delete it
        let finalState = addNewList(initialState);
        finalState = reducer(finalState, createAction('DELETE_LIST', {id: newListId}));

        // Check the state stayed the same
        finalState.present.should.deep.equal(initialState.present);
    });

    it('Should change the selected list if selected was deleted', () => {
        // We add a new list and then select it
        let finalState = addNewList(initialState);
        finalState = reducer(finalState, createAction('SELECT_LIST', {id: newListId, name: newListName}));

        // We delete the new list
        finalState = reducer(finalState, createAction('DELETE_LIST', {id: newListId}));

        // Check the state stayed the same
        finalState.present.should.deep.equal(initialState.present);
    });

});
