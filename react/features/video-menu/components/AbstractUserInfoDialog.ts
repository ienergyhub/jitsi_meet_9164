import {Component} from "react";
import {WithTranslation} from "react-i18next";
import {IStore} from "../../app/types";
import { sendAnalytics} from "../../analytics/functions";
import {createRemoteVideoMenuButtonEvent} from '../../analytics/AnalyticsEvents'
import jwt_decode from "jwt-decode";
import {PROFILE_PATH} from "../../../constants";
import API from "../../../services";

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


export default class AbstractUserInfoDialog extends Component<IProps, {userInformation: Array<any>, user: String}> {
    additionalUserData = false;
    jwt = APP.store.getState()['features/base/jwt'];
    user_jwt = jwt_decode(this.jwt.jwt)
    id: any;
    remoteUserId: any
    /**
     * Initializes a new {@code AbstractKickRemoteParticipantDialog} instance.
     *
     * @inheritdoc
     */

    constructor(props: IProps) {
        super(props);
        this.state = {
            userInformation : [],
            user: ''
        }
        this._onSubmit = this._onSubmit.bind(this);
    }
    componentDidMount() {
        this.id = this.props.participantID
        this.extracted(this.id)
        if (this.remoteUserId !== undefined) {
            this.getShortUserData();
        }
    }


     extracted(id: any) {
        let pJwt : string = 'pJwt';
        let remote = APP.store.getState()['features/base/participants'].remote;
        let mapRemote = remote?.get(id);
        let conference1 : any = mapRemote?.conference;
        if (conference1) {
            let participants  = conference1?.participants;
            let mapRemoteUserValue = participants?.get(id);
            let properties = mapRemoteUserValue?._properties;
            if (properties.hasOwnProperty(pJwt)) {
                 this.remoteUserId = properties?.pJwt;
            } else {
                console.log('No pJwt in object');
            }
        } else {
            console.log('No conference in child object');
        }
    }


    /**
     * This method is used to get ShortUserData
     */
    getShortUserData(){
        try{
            if(this.remoteUserId === "GUEST"){
                this.setState({user: "GUEST"});
            }
            else {
               const shortUserData = API.request('GET', `${PROFILE_PATH}/short/${this.remoteUserId}`);
                shortUserData.then((response: any) => this.setState({userInformation: [response]}));
            }

        }
        catch (e) {
            console.log(e);
        }
    }

    /**
     * This method is used to get LongUserData
     */
    getLongUserData(){
        this.additionalUserData = true;
        if(this.additionalUserData){
            try {
                if(this.user_jwt.user === "GUEST"){
                    this.setState({user: "GUEST"});
                }
                else{
                   const longUserData = API.request('GET', `${PROFILE_PATH}/long/${this.remoteUserId}`);
                    longUserData.then((response : any)=> this.setState({userInformation: [response]}))
                }
            }
            catch (e) {
                console.log(e)
            }
        }
    }

    _onSubmit(){
        const {dispatch, participantID} = this.props;

        sendAnalytics(createRemoteVideoMenuButtonEvent(
            'userInfo.button',
            {
                'participant_id' : participantID
            }
        ));
        return true;
    }

}
