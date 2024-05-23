
import React from 'react';
import './styles.css'
import {translate} from "../../base/i18n/functions";
import Dialog from "../../base/ui/components/web/Dialog";

type Props = {

    /**
     * Invoked to obtain translated strings.
     */
    t: Function,

    /**
     * The URL of the conference.
     */
    url: string
};

/**
 * Allow users to embed a jitsi meeting in an iframe.
 *
 * @returns {React$Element<any>}
 */
const NewModal6 = () => (
    <Dialog
        hideCloseButton={true}
        cancel={{hidden: true}}
        ok={{hidden: true}}
        size={"small"}>
        <div style={{paddingTop: '10px'}} className='embed-meeting-dialog-tok'>
            <div>Your meeting will end in next 10 minutes. Please plan accordingly.</div>
        </div>
    </Dialog>
);



export default translate(NewModal6);
