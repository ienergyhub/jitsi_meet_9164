import React, { ReactElement } from 'react';
import { connect } from 'react-redux';

import {IReduxState, IStore} from '../../../app/types';
import { getLocalParticipant } from '../../../base/participants/functions';
import { getLargeVideoParticipant } from '../../../large-video/functions';
import { isLayoutTileView } from '../../../video-layout/functions.web';
import {
    AbstractCaptions,
    type IAbstractCaptionsProps,
    _abstractMapStateToProps
} from '../AbstractCaptions';
import {sendTranscriptText} from "../../actions.any";


interface IProps extends IAbstractCaptionsProps {

    /**
     * Whether the subtitles container is lifted above the invite box.
     */
    _isLifted: boolean | undefined;

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: IStore['dispatch'];
}

let textStore = '';
let allData = [];

/**
 * React {@code Component} which can display speech-to-text results from
 * Jigasi as subtitles.
 */
class Captions extends AbstractCaptions<IProps> {

    constructor(props : any) {
        super(props);
        this.state = {
            data: '',
            bite: '',
            i: 0
        };
    };

    componentDidMount() {
        setInterval(async () => {
            allData = [];
            const args = `${textStore}`;
            this.props.dispatch(sendTranscriptText(args));
        }, 10000);
    }

    /**
     * Renders the transcription text.
     *
     * @param {string} id - The ID of the transcript message from which the
     * {@code text} has been created.
     * @param {string} text - Subtitles text formatted with the participant's
     * name.
     * @param textWithOutName
     * @protected
     * @returns {ReactElement} - The React element which displays the text.
     */
    _renderParagraph(id: string, text: string): ReactElement {
        textStore += text;
        return (
            <p key = { id }>
                <span>{ text }</span>
            </p>
        );
    }

    /**
     * Renders the subtitles container.
     *
     * @param {Array<ReactElement>} paragraphs - An array of elements created
     * for each subtitle using the {@link _renderParagraph} method.
     * @protected
     * @returns {ReactElement} - The subtitles container.
     */
    _renderSubtitlesContainer(paragraphs: Array<ReactElement>): ReactElement {
        const className = this.props._isLifted
            ? 'transcription-subtitles lifted'
            : 'transcription-subtitles';

        return (
            <div className = { className } >
                { paragraphs }
            </div>
        );
    }
}

/**
 * Maps (parts of) the redux state to the associated {@code }'s
 * props.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {Object}
 */
function mapStateToProps(state: IReduxState) {
    const isTileView = isLayoutTileView(state);
    const largeVideoParticipant = getLargeVideoParticipant(state);
    const localParticipant = getLocalParticipant(state);

    return {
        ..._abstractMapStateToProps(state),
        _isLifted: Boolean(largeVideoParticipant && largeVideoParticipant?.id !== localParticipant?.id && !isTileView)
    };
}

export default connect(mapStateToProps)(Captions);
