import React from 'react';
import { COLORS } from '../../../base/label/constants';
import { isButtonEnabled } from '../../../toolbox/functions.web';
import NewModal7 from "../../../Modal/components/modal7";
import {openDialog} from "../../../base/dialog/actions";
import {IconTicket} from "../../../base/icons/svg";
import {connect} from "react-redux";
import {translate} from "../../../base/i18n/functions";
import Label from "../../../base/label/components/web/Label";
import Tooltip from "../../../base/tooltip/components/Tooltip";
import {IReduxState, IStore} from '../../../app/types';
import {WithTranslation} from "react-i18next";
import TokMarks from "../../../tok-details/components/web/TokMarks";


interface IProps extends WithTranslation  {

    /**
     * Whether to show the option to invite more people.
     */
    _shouldShow: boolean;

    /**
     * Whether the toolbox is visible.
     */
    _toolboxVisible: boolean;

    /**
     * Handler to open the invite dialog.
     */
    onClick: Function;

    /**
     * Invoked to obtain translated strings.
     */
    dispatch: IStore['dispatch'];
}

/**
 * Represents a replacement for the subject, prompting the
 * sole participant to invite more participants.
 *
 * @param {Object} props - The props of the component.
 * @returns {React$Element<any>}
 */
function GoldenTicket({_shouldShow, _toolboxVisible, t, dispatch}: IProps) {
    const onClick = () => {
        dispatch(openDialog(NewModal7));
    };
    return (
        <div className={`invite-more-container${true ? '' : ' elevated'}`}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start'
            }}>
                <TokMarks/>
                <div className="invite-more-button" style={{padding: 0}}>
                    <Tooltip
                        style={{
                            borderRadius: '40%',
                            margin: '10px'
                        }}
                        content="Ticket"
                        position={'bottom'}>
                        <Label
                            color={COLORS.white}
                            icon={IconTicket}
                            iconColor="#fff"
                            id="Ticket"
                            // eslint-disable-next-line react/jsx-no-bind
                            onClick={onClick}/>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}

/**
 * Maps (parts of) the Redux state to the associated
 * {@code Subject}'s props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {Props}
 */
function mapStateToProps(state: IReduxState) {
    // const participantCount = getParticipantCount(state);
    // const isAlone = participantCount === 1;
    // const hide = interfaceConfig.HIDE_INVITE_MORE_HEADER;

    return {
        _shouldShow: isButtonEnabled('invite', state)
        // _toolboxVisible: isToolboxVisible(state)
    };
}

/**
 * Maps dispatching of some action to React component props.
 *
 * @param {Function} dispatch - Redux action dispatcher.
 * @returns {Props}
 */

export default translate(connect(mapStateToProps)(GoldenTicket));
