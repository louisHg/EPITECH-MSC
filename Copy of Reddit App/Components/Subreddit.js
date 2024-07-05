import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card } from 'react-native-elements';
import { styles } from '../style/style';

export default class Subreddit extends Component{

    state = {
        data : null,
        subData:null,
        isLoadingSub : true,
        isLoadingPost: true,
        formatedData : [],
        formatedDataSub:null,
    }

    constructor(props) {
        super(props);
    }

    async getRedditPostData(){
        await fetch("https://www.reddit.com/r/"+this.props.route.params.subreddit+".json")
            .then((res) => res.json())
            .then((res)=>this.setState({data : res.data.children}))
            .then(()=> this.setState({ isLoadingPost : false }))
    }
    async getRedditSubData(){
        await fetch("https://www.reddit.com/r/"+this.props.route.params.subreddit+"/about.json")
        .then((res) => res.json())
        .then((res)=>this.setState({dataSub : res.data}))
        .then(()=> this.setState({ isLoadingSub : false }))
    }

    componentDidMount(){
        this.getRedditSubData()
        .then(()=>this.renderSubBanner())

        this.getRedditPostData()
        .then(()=>this.renderData())
    }

    renderSubBanner(){
        console.log(this.state.dataSub)
        this.setState({formatedDataSub : 
        <View>
            <Text>{this.state.dataSub.title}</Text>
            <Text>{this.state.dataSub.public_description}</Text>
            <Text>{this.state.dataSub.active_user_count}</Text>
            <Text>{this.state.dataSub.subscribers}</Text>
            <Image source={{uri: this.state.dataSub.banner_img}} style={{width: 100, height: 100}}></Image>
        </View>})
    }

    renderData(){
        var array = []
        for(let i = 0 ; i < this.state.data.length ; i++){
            array.push(
                <Card>
                    <View style={{position:"relative"}}>
                        <View key={this.state.data[i].data.id} style={{alignItems: "center"}}>
                            <Image source={{uri: this.state.data[i].data.thumbnail}} style={{width: 100, height: 100}}/>
                            <View>
                                <Text>{this.state.data[i].data.subreddit}</Text>
                                <Text onPress={()=> this.props.navigation.navigate('Thread', {'thread_url': this.state.data[i].data.permalink.slice(0, -1) + '.json'})}>{this.state.data[i].data.title}</Text>
                                <Text>{this.state.data[i].data.ups}</Text>
                                <Text>{this.state.data[i].data.author}</Text>
                                <Text>{this.state.data[i].data.num_comments}</Text>
                            </View>
                        </View>
                    </View>
                </Card>
            )
        }
        this.setState({formatedData : array})
    }


    render(){
        return(
            <ScrollView style={styles.container}>
                    {!this.state.isLoadingSub? <View>{this.state.formatedDataSub}</View>:null}
                    {!this.state.isLoadingPost? <View>{this.state.formatedData}</View>:null}             
            </ScrollView>
        )
    }
}