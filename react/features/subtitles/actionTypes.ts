
/**
 * The type of (redux) action which indicates that an endpoint message
 * sent by another participant to the data channel is received.
 *
 * {
 *     type: ENDPOINT_MESSAGE_RECEIVED,
 *     participant: Object,
 *     json: Object
 * }
 */
export const ENDPOINT_MESSAGE_RECEIVED = 'ENDPOINT_MESSAGE_RECEIVED';

/**
 * The type of (redux) action which indicates that an existing transcript
 * has to be removed from the state.
 *
 * {
 *      type: REMOVE_TRANSCRIPT_MESSAGE,
 *      transciptMessageID: string,
 * }
 */
export const REMOVE_TRANSCRIPT_MESSAGE = 'REMOVE_TRANSCRIPT_MESSAGE';

/**
 * The type of (redux) action which indicates that a transcript with an
 * given message_id to be added or updated is received.
 *
 * {
 *      type: UPDATE_TRANSCRIPT_MESSAGE,
 *      transcriptMessageID: string,
 *      newTranscriptMessage: Object
 * }
 */
export const UPDATE_TRANSCRIPT_MESSAGE = 'UPDATE_TRANSCRIPT_MESSAGE';

/**
 * The type of (redux) action which indicates that the user pressed the
 * ClosedCaption button, to either enable or disable subtitles based on the
 * current state.
 *
 * {
 *      type: TOGGLE_REQUESTING_SUBTITLES
 * }
 */
export const TOGGLE_REQUESTING_SUBTITLES
    = 'TOGGLE_REQUESTING_SUBTITLES';

/**
 * The type of (redux) action which indicates if the user set the state of
 * the subtitles to enabled or disabled.
 *
 * {
 *      type: SET_REQUESTING_SUBTITLES
 *      enabled: boolean
 * }
 */
export const SET_REQUESTING_SUBTITLES
    = 'SET_REQUESTING_SUBTITLES';

/**
 * The type of (redux) action which indicates that a transcript with an
 * given message_id to be added or updated is received.
 *
 * {
 *      type: SEND_TRANSCRIPT_MESSAGE,
 *      _sendTranscriptMessage: Array,
 * }
 */
export const SEND_TRANSCRIPT_MESSAGE = 'SEND_TRANSCRIPT_MESSAGE';

/**
 * The type of (redux) action which indicates that a transcript with an
 * given message_id to be added or updated is received.
 *
 * {
 *      type: SEND_TRANSCRIPT_BITE,
 *      _sendTranscriptBite: String,
 * }
 */
export const SEND_TRANSCRIPT_BITE = 'SEND_TRANSCRIPT_BITE';

/**
 * The type of (redux) action which indicates that a transcript with an
 * given message_id to be added or updated is received.
 *
 * {
 *      type: SEND_TRANSCRIPT_TEXT,
 *      _sendTranscriptText: String,
 * }
 */
export const SEND_TRANSCRIPT_TEXT = 'SEND_TRANSCRIPT_TEXT';
