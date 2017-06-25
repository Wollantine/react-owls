import AddList from '../AddList.js';
import {listPrefix} from '../../storage-consts.js';
import sinon from 'sinon';

describe('AddList Action', () => {

	const rawAction = {
		type: 'owls/ADD_LIST',
		name: 'Test'
	};

	it('should return a function', () => {
		AddList(rawAction).should.be.a('function');
	});

	describe('result', () => {

		const thunk = AddList(rawAction);
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

		it('should add the list prefix to the new id', () => {
			thunk(dispatch);
			dispatch.getCall(0).args[0].newId.should.match(new RegExp('^'+listPrefix));
		});

	});

});
