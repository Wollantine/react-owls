import shortid from 'shortid';
import {listPrefix} from '../storage-consts';

const AddList = (rawAction) => {
	return (dispatch) => {
		rawAction = {
			newId: listPrefix+shortid.generate(),
			...rawAction
		};

		return dispatch(rawAction);
	}
};

export default AddList;
