import AddItem from '../AddItem.js';
import {itemPrefix} from '../../storage-consts.js';
import sinon from 'sinon';

describe('AddItem Action', () => {

	const rawAction = {
		type: 'owls/ADD_ITEM',
		listId: '0000',
		name: 'Test'
	};

	it('should return a function', () => {
		AddItem(rawAction).should.be.a('function');
	});

	describe('result', () => {

		const thunk = AddItem(rawAction);
		const dispatch = sinon.spy();

		afterEach(() => {
			dispatch.reset();
		});

		it('should be a thunk', () => {
			thunk(dispatch);
			dispatch.should.have.been.called;
		});

		it('should dispatch the rawAction', () => {
			thunk(dispatch);
			dispatch.should.have.been.calledWithMatch(rawAction);
		});

		it('should add a new id to the action', () => {
			thunk(dispatch);
			dispatch.getCall(0).args[0].should.have.a.property('newId');
		});

		it('should add the item prefix to the new id', () => {
			thunk(dispatch);
			dispatch.getCall(0).args[0].newId.should.match(new RegExp('^'+itemPrefix));
		});

	});

});
