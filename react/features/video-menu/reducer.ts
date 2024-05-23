import ReducerRegistry from "../base/redux/ReducerRegistry";
import {PARTICIPANT_TO_MODERATOR} from "./constants";

const INITIAL_STATE = {
    disableState: ""
}

export interface IVideoMenuState {
    disableState?: string
}

/**
 * Listen for actions for the tok-details feature to be used by the actions
 * to update the rendered  tok-details.
 */
ReducerRegistry.register<IVideoMenuState>('features/video-menu',
    (state= INITIAL_STATE, action): IVideoMenuState =>{
        switch (action.type) {
            case PARTICIPANT_TO_MODERATOR:
                return {
                    ...state,
                    disableState: action.data
                };
        }
        return state;
    }
);
