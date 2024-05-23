import {Dispatch} from "redux";
import {GET_TOK_MARKS} from "./constants";



/**
 * Enables/disables the tokmark.
 *
 * @returns {{
 *     type: GET_TOK_MARKS,
 * }}
 * @param data
 */
export function toggleTokMark(data: Array<any>) {
    return(dispatch: Dispatch<any>, getState: Function)=> {
        dispatch({
            type: GET_TOK_MARKS,
            data: data
        });
    };
}
