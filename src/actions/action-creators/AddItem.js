import shortid from 'shortid';
import {itemPrefix} from '../storage-consts';

const AddItem = (rawAction) => {
	return (dispatch) => {
		rawAction = {
			newId: itemPrefix+shortid.generate(),
			...rawAction
		};

		return dispatch(rawAction);
	}
};

export default AddItem;
