import React, { Component } from 'react';
import { View, Text, Image, Button } from 'react-native';
import { styles } from '../style/style';
import { ScrollView } from 'react-native-gesture-handler';

export default class Thread extends Component{

    state = {
        data : null,
        isLoading : true,
        commentsData : [],
        threadData : "",
        mainPost:"",
    }

    constructor(props) {
        super(props);
    }

    async getRedditData(){
        await fetch("https://www.reddit.com"+this.props.route.params.thread_url + ".json")
            .then((res) => res.json())
            .then((res)=>this.setState({data : res}))
            .then(()=> this.setState({ isLoading : false }))
    }

    componentDidMount(){
        this.getRedditData()
        .then(()=>this.renderData())
    }

    renderData(){

        var post = 
        <View>
            <Text>Title :{this.state.data[0].data.children[0].data.title}</Text>
            <Text>Upvotes :{this.state.data[0].data.children[0].data.ups}</Text>
            <Text>Comments :{this.state.data[0].data.children[0].data.num_comments}</Text>
        </View>

        var comments = []
        for(let i = 0 ; i < this.state.data[1].data.children.length ; i++){
            comments.push(
                <View key={this.state.data[1].data.children[i].data.id}>
                    <Text>{this.state.data[1].data.children[i].data.author}</Text>
                    <Text>{this.state.data[1].data.children[i].data.ups}</Text>
                    <Text>{this.state.data[1].data.children[i].data.body}</Text>
                    {this.state.data[1].data.children[i].data.replies? <Text>{this.state.data[1].data.children[i].data.replies.length}</Text> :null}
                </View>
            )
        }
        this.setState({commentsData : comments, mainPost : post})
    }

    render(){
        return(
            <ScrollView>
                {!this.state.isLoading ?
                    <Text>{this.state.mainPost}</Text>
                    :null 
                }
                {!this.state.isLoading ?
                    <Text>{this.state.commentsData}</Text>
                    :null 
                }
            </ScrollView>
        )
    }
}