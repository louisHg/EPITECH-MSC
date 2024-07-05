import React, { Component } from 'react';
import { View, Text, Image, Linking, Button } from 'react-native';
import { styles } from '../style/style';
import { ScrollView } from 'react-native-gesture-handler';
import { Buffer } from "buffer"
import { redditConnexion } from '../Helpers/access_token';
import { Card } from 'react-native-elements';

const config = {
    clientId: 'yiO4_D-qiB-em1xb8RMWZg',
    redirectUrl: 'com.redditest://Main/oauth2redirect/reddit',
    serviceConfiguration: {
      authorizationEndpoint: 'https://www.reddit.com/api/v1/authorize.compact',
      tokenEndpoint: 'https://www.reddit.com/api/v1/access_token',
    },
    scopes: ['identity','edit','history','flair','mysubreddits','privatemessages','read','save','submit','subscribe','account'],
    clientSecret: '',
    customHeaders: {
      token: {
        Authorization: 'Basic <base64encoded clientID:>',
      },
    },
  };

export default class MainPage extends Component{

    state = {
        isLoading : true,
        formatedData : [],
        token:"",
        user_pref:"",
        user_subs:[],
        subs_posts:[]
    }

    constructor(props) {
        super(props);
    }

    async getRedditData(){
        
        for(let i = 0; i < this.state.user_subs.length; i++){
            console.log(this.state.user_subs[i].sub_name)
            await fetch("https://www.reddit.com/r/"+ this.state.user_subs[i].sub_name+".json")
            .then((res)=>res.json())
            .then((res)=>this.setState({subs_posts : [...this.state.subs_posts, res.data.children]}))
        }
    }
    componentDidMount(){
        Linking.addEventListener('url',(event)=>{

            var regex = /[?&]([^=#]+)=([^&#]*)/g,
            params = {},
            match;
            while (match = regex.exec(event.url)){
                params[match[1]] = match[2];
            }
            this.getAccessToken(params.code)
            .then(()=>this.getUserSubreddits(this.state.token))
            .then(()=>this.getRedditData())
            .then(()=>this.renderData())
            .then(()=>this.setState({isLoading : false}))
        })
        redditConnexion(config)
    }
    async getAccessToken(token){

        let authString = `yiO4_D-qiB-em1xb8RMWZg:`
        authString = Buffer.from(authString).toString('base64');
    
        let requestHeaders= {
            'Authorization': `Basic ${authString}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    
        var params = "grant_type=authorization_code&code=" + token + "&redirect_uri=com.redditest://Main/oauth2redirect/reddit";
    
        await fetch("https://www.reddit.com/api/v1/access_token",{
            body : params,
            headers : requestHeaders,
            method : "POST",
            })
        .then((res)=>res.json())
        .then((res)=> this.setState({token: res.access_token}))
    }
    async getUserSubreddits(access_token){
        let requestHeaders= {
            'Authorization': `bearer ${access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    
        await fetch('https://oauth.reddit.com/subreddits/mine/subscriber?raw_json=1', {'headers' : requestHeaders})
        .then((res)=>res.json())
        .then((res)=>{
    
            var subreddits = []
            for(let i = 0; i < res.data.children.length; i++){
                subreddits.push({
                    "sub_name" : res.data.children[i].data.display_name,
                    "sub_icon" : res.data.children[i].data.icon_img,
                    "description": res.data.children[i].data.public_description
                })
            }
            this.setState({user_subs : subreddits})
        })
    }
    renderData(){

        var post_list = []
        var max_post = 50
        var post_count = 0

        var max_post_from_sub  = max_post / this.state.user_subs.length;

        for(let i = 0; i < this.state.subs_posts.length; i++){
            for(let j = 0 ; i < this.state.subs_posts[i].length; j++){

                if(post_count > max_post_from_sub){
                    break
                }
                post_list.push(this.state.subs_posts[i][j])
                post_count++
                console.log(post_count)
            }
            post_count = 0
        }

        var array = []
        for(let i = 0 ; i < post_list.length ; i++){
            array.push(
                <Card>
                    <View style={{position: "relative"}}>
                        <View key={post_list[i].data.id} style={{alignItems: "center"}}>
                            <Image source={{uri: post_list[i].data.thumbnail}} style={{width: 100, height: 100}}/>
                            <View>
                                <Text onPress={()=> this.props.navigation.navigate('Subreddit', {'subreddit': post_list[i].data.subreddit})}>{post_list[i].data.subreddit}</Text>
                                <Text onPress={()=> this.props.navigation.navigate('Thread', {'thread_url': post_list[i].data.permalink.slice(0, -1) + '.json'})}>{post_list[i].data.title}</Text>

                                <Text>{post_list[i].data.ups}</Text>
                                <Text>{post_list[i].data.author}</Text>
                                <Text>{post_list[i].data.num_comments}</Text>
                            </View>
                        </View>
                    </View>
                </Card>
            )
        }

        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        this.setState({formatedData : array})
    }

    async sortByHot(){
        this.sortBy("hot")
        .then(()=>this.renderData())
    }

    async sortByRising(){
        this.sortBy("rising")
        .then(()=>this.renderData())
    }

    async sortByNew(){
        this.sortBy("new")
        .then(()=>this.renderData())
    }

    async sortByTop(){
        this.sortBy("top")
        .then(()=>this.renderData())
    }
    async sortBy(type){
        this.setState({subs_posts : []})
        for(let i = 0; i < this.state.user_subs.length; i++){
            await fetch("https://www.reddit.com/r/"+ this.state.user_subs[i].sub_name+"/"+ type +"/.json")
            .then((res)=>res.json())
            .then((res)=>this.setState({subs_posts : [...this.state.subs_posts, res.data.children]}))
        }
    }

    render(){
        return(
            <View style={styles.container}>
                <Button onPress={()=>this.props.navigation.navigate('Profile', {'token': this.state.token})} title="User Profile"></Button>
                <View>
                    <Button onPress={()=>this.sortByHot()} title="Hot"></Button>
                    <Button onPress={()=>this.sortByRising()} title="Rising"></Button>
                    <Button onPress={()=>this.sortByNew()} title="New"></Button>
                    <Button onPress={()=>this.sortByTop()} title="Top"></Button>
                </View>
                <ScrollView style = {styles.data}>
                    {!this.state.isLoading ?<Text>{this.state.formatedData}</Text>:null}
                </ScrollView>
            </View>
            
        )
    }
}
