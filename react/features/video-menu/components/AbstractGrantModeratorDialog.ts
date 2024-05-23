import {Component, useEffect} from 'react';
import {WithTranslation} from 'react-i18next';

import {
    createRemoteVideoMenuButtonEvent
} from '../../analytics/AnalyticsEvents';
import {sendAnalytics} from '../../analytics/functions';
import {IReduxState, IStore} from '../../app/types';
import {grantModerator} from '../../base/participants/actions';
import {getParticipantById} from '../../base/participants/functions';
import {
    getActiveSession,
    getRecordButtonProps
} from "../../recording/functions";
import {JitsiRecordingConstants} from "../../base/lib-jitsi-meet";
import {makeParticipantToModerator} from "../actions.any";

interface IProps extends WithTranslation {

    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];

    /**
     * The ID of the remote participant to be granted moderator rights.
     */
    participantID: string;

    /**
     * The name of the remote participant to be granted moderator rights.
     */
    participantName?: string;

    /**
     * The updated role of the participant.
     */
    updatedRole?: string;
}

/**
 * Abstract dialog to confirm granting moderator to a participant.
 */
export default class AbstractGrantModeratorDialog
    extends Component<IProps> {
    /**
     * Initializes a new {@code AbstractGrantModeratorDialog} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps) {
        super(props);

        this._onSubmit = this._onSubmit.bind(this);
    }

    /**
     * Callback for the confirm button.
     *
     * @private
     * @returns {boolean} - True (to note that the modal should be closed).
     */
    _onSubmit() {
        const {dispatch, participantID} = this.props;
        sendAnalytics(createRemoteVideoMenuButtonEvent(
            'grant.moderator.button',
            {
                'participant_id': participantID
            }));
        dispatch(grantModerator(participantID));
        dispatch(makeParticipantToModerator('moderator'));
        return true;
    }

}

/**
 * Maps (parts of) the Redux state to the associated {@code AbstractMuteEveryoneDialog}'s props.
 *
 * @param {IReduxState} state - The redux state.
 * @param {Object} ownProps - The properties explicitly passed to the component.
 * @returns {IProps}
 */
export function abstractMapStateToProps(state: IReduxState, ownProps: IProps) {
    const {
        disabled: _disabled,
        tooltip: _tooltip,
        visible
    } = getRecordButtonProps(state);
    const state1 = state['features/base/participants'].remote
    let role;
    state1.forEach(value => {
        role = value.role
    })
    return {
        _disabled,
        visible,
        updatedRole: role
    };
}
