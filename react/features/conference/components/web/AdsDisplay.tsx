
import React, {CSSProperties, useEffect, useState} from 'react';
import { TOK_PATH } from '../../../../constants';
import {
    isButtonEnabled,
    isToolboxEnabled, isToolboxVisible
} from '../../../toolbox/functions.web';
import { getConferenceName } from '../../../base/conference/functions';
import { isMobileBrowser } from '../../../base/environment/utils';
import './Connect.css';
import {translate} from "../../../base/i18n/functions";
import {connect} from "react-redux";
import {MEETING_NAME_ENABLED} from "../../../base/flags/constants";
import {getFeatureFlag} from "../../../base/flags/functions";
import {
    IProps as AbstractProps
} from "../../../recording/components/Recording/AbstractHighlightButton";
import {IStore} from "../../../app/types";
import {WithTranslation} from "react-i18next";
import API from '../../../../services'



interface IProps extends WithTranslation {

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
    /**
     * Name of the meeting we're currently in.
     */
    _meetingName: string;
    /**
     * Whether displaying the current meeting name is enabled or not.
     */
    _meetingNameEnabled: boolean;
    /**
     * True if the navigation bar should be visible.
     */
    _visible: boolean;
    /**
     * Display  translated strings..
     */
    _sendTranscriptBite: string;
}

/**
 * Represents a replacement for the subject, prompting the
 * sole participant to invite more participants.
 *
 * @param {Object} props - The props of the component.
 * @returns {React$Element<any>}
 */

const listOfAds: any = [];

const AdsDisplay = (props: IProps) => {
    // const {onClick, _visible}= props;
    const [timer, setTimer] = useState(0);
    const [adsList, setAdsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(true);

    const meetingName : string = props._meetingName.trim();
    useEffect(() => {
        let cancel = false;
        (async () => {
            setLoading(true);
            const res = {
                roomName: meetingName
            };
            let webAdsData = await API.request('GET', `${TOK_PATH}/iconAds`, res, false);
            if (cancel) {
                return;
            }
            if (webAdsData.status === 1) {
                for (let i = 0; i < webAdsData.data.length; i++) {
                    listOfAds.push(webAdsData.data[i]);
                }
                setAdsList(listOfAds);
                setLoading(false);
            }
        })();
        return () => {
            cancel = true;
        };
    }, [ adsList ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setVisible(true)
            }, 3000)
        }, 18000)
        return () => clearInterval(interval)
    }, [])

    setTimeout(() => {
        setTimer(timer + 1 > adsList.length - 1 ? 0 : timer + 1);
    }, 18000);

    const containerStyle: CSSProperties = {
        transform: visible ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.5s cubic-bezier(0.5, 0.05, 0.1, 0.95)',
        position: 'relative',
        right: visible ? 'auto' : '100%',
        left: visible ? 0 : 'auto',
        marginLeft: 0
    };

    return (
        <div style={{display: 'flex'}}>
            <div style={{position: 'relative'}}>
                <div style={containerStyle}
                     className={`invite-more-container${true ? '' : ' elevated'}`}>
                    {adsList && adsList.map((value: any, index) => {
                        return (
                            <div key={index}>
                                {visible && timer === index ?
                                    <div className="displayBox">
                                        <div className='alignment'>
                                            <div className='divPadding'>
                                                <img className='showImg'
                                                     src={value?.iconUrl}/>
                                            </div>
                                            <div className='divPadding'>
                                                <h5 className='hTag'>{value.title}</h5>
                                            </div>
                                            <div className='divPadding'>
                                                <button onClick={() => {
                                                    if (isMobileBrowser()) {
                                                        if (window.flutter_inappwebview) {
                                                            const args = `${value.url}`;
                                                            window.flutter_inappwebview.callHandler('myHandlerName', args);
                                                        } else {
                                                            console.log('InAppWebViewNotLoaded');
                                                        }
                                                    } else {
                                                        window.open(value.url);
                                                    }

                                                }} className="shop">Shop now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    : null}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


/**
 * Maps (parts of) the Redux state to the associated
 * {@code Subject}'s props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {Props}
 */
function mapStateToProps(state: any) {
    // const participantCount = getParticipantCount(state);
    // const isAlone = participantCount === 1;
    // const hide = interfaceConfig.HIDE_INVITE_MORE_HEADER;
    const { _sendTranscriptBite } = state['features/subtitles'];

    return {
        _shouldShow: isButtonEnabled('invite', state),
        _toolboxVisible: isToolboxEnabled(state),
        _meetingName: getConferenceName(state),
        _meetingNameEnabled:
            getFeatureFlag(state, MEETING_NAME_ENABLED, true),
        _visible: isToolboxVisible(state),
        _sendTranscriptBite: _sendTranscriptBite,
        onClick: Function
    };
}

/**
 * Maps dispatching of some action to React component props.
 *
 * @param {Function} dispatch - Redux action dispatcher.
 * @returns {Props}
 */

export default translate(connect(mapStateToProps)(AdsDisplay));
