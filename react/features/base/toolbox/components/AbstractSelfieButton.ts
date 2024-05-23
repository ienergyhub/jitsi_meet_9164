
import type {IProps} from './AbstractButton';
import AbstractButton from './AbstractButton';
import {IconCapture, IconInsta, IconRecorder} from "../../icons/svg";
import jwt_decode from "jwt-decode";


interface jwtPayload {
    selfie: string;
    celebrity: string
}

/**
 * An abstract implementation of a button for  downloading a selfie.
 */
export default class AbstractSelfieButton<P extends IProps, S=any>
        extends AbstractButton<P, S> {
    jwt = APP.store.getState()['features/base/jwt'];
    decodeJwt: jwtPayload = jwt_decode(this.jwt.jwt);
    icon = (this.decodeJwt.selfie === 'A' || this.decodeJwt.selfie === 'V') ? IconRecorder : IconCapture;

    /**
     * Handles clicking / pressing the button, and downloading a selfie.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
        this._downloadSelfie();
        this._downloadAudioRecorder();
        this._downloadVideoRecorder();
    }

    /**
     * Helper function to perform the actual download action.
     *
     * @protected
     * @returns {void}
     */
    _downloadSelfie() {
        // To be implemented by subclass.
    }

    /**
     * Helper function to perform the actual download action.
     *
     * @protected
     * @returns {void}
     */
    _downloadAudioRecorder() {
        // To be implemented by subclass.
    }

    /**
     * Helper function to perform the actual download action.
     *
     * @protected
     * @returns {void}
     */
    _downloadVideoRecorder() {
        // To be implemented by subclass.
    }
}
