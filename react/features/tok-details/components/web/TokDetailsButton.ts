import React, { Component } from 'react';
import AbstractButton, { IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';

import AbstractTokDetailsButton
    from '../../../base/toolbox/components/AbstractTokDetailsButton';
import {connect} from "react-redux";
import {translate} from "../../../base/i18n/functions";

/**
 * The type of the React {@code Component} props of {@link DownloadButton}.
 */
type Props = AbstractButtonProps & {

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
};

/**
 * Implements an {@link AbstractTokDetailsButton} to open the user documentation in a new window.
 */
    ///This class is used to show the tok details
class TokDetailsButton extends AbstractTokDetailsButton<Props> {
    accessibilityLabel = 'toolbar.accessibilityLabel.tokDetails';
    label = 'toolbar.tokDetails';
    tooltip = 'VoxDetails';

    /**
     * Handles clicking / pressing the button, and opens a new window with the user documentation.
     *
     * @private
     * @returns {void}
     */
    constructor(props: Props) {
        super(props);
    }


    /**
     * Helper function to perform the download action.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _tokDescription() {
    }
}

export default translate(connect()(TokDetailsButton));
