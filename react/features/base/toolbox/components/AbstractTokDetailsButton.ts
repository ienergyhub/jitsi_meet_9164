
import type {IProps} from './AbstractButton';
import AbstractButton from './AbstractButton';
import {IconTokDetails} from "../../icons/svg";

/**
 * An abstract implementation of a button for  Tok details.
 */
export default class AbstractTokDetailsButton<P extends IProps, S = any>
    extends AbstractButton<P, S> {

    icon = IconTokDetails;

    /**
     * Handles clicking / pressing the button, and gives the tok details.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {

        this._tokDescription();
    }


    /**
     * Helper function to perform the actual download action.
     *
     * @protected
     * @returns {void}
     */

    _tokDescription() {
        // To be implemented by subclass.
    }
}
