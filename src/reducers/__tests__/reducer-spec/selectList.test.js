import reducer from '../../reducer';
import denormalizeState from './DenormalizeState';
import {createAction, createRawAction} from 'redux-action-factory';

describe('Reducer, upon SELECT_LIST', () => {
    let initialState = null;
    let selectNewListAction = null;

    beforeEach(() => {
        // Create the ADD_LIST action
        let action = createRawAction('ADD_LIST', {name: 'newList'});
        action.newId = 'list-0';

        // Get the initial state
        initialState = reducer(undefined, action);

        // Create the SELECT_LIST action and store it
        selectNewListAction = createAction('SELECT_LIST', {id: action.newId, name: action.name});
    });

    it('Should change the selected list to equal the new one', () => {
        // We select the new list
        let finalState = reducer(initialState, selectNewListAction);
        finalState = denormalizeState(finalState.present);

        finalState.should.have.property('selectedList').that.deep.equals({name: 'newList'});
    });

    it('Should not change the selected list to an unexisting list', () => {
        // We select the new list
        let finalState = reducer(initialState, selectNewListAction);

        // Then we try to select an unexisting list
        finalState = reducer(finalState, createAction('SELECT_LIST', {id: 'unexistingListId', name: 'unexistingListName'}));
        finalState = denormalizeState(finalState.present);

        finalState.should.have.property('selectedList').that.deep.equals({name: 'newList'});
    });
});
