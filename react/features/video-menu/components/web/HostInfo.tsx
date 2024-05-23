import React, { PureComponent } from 'react';
// import { openDialog } from '../../../base/dialog';

import { COLORS } from '../../../base/label/constants';
import HostInfoDialog from './HostInfoDialog';
import Tooltip from "../../../base/tooltip/components/Tooltip";
import Label from "../../../base/label/components/web/Label";
import {IconInfoCircle} from "../../../base/icons/svg";
import {openDialog} from "../../../base/dialog/actions";
import {getHideSelfView} from "../../../base/settings/functions.any";
import {connect} from 'react-redux';
import {translate} from "../../../base/i18n/functions";
import {withTranslation, WithTranslation} from "react-i18next";
import {IReduxState} from "../../../app/types";
import i18next from "i18next";
import TFunction = i18next.TFunction;

/**
 * The type of the React {@code Component} props of {@link HideSelfViewVideoButton}.
 */
interface Props extends WithTranslation {

    /**
     * Whether or not to hide the self view.
     */
    disableSelfView: boolean;

    /**
     * The redux dispatch function.
     */
    dispatch: Function;

    /**
     * Button text class name.
     */
    className: string;

    /**
     * Click handler executed aside from the main action.
     */
    onClick?: Function;

    /**
     * Invoked to obtain translated strings.
     */
    t: TFunction;
    participantID: any;
};

/**
 * Implements a React {@link Component} which displays a button for hiding the local video.
 *
 * @augments Component
 */
class HostInfo extends PureComponent<Props> {
    /**
     * Initializes a new {@code HideSelfViewVideoButton} instance.
     *
     * @param {Object} props - The read-only React Component props with which
     * the new instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        // Bind event handlers so they are only bound once for every instance.
        this._onClick = this._onClick.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {null|ReactElement}
     */
    render() {
        const {
            className, t} = this.props;

        return (<Tooltip
            content = { t('videothumbnail.hostInfo') }
            position = { 'bottom' }>
            <Label
                className = { className }
                color = { COLORS.white }
                icon = { IconInfoCircle }
                iconColor = '#fff'
                id = 'hostInfoButton'
                // eslint-disable-next-line react/jsx-no-bind
                onClick = { this._onClick }/>
        </Tooltip>
        );
    }


    /**
     * Hides the local video.
     *
     * @private
     * @returns {void}
     */
    _onClick=()=> {
        const { dispatch, participantID } = this.props;

        dispatch(openDialog(HostInfoDialog, { participantID }));
    }
}

/**
 * Maps (parts of) the Redux state to the associated {@code FlipLocalVideoButton}'s props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state: IReduxState) {
    return {
        disableSelfView: Boolean(getHideSelfView(state))
    };
}


 export default translate(connect(_mapStateToProps)(HostInfo));

