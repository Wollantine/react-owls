import reducer, {moveItem} from '../list-reducer';
import {createAction} from 'redux-action-factory';

describe('list-reducer', () => {

    describe('moveItem', () => {
        it('should return an array if the list is empty', () => {
            moveItem([], 5, 1).should.deep.equal([])
        })

        it('should return an array if the list is not empty', () => {
            moveItem(['a', 'b'], 'a', 0).should.deep.equal(['a', 'b'])
        })

        it('should move an item to a new position', () => {
            moveItem(['a', 'b'], 'a', 1).should.deep.equal(['b', 'a'])
        })
    })

    describe('reducer', () => {
        let list = {id: 'test', name: 'Test', pending: [], archive: []}
        let action = createAction('REORDER_ITEM', {listId: 'test', id: '42', newPosition: 0})

        it('should do nothing if the list is empty', () => {
            reducer(list, action).should.deep.equal(list)
        })

        it('should do nothing if there is only one item in the list', () => {
            list.pending = [42]
            reducer(list, action).should.deep.equal(list)
        })
    })

})
