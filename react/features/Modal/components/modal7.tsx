
import React from 'react';
import  Dialog  from '../../base/ui/components/web/Dialog';
import { translate } from '../../base/i18n/functions';
import './styles.css'

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
const NewModal7 = () => (
    <Dialog
        cancel={{hidden: true}}
        ok={{hidden: true}}
        size={'medium'}
        titleKey='Ticket'>
        <div>
            <p>I agree If I am selected for a golden ticket. I'll behave
                appropriately as defined In the terms of service.</p>
        </div>
    </Dialog>
);



export default translate(NewModal7);
