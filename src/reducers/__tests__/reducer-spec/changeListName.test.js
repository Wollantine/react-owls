import reducer from '../../reducer';
import denormalizeState from './DenormalizeState';
import {createAction} from 'redux-action-factory';

describe('Reducer, upon CHANGE_LIST_NAME', () => {
    let initialState;
    let existingListId;

    before(() => {
        initialState = reducer(undefined, {});
        existingListId = initialState.present.selectedList.id;
    });

    it('Should change the name of an existing list', () => {
        // We change the name of the list that is currently selected
        const action = createAction('CHANGE_LIST_NAME', {id: existingListId, newName: 'New Test Name'});
        let finalState = reducer(initialState, action);
        finalState = denormalizeState(finalState.present);

        finalState.lists[0].should.have.property('name', 'New Test Name');
    });

    it('Should not change the name of any list if the list ID doesn\'t exist', () => {
        // We change the name of an unexisting list
        const action = createAction('CHANGE_LIST_NAME', {id: 'I do not exist', newName: 'New Test Name'});
        const finalState = reducer(initialState, action);

        // Check the state stayed the same
        finalState.present.should.deep.equal(initialState.present);
    });
});
