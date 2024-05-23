// @ts-ignore
import React, {ReactChild, ReactFragment, ReactPortal} from 'react'
import AbstractHostInfoDialog from "../AbstractHostInfoDialog";
import Dialog from "../../../base/ui/components/web/Dialog";
import {translate} from "../../../base/i18n/functions";
import {isMobileBrowser} from "../../../base/environment/utils";
import {connect} from "react-redux";

/**
 * Dialog to display the user information.
 */

class HostInfoDialog extends AbstractHostInfoDialog {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */

    render() {
        const {moderatorData} = this.state;
        return (
            <div>
                <Dialog
                    cancel={{hidden: true}}
                    ok={{hidden: true}}
                    onSubmit={this._onSubmit}
                    size={this.additionalData ? "large" : "medium"}
                    titleKey='dialog.hostInfo'>
                    {
                        moderatorData.map((value, index, array) => (
                            <div key={index}>
                                {
                                    value?.status !== null && value?.status == 1 && (
                                        <div>
                                            {
                                                value?.data && (
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: isMobileBrowser() ? 'column' : 'row',
                                                        justifyContent: 'space-around'
                                                    }}>
                                                        <div>
                                                            <p>Name
                                                                : {value.data?.firstName} {value.data?.lastName}</p>
                                                            <p>Email
                                                                : {value.data?.email}</p>
                                                            <p>Gender
                                                                : {value.data?.gender}</p>
                                                            <p>Phone
                                                                : {value.data?.phone}</p>
                                                            {
                                                                value.data.core !== null ? (
                                                                    <div>
                                                                        <p>Profession
                                                                            : {value.data.core?.profession}</p>
                                                                        <p>Nationality
                                                                            : {value.data.core?.nationality}</p>
                                                                        <p>Position
                                                                            : {value.data.core?.position}</p>
                                                                        <p>Education
                                                                            : {value.data.core?.education}</p>
                                                                        <p>Skills
                                                                            : {value.data.core?.skills}</p>
                                                                        { isMobileBrowser() ?<hr/> : null}
                                                                    </div>) : " "
                                                            }

                                                            <p style={{
                                                                textDecoration: 'underline',
                                                                cursor: 'pointer'
                                                            }}
                                                               onClick={() => this.getLongModeratorData()}>{!this.additionalData ? "More" : "Less"}</p>
                                                        </div>
                                                        {
                                                            this.additionalData ?
                                                                (
                                                                    <div>
                                                                        {
                                                                            value.data.recomended !== null ? (
                                                                                <div>
                                                                                    <p>Featured
                                                                                        : {value.data.recomended?.featured}</p>
                                                                                    <p>Recommendation
                                                                                        : {value.data.recomended?.recommendation}</p>
                                                                                </div>) : " "
                                                                        }
                                                                        {
                                                                            value?.data?.additional !== null ? (
                                                                                <div>
                                                                                    <p>Language
                                                                                        : {value.data.additional?.language}</p>
                                                                                    <p>Publications
                                                                                        : {value.data.additional?.publications}</p>
                                                                                    <p>Patent
                                                                                        : {value.data.additional?.patent}</p>
                                                                                    <p>Honours
                                                                                        and
                                                                                        Awards
                                                                                        : {value.data.additional?.honerawards}</p>
                                                                                    <p>Volunteer
                                                                                        : {value.data.additional?.volunteer}</p>
                                                                                    <p>Interests
                                                                                        : {value.data.additional?.interests}</p>
                                                                                </div>
                                                                            ) : " "
                                                                        }
                                                                        {
                                                                            value?.data?.address != null ?(
                                                                                <div>
                                                                                    <p>Zipcode : {value.data.address?.zipcode}</p>
                                                                                    <p>Locality : {value.data.address?.locality}</p>
                                                                                    <p>AdministrativeArea : {value.data.address?.administrativeArea}</p>
                                                                                </div>
                                                                            ): " "
                                                                        }
                                                                    </div>
                                                                ) : null
                                                        }
                                                    </div>
                                                )
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        ))
                    }
                </Dialog>
                {this.additionalData = false}
            </div>
        )
    }
}

export default translate(connect()(HostInfoDialog));
