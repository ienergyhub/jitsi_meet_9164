import {Component} from "react";
import {WithTranslation} from "react-i18next";
import {IStore} from "../../app/types";
import jwt_decode from "jwt-decode";
import {PROFILE_PATH} from "../../../constants";
import API from "../../../services";
import {sendAnalytics} from "../../analytics/functions";
import {
    createRemoteVideoMenuButtonEvent
} from "../../analytics/AnalyticsEvents";

interface IProps extends WithTranslation {

    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];

    /**
     * The ID of the remote participant to be kicked.
     */
    participantID: string;
}


export default class AbstractHostInfoDialog extends Component<IProps, {moderatorData: Array<any> }> {
    additionalData = false;
    jwt = APP.store.getState()['features/base/jwt'];
    host_jwt = jwt_decode(this.jwt.jwt);
    /**
     * Initializes a new {@code AbstractKickRemoteParticipantDialog} instance.
     *
     * @inheritdoc
     */

    constructor(props: IProps) {
        super(props);
        this.state = {
            moderatorData : []
        }
        this._onSubmit = this._onSubmit.bind(this);
    }

    componentDidMount() {
        this.getShortModeratorData();
    }

    getShortModeratorData() {
        try {
            const shortModeratorData = API.request('GET', `${PROFILE_PATH}/short/${this.host_jwt.host}`);
            shortModeratorData.then((response: any) => this.setState({moderatorData: [response]}));
        } catch (e) {
            console.log(e);
        }
    };
        getLongModeratorData(){
            this.additionalData = true;
            if(this.additionalData){
                try {
                    const longModeratorData = API.request('GET', `${PROFILE_PATH}/long/${this.host_jwt.host}`);
                    longModeratorData.then((response : any)=> this.setState({moderatorData: [response]}))
                }
                catch (e) {
                    console.log(e)
                }
            }
    }

    _onSubmit(){
        const {dispatch, participantID} = this.props;

        sendAnalytics(createRemoteVideoMenuButtonEvent(
            'hostInfo.button',
            {
                'participant_id' : participantID
            }
        ));
        return true;
    }

}
