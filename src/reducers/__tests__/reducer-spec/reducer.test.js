import reducer from '../../reducer.js';
import denormalizeState from './DenormalizeState';

describe('Reducer', () => {
    it('Should return the initial state', () => {
        const initialState = reducer(undefined, {});
        denormalizeState(initialState.present).should.deep.equal({
            lists: [
                {
                    name: 'Shopping List',
                    pending: [{
                        name: 'Swipe me!',
                        done: false
                    }],
                    archive: []
                }
            ],
            selectedList: {name: 'Shopping List'}
        });
    });
});
