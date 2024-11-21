import { jitsiLocalStorage } from '@jitsi/js-utils';
import React, {Component} from 'react';
import type { Dispatch } from 'redux';
import { getConferenceTimestamp } from '../../../base/conference/functions';
import  getRoomName  from '../../../base/config/getRoomName';
import { getLocalizedDurationFormatter } from '../../../base/i18n/dateUtil';
import { translate } from '../../../base/i18n/functions';
import { IconBookmark, IconInfoCircle } from '../../../base/icons/svg';
import { COLORS } from '../../../base/label/constants';
import { connect } from 'react-redux';
import type {IProps as AbstractButtonProps } from '../../../base/toolbox/components/AbstractButton';
import {
    NOTIFICATION_TIMEOUT_TYPE,
    NOTIFICATION_TYPE,
    SALESFORCE_LINK_NOTIFICATION_ID,
} from '../../../notifications/constants';
import {
    sendTranscriptText,
    toggleRequestingSubtitles
} from '../../../subtitles/actions.any';
import type {
    IAbstractCaptionsProps
} from '../../../subtitles/components/AbstractCaptions';
import {
    AbstractCaptions
} from '../../../subtitles/components/AbstractCaptions';
import {toggleTokMark} from '../../actions';
import { TOK_PATH } from '../../../../constants';
import Label from "../../../base/label/components/web/Label";
import Tooltip from "../../../base/tooltip/components/Tooltip";
import {showNotification} from "../../../notifications/actions";
import {IReduxState, IStore} from "../../../app/types";
import API from '../../../../services'

export type Props = AbstractButtonProps & {

    /**
     * Invoked to obtain translated strings.
     */
    t: Function;

    /**
     * The URL of the conference.
     */
    url?: string;

    /**
     * Value of current conference time.
     */
    timerValue?: string;
    /**
     * The UTC timestamp representing the time when first participant joined.
     */
    _startTimestamp?: number | undefined;
    /**
     * Whether the subtitles container is lifted above the invite box.
     */
    _isLifted?: boolean;
    /**
     * The redux {@code dispatch} function.
     */
    dispatch?: IStore['dispatch'];


    _transcript?: Map<string, string>;

    /**
     * It receives the transcript text without name.
     */
    // _sendTranscriptText?: string;
    _sendTranscriptText?: string | undefined;
    className?: any;

};

type State = {
    isDisabled: boolean;
    productData?: any;
};

let tokMarkStartTime: string;
let tokMarkEndTime: any;
const roomName = getRoomName();
const tokId = jitsiLocalStorage.getItem('tokId');
let transcriptText : any;


class TokMarks extends Component<Props, State>  {
    constructor(props : Props) {
        super(props);
        this.state = {
            isDisabled : false,
        }
        this.notifyUser = this.notifyUser.bind(this);
        this.onClick = this.onClick.bind(this);
    }


    /**
     * This method is used to add two time strings
     * @param times
     * @returns {string}
     */
    addTimes(times = [tokMarkStartTime, '00:45']) {
        const z = (n: any) => (n < 10 ? '0' : '') + n;
        let minute = 0
        let second = 0
        for (const time of times) {
            const splited = time.split(':');
            minute += parseInt(splited[0])
            second += parseInt(splited[1])
        }
        const seconds = second % 60
        const minutes = parseInt(String(minute % 60)) + parseInt(String(second / 60))
        return z(minutes) + ':' + z(seconds)
    };


    /**
     * This method is used to get tok details data
     * @returns {Promise<void>}
     */
    getTokDetails = async () => {
        try {
            const body = {
                endTime: tokMarkEndTime.replace(" ", ""),
                roomText: roomName,
                startTime: tokMarkStartTime.replace(" ",""),
                tokId: tokId,
            }
            let manifest = await API.request('POST', `${TOK_PATH}/marks`, JSON.stringify(body))
            if(manifest.status !== null){
                if(manifest.status === 1){
                    if(manifest.data != null){
                        let productData = manifest.data;
                            this.setState({productData})
                            this.props.dispatch(toggleTokMark(productData))
                    }
                }
            }
        }
        catch (e) {
            console.log(e)
        }
    }

    /**
     * Timeout functionality
     */
    handleSubmitClicked =()=>{
        this.setState({
            isDisabled: true
        })
        setTimeout( ()=>{
            this.enableComponent()
        }, 20000);
    }

    /**
     * This metod is used to end the end tok mark
     */
     enableComponent=()=>{
        this.setState({
            isDisabled: false
        })
        // transcriptText = this.props._sendTranscriptText
        setTimeout(()=>{
            this.getTokDetails();
        }, 2000)
        // this.props.dispatch(toggleRequestingSubtitles());
        // this._handleClickOpenLanguageSelector();
        this.props.dispatch(showNotification({
            titleKey: 'Vox mark has been ended',
            uid: SALESFORCE_LINK_NOTIFICATION_ID,
            appearance: NOTIFICATION_TYPE.NORMAL
        }, NOTIFICATION_TIMEOUT_TYPE.SHORT));
        // this.props.dispatch(sendTranscriptText(''));
    }


    /**
     * This method is used to notify the user as Vox mark has been started.
     */
    notifyUser() {
        // this.props.dispatch(toggleRequestingSubtitles());
        if(this.props._startTimestamp !== undefined){
            tokMarkStartTime = getLocalizedDurationFormatter(new Date().getTime() - this.props._startTimestamp);
        }
        tokMarkEndTime =  this.addTimes();
            this.props.dispatch(showNotification({
                titleKey: 'Vox mark has been started',
                uid: SALESFORCE_LINK_NOTIFICATION_ID,
                appearance: NOTIFICATION_TYPE.NORMAL
            }, NOTIFICATION_TIMEOUT_TYPE.SHORT));
    }
    onClick=()=>{
        if(!this.state.isDisabled){
            this.notifyUser();
            this.handleSubmitClicked();
        }
    }


    render() {
        const {
            className,
            t
        } = this.props;

        return (
            <div className={`invite-more-button`} style={{padding: 0}}>
                    <Tooltip
                        style={{
                            borderRadius: '40%',
                            margin: '10px'
                        }}
                        content = 'Bookmark'
                        position = { 'bottom' }>
                        <Label
                            className = { className }
                            color = { COLORS.white }
                            icon = { IconBookmark }
                            iconColor = '#fff'
                            id = 'Bookmark'
                            // eslint-disable-next-line react/jsx-no-bind
                            onClick = { this.onClick }/>
                    </Tooltip>
            </div>
        );
    }
}


function _mapStateToProps(state: IReduxState) {
    const {_sendTranscriptText} = state['features/subtitles'];
    return {
        _startTimestamp: getConferenceTimestamp(state),
        _sendTranscriptText: _sendTranscriptText
    };
}

export default translate(connect(_mapStateToProps)(TokMarks));


