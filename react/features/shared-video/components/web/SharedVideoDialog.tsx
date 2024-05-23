import React from 'react';
import { connect } from 'react-redux';

import { hideDialog } from '../../../base/dialog/actions';
import { translate } from '../../../base/i18n/functions';
import Dialog from '../../../base/ui/components/web/Dialog';
import Input from '../../../base/ui/components/web/Input';
import AbstractSharedVideoDialog from '../AbstractSharedVideoDialog';
import jwt_decode from "jwt-decode";
import { jitsiLocalStorage } from '@jitsi/js-utils';

/**
 * Component that renders the video share dialog.
 *
 * @returns {React$Element<any>}
 */
class SharedVideoDialog extends AbstractSharedVideoDialog<any> {
    type;
    preRecordedUrl;
    /**
     * Instantiates a new component.
     *
     * @inheritdoc
     */
    constructor(props: any) {
        super(props);
        this.type = jwt_decode(APP.store.getState()['features/base/jwt'].jwt);
        this.preRecordedUrl = jitsiLocalStorage.getItem('preRecUrl');

        this.state = {
            value: this.type.type === 'P' ? `${this.preRecordedUrl}` : '',
            okDisabled: true,
            error: false
        };

        this._onChange = this._onChange.bind(this);
        this._onSubmitValue = this._onSubmitValue.bind(this);
    }

    /**
     * Callback for the onChange event of the field.
     *
     * @param {string} value - The static event.
     * @returns {void}
     */
    _onChange(value: string) {
        this.setState({
            value,
            okDisabled: !value
        });
    }

    /**
     * Callback to be invoked when the value of the link input is submitted.
     *
     * @returns {boolean}
     */
    _onSubmitValue() {
        const result = super._onSetVideoLink(this.state.value);

        if (result) {
            this.props.dispatch(hideDialog());
        } else {
            this.setState({
                error: true
            });
        }

        return result;
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        const { t } = this.props;
        const { error } = this.state;
        this.type.type === 'P' ? this._onSubmitValue() : '';

        return (
            <Dialog
                disableAutoHideOnSubmit = { true }
                ok = {{
                    disabled: this.type.type === 'P' ? false : this.state.okDisabled,
                    translationKey: 'dialog.Share'
                }}
                onSubmit = { this._onSubmitValue }
                titleKey = 'dialog.shareVideoTitle'>
                <Input
                    autoFocus = { true }
                    bottomLabel = { error && t('dialog.sharedVideoDialogError') }
                    className = 'dialog-bottom-margin'
                    error = { error }
                    id = 'shared-video-url-input'
                    label = { t('dialog.videoLink') }
                    name = 'sharedVideoUrl'
                    onChange = { this._onChange }
                    placeholder = { t('dialog.sharedVideoLinkPlaceholder') }
                    type = 'text'
                    value = { this.state.value } />
            </Dialog>
        );
    }
}

export default translate(connect()(SharedVideoDialog));
