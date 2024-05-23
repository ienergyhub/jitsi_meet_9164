import {
    isIosMobileBrowser,
    isMobileBrowser
} from '../../../base/environment/utils';
import AbstractSelfieButton
    from "../../../base/toolbox/components/AbstractSelfieButton";
import {showNotification} from "../../../notifications/actions";
import {
    NOTIFICATION_TIMEOUT_TYPE,
    NOTIFICATION_TYPE,
    SALESFORCE_LINK_NOTIFICATION_ID
} from "../../../notifications/constants";
import {translate} from "../../../base/i18n/functions";
import {isLocalTrackMuted} from "../../../base/tracks/functions.any";
import {isVideoMuteButtonDisabled} from "../../functions.web";
import {MEDIA_TYPE} from "../../../base/media/constants";
import {getFeatureFlag} from "../../../base/flags/functions";
import {VIDEO_MUTE_BUTTON_ENABLED} from "../../../base/flags/constants";
import {IReduxState, IStore} from "../../../app/types";
import {Styles} from "../../../base/toolbox/components/AbstractToolboxItem";
import {WithTranslation} from "react-i18next";
import {connect} from 'react-redux';
import jwt_decode from "jwt-decode";


/**
 * The type of the React {@code Component} props of {@link DownloadButton}.
 */
export interface IProps extends WithTranslation {
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];

    /**
     * Whether video is currently muted or not.
     */
    _videoMuted: boolean;

    /**
     * Whether video is currently muted or not.
     */
    _audioMuted: boolean;

    /**
     * Function to be called after the click handler has been processed.
     // */
    afterClick?: Function;

    /**
     * The button's key.
     */
    buttonKey?: string;

    /**
     * Whether or not the button is displayed in a context menu.
     */
    contextMenu?: boolean;

    /**
     * An extra class name to be added at the end of the element's class name
     * in order to enable custom styling.
     */
    customClass?: string;

    /**
     * Extra styles which will be applied in conjunction with `styles` or
     * `toggledStyles` when the button is disabled;.
     */
    disabledStyles?: Styles;


    /**
     * External handler for click action.
     */
    handleClick?: Function;

    /**
     * Notify mode for `toolbarButtonClicked` event -
     * whether to only notify or to also prevent button click routine.
     */
    notifyMode?: string;

    /**
     * Whether to show the label or not.
     */
    showLabel?: boolean;

    /**
     * Collection of styles for the button.
     */
    styles?: Styles;

    /**
     * Collection of styles for the button, when in toggled state.
     */
    toggledStyles?: Styles;

    /**
     * From which direction the tooltip should appear, relative to the button.
     */
    tooltipPosition?: string;
}

interface jwtPayload {
    selfie: string;
    celebrity: string
}

/**
 * Implements an {@link AbstractSelfieButton} to open the user documentation in a new window.
 */


    ///This class is used download Video Recorder
class DownloadVideoAudioAndSelfie extends AbstractSelfieButton<IProps> {
    label = 'toolbar.selfie';
    jwt = APP.store.getState()['features/base/jwt'];
    decodeJwt: jwtPayload = jwt_decode(this.jwt.jwt);
    accessibilityLabel = (this.decodeJwt.selfie === 'N' || this.decodeJwt.celebrity === 'Y') ? 'toolbar.accessibilityLabel.selfie' : 'toolbar.accessibilityLabel.rec';
    tooltip = this.decodeJwt.selfie === "V" ? 'Video Recorder' : this.decodeJwt.selfie === "A" ? "Audio Recorder" : this.decodeJwt.selfie === "P" ? "Selfie" : "";
    boolRecording: boolean;
    canvas: any;
    audioMediaRecorder: any;
    videoMediaRecorder: any;
    recordedChunks: any;
    audioChunks: any;
    intervalRecord: any;
    link: any;
    participantVideo: any;


    /**
     * Handles clicking / pressing the button, and opens a new window with the user documentation.
     *
     * @private
     * @returns {void}
     */


    constructor(props: IProps) {
        super(props);
        this.handleVideoAudioAndPictureDownload = this.handleVideoAudioAndPictureDownload.bind(this);
        this.boolRecording = false;
        this.recordedChunks = [];
        this.audioChunks = [];
        this.participantVideo = null;
    }

    /**
     * It used to get Mimetype.
     */
    getMimeType() {
        return isIosMobileBrowser() ? 'mp4' : this.decodeJwt.selfie == 'V' ? this.getMimeTypeForVideoWeb() : this.decodeJwt.selfie === 'A' ? this.getMimeTypeForAudioWeb() : '';
    }

    /**
     * It used to get video Mimetype for the web.
     */
    getMimeTypeForVideoWeb() {
        let userAgent = window.navigator.userAgent;
        let winNav = window.navigator;
        let vendorName = winNav.vendor;
        let isIOSChrome = userAgent.match('CriOS');

        if (isIOSChrome) {
            // is Google Chrome on iOS
            return 'webm';
        } else if (
            userAgent.includes('Chrome') &&
            vendorName === 'Google Inc.'
        ) {
            // Google Chrome
            return 'webm';
        } else {
            // not Google Chrome
            return 'mp4';
        }
    }

    /**
     * It used to get audio Mimetype for the web.
     */
    getMimeTypeForAudioWeb() {
        let userAgent = window.navigator.userAgent.toLowerCase();

        if (userAgent.includes('firefox')) {
            return 'webm';
        } else if (userAgent.includes('chrome')) {
            return 'webm';
        } else if (userAgent.includes('safari')) {
            return 'mp3';
        } else {
            return 'mp3'; // Default MIME type for other browsers
        }
    }

    /**
     * This method is used to handleVideoAudioAndPictureDownload.
     */
    handleVideoAudioAndPictureDownload() {
        let arrayAudioStreams = this.getVideoStreamFromTracks('audio');
        if (this.decodeJwt.selfie === "A") {
            if (!this.boolRecording) {
                if (arrayAudioStreams.length > 1) {
                    if (this._isAudioMuted() === false) {
                        // this.props.dispatch(toggleRecordTimer());
                        this.props.dispatch(showNotification({
                            titleKey: 'Audio recording started',
                            uid: SALESFORCE_LINK_NOTIFICATION_ID,
                            appearance: NOTIFICATION_TYPE.NORMAL
                        }, NOTIFICATION_TIMEOUT_TYPE.SHORT));
                        this.boolRecording = true;
                        // get Stream from Tracks
                        this.videoAndAudioMainFunction(arrayAudioStreams);
                    } else {
                        this.props.dispatch(showNotification({
                            titleKey: 'Turn on audio to start recording',
                            uid: SALESFORCE_LINK_NOTIFICATION_ID,
                            appearance: NOTIFICATION_TYPE.NORMAL
                        }, NOTIFICATION_TIMEOUT_TYPE.SHORT));
                    }
                } else {
                    this.props.dispatch(showNotification({
                        titleKey: 'There is no other participants to record audio',
                        uid: SALESFORCE_LINK_NOTIFICATION_ID,
                        appearance: NOTIFICATION_TYPE.NORMAL
                    }, NOTIFICATION_TIMEOUT_TYPE.SHORT));
                }
            } else {
                this.boolRecording = false;
                this.props.dispatch(showNotification({
                    titleKey: 'Audio recording ended',
                    uid: SALESFORCE_LINK_NOTIFICATION_ID,
                    appearance: NOTIFICATION_TYPE.NORMAL
                }, NOTIFICATION_TIMEOUT_TYPE.SHORT));
                // this.props.dispatch(toggleRecordTimer());
                this.saveAudioRecording();
            }
        } else if (this.decodeJwt.selfie === "V") {
            if (!this.boolRecording) {
                if (arrayAudioStreams.length > 1) {
                    if (this._isVideoMuted() === false) {
                        this.canvas = document.createElement('canvas');
                        this.canvas.style.width = 1080;
                        this.canvas.style.height = 720;
                        const videos = document.getElementsByTagName('video');
                        if (videos.length > 0) {
                            // get Stream from Tracks
                            if (arrayAudioStreams.length > 0) {
                                // this.props.dispatch(toggleRecordTimer)
                                this.props.dispatch(showNotification({
                                    titleKey: 'Video recording started',
                                    uid: SALESFORCE_LINK_NOTIFICATION_ID,
                                    appearance: NOTIFICATION_TYPE.NORMAL
                                }, NOTIFICATION_TIMEOUT_TYPE.SHORT));
                                this.boolRecording = true;
                                this.videoAndAudioMainFunction(arrayAudioStreams, videos, this.canvas);
                            }
                        }
                    } else {
                        this.props.dispatch(showNotification({
                            titleKey: 'Turn on video to start recording',
                            uid: SALESFORCE_LINK_NOTIFICATION_ID,
                            appearance: NOTIFICATION_TYPE.NORMAL
                        }, NOTIFICATION_TIMEOUT_TYPE.SHORT));
                    }
                } else {
                    this.props.dispatch(showNotification({
                        titleKey: 'There is no other participants to record video',
                        uid: SALESFORCE_LINK_NOTIFICATION_ID,
                        appearance: NOTIFICATION_TYPE.NORMAL
                    }, NOTIFICATION_TIMEOUT_TYPE.SHORT));
                }
            } else {
                this.boolRecording = false;
                // this.props.dispatch(toggleRecordTimer())
                this.props.dispatch(showNotification({
                    titleKey: 'Video recording ended',
                    uid: SALESFORCE_LINK_NOTIFICATION_ID,
                    appearance: NOTIFICATION_TYPE.NORMAL
                }, NOTIFICATION_TIMEOUT_TYPE.SHORT));
                this.saveVideoRecording();
            }
        } else {
            const videos = document.getElementsByTagName('video');
            let canvas = document.createElement('canvas');
            if (videos.length > 0) {
                canvas.width = 1080;
                canvas.height = 720;

                this.link = document.createElement('a');
                document.body.appendChild(this.link); // for Firefox
                this.selfieTogether(videos, canvas);
            }
        }

    };

    /**
     * This method is used to filter.
     */
    arrayRemove(arr: any, value: any) {
        return arr.filter(function (ele: any) {
            return ele.id !== value;
        });
    }

    /**
     * This method is used to getParticipantVideo.
     */
    getParticipantVideo(videoReceiver: any) {
        let toArr = Array.prototype.slice.call(videoReceiver, 0);
        toArr.some((obj) => {
            if (obj.id.includes('remote')) {
                this.participantVideo = obj;
                return true;
            }
            return false;
        });
    };

    /**
     * This method is used to downloadAudioAndVideoRecording.
     */
    downloadAudioAndVideoRecording = () => {
        if (isMobileBrowser()) {
            let videoAndAudioFileReader = new FileReader();
            let base64data;
            videoAndAudioFileReader.onloadend = function () {
                base64data = videoAndAudioFileReader.result;

                if (window.flutter_inappwebview) {
                    let args: any = base64data;
                    window.flutter_inappwebview.callHandler('handleAudioArgs', args);
                    window.flutter_inappwebview.callHandler('handleVideoArgs', args);
                }
            };
            if (this.decodeJwt.selfie === "V") {
                videoAndAudioFileReader.readAsDataURL(this.recordedChunks[0]);
            } else if (this.decodeJwt.selfie === "A") {
                videoAndAudioFileReader.readAsDataURL(this.audioChunks[0]);
            }
        } else {
            let videoAndAudioObjectURL: any;
            if (this.decodeJwt.selfie === "V") {
                videoAndAudioObjectURL = URL.createObjectURL(this.recordedChunks[0]);
            } else if (this.decodeJwt.selfie === "A") {
                videoAndAudioObjectURL = URL.createObjectURL(this.audioChunks[0]);
            }

            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = videoAndAudioObjectURL;
            a.download = `${this.getFilename()}.${this.getMimeType()}`;
            document.body.appendChild(a);

            a.onclick = () => {
                setTimeout(() => {
                    document.body.removeChild(a);
                    clearInterval(this.intervalRecord);
                    globalWindow.URL.revokeObjectURL(videoAndAudioObjectURL);
                }, 7000);
            };
            a.click();
        }
    }


    /**
     * Video and audio recorder functionality.
     */
    videoAndAudioMainFunction(audioStreams: any, videoReceiver?: any, canvas?: any) {
        const audCtx = new AudioContext();
        let audioDestinationNode = new MediaStreamAudioDestinationNode(audCtx);

        function attachAudioSources() {
            const createAudioNodes = (stream: any) => {
                audCtx.createMediaStreamSource(stream)
                    .connect(audioDestinationNode);
            }
            audioStreams.forEach(createAudioNodes);
            return audioDestinationNode.stream.getTracks();
        }


        if (this.decodeJwt.selfie === "V") {
            let audioStreamTracks = attachAudioSources();
            let toArr = Array.prototype.slice.call(videoReceiver, 0);
            this.getParticipantVideo(videoReceiver);

            const paintCanvas = (filtered: any, context2D: any) => {
                for (let i = 0; i < filtered.length; i++) {
                    context2D.drawImage(filtered[i], (i) * (canvas.width / filtered.length), 0, canvas.width / filtered.length, canvas.height);
                }
            }

            if (this.participantVideo) {
                let filtered = this.arrayRemove(toArr, 'largeVideo');
                let context2D = canvas.getContext('2d');
                this.intervalRecord = setInterval(() => {
                    paintCanvas(filtered, context2D);
                }, 30);


                let clubbedStream = canvas.captureStream();
                audioStreamTracks.forEach((track) => clubbedStream.addTrack(track));
                const options = {mimeType: `video/${this.getMimeType()}`};
                this.recordedChunks = [];
                this.videoMediaRecorder = new MediaRecorder(clubbedStream, options);

                const handleDataAvailable = (event: any) => {
                    if (event.data.size > 0) {
                        this.recordedChunks.push(event.data);
                    } else {
                        console.log('event.data.size is ', event.data.size);
                    }
                }

                this.videoMediaRecorder.ondataavailable = handleDataAvailable;
                this.videoMediaRecorder.addEventListener('stop', this.downloadAudioAndVideoRecording);
                this.videoMediaRecorder.start();

            }
        }
        if (this.decodeJwt.selfie === "A") {
            const createAudioNodes = (stream: any) => {
                audCtx.createMediaStreamSource(stream)
                    .connect(audioDestinationNode);
            }
            audioStreams.forEach(createAudioNodes);

            this.audioChunks = [];

            this.audioMediaRecorder = new MediaRecorder(audioDestinationNode.stream);

            this.audioMediaRecorder.addEventListener('dataavailable', (event: any) => {
                this.audioChunks.push(event.data);
            });


            this.audioMediaRecorder.addEventListener('stop', this.downloadAudioAndVideoRecording);
            this.audioMediaRecorder.start();
        }
    }


    saveBase64AsFile(base64: any, fileName: any) {
        this.link.setAttribute('href', base64);
        this.link.setAttribute('download', fileName);
        this.link.click();
    }

    /**
     * This method is used to take picture .
     */
    selfieTogether(videoReceiver: any, canvas: any) {
        let toArr = Array.prototype.slice.call(videoReceiver, 0);
        this.getParticipantVideo(videoReceiver);

        if (this.participantVideo) {
            let filtered = this.arrayRemove(toArr, 'largeVideo');
            for (let i = 0; i < filtered.length; i++) {
                canvas.getContext('2d')
                    .drawImage(filtered[i], (i) * ((canvas.width) / filtered.length), 0, (canvas.width) / filtered.length, canvas.height);
            }
            let dataURL = canvas.toDataURL('image/png');
            this.saveBase64AsFile(dataURL, `${this.getFilename()}.png`);

        } else {
            this.props.dispatch(showNotification({
                titleKey: 'There is no other participants to take selfie',
                uid: SALESFORCE_LINK_NOTIFICATION_ID,
                appearance: NOTIFICATION_TYPE.NORMAL
            }, NOTIFICATION_TIMEOUT_TYPE.SHORT));
        }

    }

    /**
     * This method is used to get filename .
     */
    getFilename() {
        const now = new Date();
        const timestamp = now.toISOString();
        const room = new RegExp(/(^.+)\s\|/).exec(document.title);
        if (room && room[1] !== '') {
            return `${room[1]}_${timestamp}`;
        } else {
            return `polytok_${timestamp}`;
        }
    }

    /**
     * Filtering streams.
     */
    filterVideoStreamsByMediaType(arr: any, value: any) {
        return arr.filter(function (ele: any) {
            return ele.jitsiTrack.type === value;
        })
            .map(function (ele: any) {
                return ele.jitsiTrack.stream;
            });
    }

    /**
     * Getting video streams from tracks.
     */
    getVideoStreamFromTracks(mediaType: any) {
        let tracks = APP.store.getState()['features/base/tracks'];
        let arrayMediaStreams;
        let valueToFilter = 'audio';
        if (this.decodeJwt.selfie === 'V') {
            arrayMediaStreams = this.filterVideoStreamsByMediaType(tracks, mediaType);
        } else if (this.decodeJwt.selfie === 'A') {
            arrayMediaStreams = this.filterVideoStreamsByMediaType(tracks, valueToFilter);
        }
        return arrayMediaStreams;
    }

    /**
     * saveVideoRecording.
     */
    saveVideoRecording() {
        this.videoMediaRecorder.stop();
    }

    /**
     * saveAudioRecording.
     */
    saveAudioRecording() {
        this.audioMediaRecorder.stop()
    }


    /**
     * Indicates if video is currently muted or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isVideoMuted() {
        return this.props._videoMuted;
    }

    /**
     * Indicates if audio is currently muted or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isAudioMuted() {
        return this.props._audioMuted;
    }

    /**
     * Helper function to perform the download action.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _downloadVideoRecorder() {
        this.handleVideoAudioAndPictureDownload();

    }
}

const globalWindow = window as any;

/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code VideoMuteButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _audioOnly: boolean,
 *     _videoMuted: boolean
 * }}
 */
function _mapStateToProps(state: IReduxState) {
    const {enabled: audioOnly} = state['features/base/audio-only'];
    const tracks = state['features/base/tracks'];
    const enabledFlag = getFeatureFlag(state, VIDEO_MUTE_BUTTON_ENABLED, true);
    const _audioMuted = isLocalTrackMuted(state['features/base/tracks'], MEDIA_TYPE.AUDIO);

    return {
        _audioOnly: Boolean(audioOnly),
        _videoDisabled: isVideoMuteButtonDisabled(state),
        _videoMuted: isLocalTrackMuted(tracks, MEDIA_TYPE.VIDEO),
        visible: enabledFlag,
        _audioMuted
    };
}

export default translate(connect(_mapStateToProps)(DownloadVideoAudioAndSelfie));

