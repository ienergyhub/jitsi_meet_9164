import { createToolbarEvent } from '../../analytics/AnalyticsEvents';
import { sendAnalytics } from '../../analytics/functions';
import { IReduxState } from '../../app/types';
import { MEET_FEATURES } from '../../base/jwt/constants';
import AbstractButton, { IProps as AbstractButtonProps } from '../../base/toolbox/components/AbstractButton';
import { maybeShowPremiumFeatureDialog } from '../../jaas/actions';
import { canStartTranscribing } from '../functions';
import getRoomName from "../../base/config/getRoomName";
import {TOK_PATH} from "../../../constants";
import API from "../../../services";
import {showTranscriptData, toggleRequestingSubtitles} from "../actions.any";

export interface IAbstractProps extends AbstractButtonProps {

    _language: string | null;

    /**
     * Whether the local participant is currently requesting subtitles.
     */
    _requestingSubtitles: boolean;

    /**
     * Selected language for subtitle.
     */
    _subtitles: string;

    languages?: string;

    languagesHead?: string;
    /**
     * It receives the transcript text without name.
     */
    _sendTranscriptText: string,
}


const roomText = getRoomName();
let transcriptText : any;
let tokBytesData : any;
/**
 * The button component which starts/stops the transcription.
 */
export class AbstractClosedCaptionButton
    extends AbstractButton<IAbstractProps> {

    /**
     * Helper function to be implemented by subclasses, which should be used
     * to handle the closed caption button being clicked / pressed.
     *
     * @protected
     * @returns {void}
     */
    _handleClickOpenLanguageSelector() {
        // To be implemented by subclass.
    }

    /**
     * Method to get TokBytes
     */
    getTokBytes= async () => {
        const { dispatch } = this.props;
        transcriptText = this.props._sendTranscriptText.split(":").pop()
        try {
            const body = {
                data: transcriptText,
                roomText: roomText,
                count: 12
            }
            let tokBytes = await API.request('POST', `${TOK_PATH}/transcript`, JSON.stringify(body));
            if (tokBytes.status !== null) {
                if (tokBytes.status === 1 && tokBytes.data !== null) {
                    tokBytesData = tokBytes;
                    dispatch(showTranscriptData(tokBytesData));
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    async _handleClick() {
        const { _requestingSubtitles, dispatch } = this.props;

        sendAnalytics(createToolbarEvent('transcribing.ccButton',
            {
                'requesting_subtitles': Boolean(_requestingSubtitles)
            }));

        const dialogShown = await dispatch(maybeShowPremiumFeatureDialog(MEET_FEATURES.RECORDING));

        if (!dialogShown) {
            await this.getTokBytes();
            // dispatch(toggleRequestingSubtitles());
            this._handleClickOpenLanguageSelector();
        }
    }

    /**
     * Indicates whether this button is disabled or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isDisabled() {
        return false;
    }

    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._requestingSubtitles;
    }
}

/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code AbstractClosedCaptionButton} component.
 *
 * @param {Object} state - The redux state.
 * @param {Object} ownProps - The properties explicitly passed to the component
 * instance.
 * @private
 * @returns {{
 *     _requestingSubtitles: boolean,
 *     _language: string,
 *     visible: boolean
 * }}
 */
export function _abstractMapStateToProps(state: IReduxState, ownProps: IAbstractProps) {
    const { _requestingSubtitles, _language } = state['features/subtitles'];
    const { _sendTranscriptText} = state['features/subtitles']

    // if the participant is moderator, it can enable transcriptions and if
    // transcriptions are already started for the meeting, guests can just show them
    const { visible = canStartTranscribing(state) } = ownProps;

    return {
        _requestingSubtitles,
        _language,
        visible: true,
        _sendTranscriptText: _sendTranscriptText
    };
}
