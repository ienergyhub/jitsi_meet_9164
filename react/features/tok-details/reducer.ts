import ReducerRegistry from "../base/redux/ReducerRegistry";
import {GET_TOK_MARKS} from "./constants";

const INITIAL_STATE = {
    _tokMarksData: Array
}

export interface ITokDetailsState {
    _tokMarksData : any
}

/**
 * Listen for actions for the tok-details feature to be used by the actions
 * to update the rendered  tok-details.
 */
ReducerRegistry.register<ITokDetailsState>('features/tok-details',
    (state= INITIAL_STATE, action): ITokDetailsState =>{
        switch (action.type) {
            case GET_TOK_MARKS :
                return {
                    ...state,
                    _tokMarksData : action.data
                };
        }
        return state;
    }
);
