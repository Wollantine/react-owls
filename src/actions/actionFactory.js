import {initialize} from 'redux-action-factory';
import actions from './actions.json';
import * as actionCreators from 'glob:./action-creators/*.js';
 
initialize({
    actions,
    actionCreators
});