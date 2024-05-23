
import React, {Component, PureComponent} from 'react';
import ContextMenuItem from '../../../base/ui/components/web/ContextMenuItem';
import UserInfoDialog from './UserInfoDialog';
import {IconInfoCircle} from "../../../base/icons/svg";
import {openDialog} from "../../../base/dialog/actions";
import {getHideSelfView} from "../../../base/settings/functions.any";
import { connect } from 'react-redux';
import {IReduxState} from "../../../app/types";
import {translate} from "../../../base/i18n/functions";
import {WithTranslation} from "react-i18next";

/**
 * The type of the React {@code Component} props of {@link }.
 */
interface IProps extends WithTranslation  {

    /**
     * Whether or not to hide the self view.
     */
    disableSelfView: boolean,

    /**
     * The redux dispatch function.
     */
    dispatch: Function,

    /**
     * Button text class name.
     */
    className?: string,

    /**
     * Click handler executed aside from the main action.
     */
    onClick?: Function,
/*
    /!**
     * Invoked to obtain translated strings.
     *!/
    t: Function*/
    /**
     * The ID for the participant on which the button will act.
     */
    participantID?: string;

    key?: string
}

/**
 * Implements a React {@link Component} which displays a button for hiding the local video.
 *
 * @augments Component
 */
class UserInfo extends PureComponent<IProps> {
    /**
     * Initializes a new {@code HideSelfViewVideoButton} instance.
     *
     * @param {Object} props - The read-only React Component props with which
     * the new instance is to be initialized.
     */
    constructor(props: IProps) {
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
            className,
            t
        } = this.props;

        return (
            <ContextMenuItem
                accessibilityLabel = { t('videothumbnail.userInfo') }
                className = '_userInfo'
                id = 'userInfoButton'
                icon = { IconInfoCircle }
                onClick = { this._onClick }
                text = { t('videothumbnail.userInfo') }
                textClassName = { className } />
        );
    }


    /**
     * Hides the local video.
     *
     * @private
     * @returns {void}
     */
    _onClick() {
        const { dispatch, participantID } = this.props;

        dispatch(openDialog(UserInfoDialog, { participantID }));
    }
}

/**
 * Maps (parts of) the Redux state to the associated {@code FlipLocalVideoButton}'s props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state:IReduxState) {
    return {
        disableSelfView: Boolean(getHideSelfView(state))
    };
}

export default translate(connect(_mapStateToProps)(UserInfo));
