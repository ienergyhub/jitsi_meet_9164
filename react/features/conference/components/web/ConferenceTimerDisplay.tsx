import React, {useEffect} from 'react';
import { makeStyles } from 'tss-react/mui';

import { withPixelLineHeight } from '../../../base/styles/functions.web';
import { IDisplayProps } from '../ConferenceTimer';
import {getRunningTimer} from "../../../base/conference/actions";
import {connect, useDispatch} from "react-redux";

const useStyles = makeStyles()(theme => {
    return {
        timer: {
            ...withPixelLineHeight(theme.typography.labelRegular),
            color: theme.palette.text01,
            padding: '6px 8px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            boxSizing: 'border-box',
            height: '28px',
            borderRadius: `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0`,
            marginRight: '2px',

            '@media (max-width: 300px)': {
                display: 'none'
            }
        }
    };
});

/**
 * Returns web element to be rendered.
 *
 * @returns {ReactElement}
 */
function ConferenceTimerDisplay({ timerValue, textStyle: _textStyle }: IDisplayProps) {
    const { classes } = useStyles();
    const dispatch = useDispatch()
    useEffect(() => {
        // Dispatch the action when the component mounts or when timerValue changes
        dispatch(getRunningTimer(timerValue));
    }, [dispatch, timerValue]);


    return (
        <span className = { classes.timer }>{ timerValue }</span>
    );
}
// Connect the component to the Redux store
const ConnectedConferenceTimerDisplay = connect()(ConferenceTimerDisplay);

export default ConnectedConferenceTimerDisplay;
