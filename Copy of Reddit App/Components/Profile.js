import { ScrollView } from "react-native-gesture-handler"
import React, { Component } from 'react';
import { changeUserPref } from '../Helpers/user';
import { Button, Text, View } from "react-native"
import { styles } from "../style/style";
import { Card } from "react-native-elements";

export default class Profile extends Component{
    state={
        user_data : null,
        token:this.props.route.params.token,
        formated_data: null
    }

    async getUserPref(access_token){

        let requestHeaders= {
            'Authorization': `bearer ${access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    
        await fetch('https://oauth.reddit.com/api/v1/me/prefs?raw_json=1', {'headers' : requestHeaders})
        .then((res)=>res.json())
        .then((res)=>this.setState({user_pref: res}))
    }

    componentDidMount(){
        this.getUserPref(this.state.token)
        .then(()=>this.formatData())
    }

    formatData(){
        var preference = (
            <Card>
                <View styles={{position: "relative"}}>
                    <View styles={{alignItems: "center"}}>
                        <Text>Video autoplay: {this.state.user_pref.video_autoplay?"Activated" : "Disabled"}</Text>
                        <Text>Language: {this.state.user_pref.lang}</Text>
                        <Text>Show presence: {this.state.user_pref.show_presence? "Activated" : "Disabled"}</Text>
                        <Text>Accept private message: {this.state.user_pref.accept_pms ?"Activated" : "Disabled"}</Text>
                        <Text>Night theme: {this.state.user_pref.nightmode ?"Activated" : "Disabled"}</Text>
                        <Text>Collapse read message: {this.state.user_pref.collapse_read_messages ?"Activated" : "Disabled"}</Text>
                    </View>
                </View>
            </Card>
        )
        this.setState({formated_data: preference})
    }

    render(){
        return(
            <ScrollView>
                <Button title="Save preference" onPress={()=>changeUserPref(this.props.token, this.state.user_pref)}></Button>
                {this.state.formated_data? <View styles={styles.container}>{this.state.formated_data}</View>: null}
            </ScrollView>
        )
    }
}