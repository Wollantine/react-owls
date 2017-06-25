// Allows to undo just the last action.
// (see http://redux.js.org/docs/recipes/ImplementingUndoHistory.html)
export default function undoable(reducer) {
    // Call the reducer with empty action to populate the initial state
    const initialState = {
        past: [],
        present: reducer(undefined, {})
    };

    // Return a reducer that handles undo and redo
    return function (state = initialState, action) {
        const { past, present } = state;

        switch (action.type) {
            case 'UNDO':
                const previous = past[past.length - 1];
                const newPast = past.slice(0, past.length - 1);
                return {
                    past: newPast,
                    present: previous,
                    future: [ present, ...future ]
                };
            default:
                // Delegate handling the action to the passed reducer
                const newPresent = reducer(present, action);
                if (present === newPresent) {
                    return state
                }
                return {
                    past: [ present ],
                    present: newPresent,
                    future: []
                }
        }
    }
}
