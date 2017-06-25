import reducer from '../../reducer';
import denormalizeState from './DenormalizeState';
import {createRawAction} from 'redux-action-factory';

describe('Reducer, upon ADD_LIST', () => {
    let finalState;

    before(() => {
    	const action = createRawAction('ADD_LIST', {name: 'newList'});
    	action.newId = 'list-0';

        finalState = reducer(undefined, action);
        finalState = denormalizeState(finalState.present);
    });

    it('Should add a list with the given name and empty pending and archived lists', () => {
        finalState.should.have.property('lists').that.contains({name: 'newList', pending: [], archive: []});
    });
});
