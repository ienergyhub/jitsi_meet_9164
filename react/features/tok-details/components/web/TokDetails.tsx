/* eslint-disable lines-around-comment */
import React, {Component, useEffect, useRef, useState} from 'react';

import {BottomSheet} from 'react-spring-bottom-sheet';
import Collapsible from 'react-collapsible';
import 'react-spring-bottom-sheet/dist/style.css';

// @ts-ignore
import {isMobileBrowser} from '../../../base/environment/utils';
import './TokDetails.css';
// @ts-ignore
import {getRoomName} from "../../../base/config";
import {connect} from 'react-redux';
import {
    IconLink,
    IconSlowMotion,
    IconUpDownArrow
} from "../../../base/icons/svg";
import {IReduxState} from "../../../app/types";
import TokDetailsButton from './TokDetailsButton'

interface Props {
    /**
     * Display  translated strings..
     */
    _sendTranscriptMessage?: any,
    /**
     * Display  translated count..
     */
    _sendTranscriptCount?: Array<string>,
    /**
     * The participant's current display name which should be shown.
     */
    _nameToDisplay?: string,
    /**
     * Display  translated details
     */
    _tokMarksData?: {
        tokMarks: Product[];
    };
}

interface TokMark {
    status: string;
    message: string;
    data: Product[];
}

interface Product {
    roomText: string;
    startTime: string;
    endTime: string;
    tokId: number;
    text: string;
    userId: number;
}


const TokDetails: React.FC<Props> = (props) => {
    const [open, setOpen] = useState(false);
    const focusOPenRef = useRef<HTMLDivElement>(null);
    const tokBytesTranscriptData = props._sendTranscriptMessage;
    const tokMarkDetails = props._tokMarksData;
    useEffect(() => {
    }, [tokMarkDetails]);

    const tokBytesTrigger = () => {
        return (
            <div className="BottomCollapse">
                <div className="collapseTitle"><p className="collapseP">Vox
                    Bytes</p>
                    <div className="collapseIcon"><IconUpDownArrow/></div>
                </div>
            </div>
        );
    };
    const tokShopTrigger = () => {
        return (
            <div className="BottomCollapse">
                <div className="collapseTitle"><p className="collapseP">Vox
                    Shop</p>
                    <div className="collapseIcon"><IconUpDownArrow/></div>
                </div>
            </div>
        );
    };

    function tokMarkTrigger() {
        return (
            <div className="BottomCollapse">
                <div className="collapseTitle"><p className="collapseP">Vox
                    Marks</p>
                    <div className="collapseIcon"><IconUpDownArrow/></div>
                </div>
            </div>
        );
    }

    function trigger(roomText: string, startTime: string, endTime: string, tokId: number, text: string, userId: number) {
        return (
            <div className="collapseHeader">
                <div className="transcriptHead">
                    <div className="iconUrl">
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            width: '30%'
                        }}>
                            <IconSlowMotion
                                width={'20px'}
                                height={'20px'}/>
                            <p className="tokMarkP">{roomText}</p>
                        </div>
                        <p style={{width: '30%'}}>Start time : {startTime}</p>
                        <p style={{width: '30%'}}>End time : {endTime}</p>
                        {/*<p style={{
                            width: '30%',
                            textDecoration: 'underline',
                            color: 'blue'
                        }}>{productData.length > 0 ? "Show products" : ''}</p>*/}
                    </div>
                </div>
            </div>
        );
    }

    useEffect(() => {
        // Setting focus is to aid keyboard and screen reader nav when activating this iframe
        focusOPenRef.current!.focus();
    }, []);


    return (
        <>
            <span onClick={() => setOpen(true)}
                  ref={focusOPenRef}>
                <TokDetailsButton/>
            </span>
            <BottomSheet
                open={open}
                header={
                    <button className="headerButton"
                            onClick={() => setOpen(false)}>
                        Close
                    </button>
                }
                snapPoints={({maxHeight}) => [maxHeight / 2, maxHeight * 0.6]}
            >
                <div style={{
                    padding: '4px 16px 4px 16px'
                }}>
                    <Collapsible trigger={tokBytesTrigger()}>
                        <div className="collapseHeader">
                            <div className="transcriptHead">
                                {
                                    tokBytesTranscriptData?.data?.length && tokBytesTranscriptData?.data?.map((value: any, index: any) => (
                                        <div className="transcriptBody" key={index}>
                                            <p>{value.bite}</p>
                                            <p>{value.count}</p>
                                        </div>))}
                            </div>
                        </div>
                    </Collapsible>
                    <div style={{marginTop: '10px'}}></div>
                    <Collapsible trigger={tokShopTrigger()} open={true}>
                        <div className="collapseHeader">
                            <div className="transcriptHead" onClick={() => {
                                if (isMobileBrowser()) {
                                    if (window.flutter_inappwebview) {
                                        const args = 'https://custommeet4.centralus.cloudapp.azure.com/#/productDetailsPage/105088';
                                        window.flutter_inappwebview.callHandler('handleTokUrls', args);
                                    } else {
                                        console.log('InAppWebViewNotLoaded');
                                    }
                                } else {
                                    window.open('https://custommeet4.centralus.cloudapp.azure.com/#/productDetailsPage/105101');
                                }

                            }}>
                                <div className="iconUrl">
                                    <IconLink width={'20px'} height={'20px'}/>
                                    <p>Product</p>
                                </div>
                                <div className="iconUrl">
                                    <IconLink width={'20px'} height={'20px'}/>
                                    <p>Product1</p>
                                </div>
                            </div>
                        </div>
                    </Collapsible>
                    <div style={{marginTop: '10px'}}></div>
                    <Collapsible trigger={tokMarkTrigger()} open={true}>
                        <div className="collapseHeader">
                            {tokMarkDetails?.tokMarks?.map((value: any, index: number) => {
                                return (
                                    <Collapsible key={index}
                                                 trigger={trigger(value.roomText, value.startTime, value.endTime, value.tokId, value.text, value.userId)}>
                                    </Collapsible>
                                );
                            })}
                        </div>
                    </Collapsible>
                </div>
            </BottomSheet>
        </>
    )
        ;
};

/**
 * Maps (parts of) the redux state to the associated {@code }'s
 * props.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {Object}
 */

function mapStateToProps(state: IReduxState) {
    const {_sendTranscriptMessage} = state['features/subtitles'];
    const {_sendTranscriptCount} = state['features/subtitles'];
    const {_tokMarksData} = state['features/tok-details'];
    return {
        _sendTranscriptMessage: _sendTranscriptMessage,
        _sendTranscriptCount: _sendTranscriptCount,
        _tokMarksData: _tokMarksData,
    }

}

export default connect(mapStateToProps)(TokDetails)


