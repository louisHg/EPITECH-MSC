import React from "react"
import "./YoutubeChannel.css"

export default class YoutubeChannel extends React.Component {
    state = {
        data:'',
    }
    
    componentDidMount() {
        this.callAPI() 
        this.interval = setInterval(()=> {
            this.callAPI();
            console.log("updated youtubeChannel")
        },30000)
    }
    componentWillUnmount(){
        clearInterval(this.interval)
    }
    
    async callAPI(){

        const regex = new RegExp("/channel/([0-9a-zA-Z]+)","g")
        var channelID = regex.exec(this.props.channelLink)

        await fetch(`http://localhost:8081/api/youtube_channel?channel=`+ channelID[1])
            .then((res)=>res.text())
            .then((res)=>this.setState({data : JSON.parse(res)}))

    }
    createRows(props){
        for(let i = 0 ; i < props.length ; i++){
            var date = new Date(props[i].snippet.publishTime)
            props[i].snippet.publishTime = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        }   
        return props.map((video)=> {
            return <div className="videoList" key={video.id.videoId} onClick={()=>window.open("https://www.youtube.com/watch?v=" + video.id.videoId)}>
                            <img className="channelVideoImg" src={video.snippet.thumbnails.medium.url} alt=""/>
                        <div className="channelVideoDesc">
                            {video.snippet.title} <br/>
                            {video.snippet.publishTime}<br/>
                        </div>
                    </div>})
    }

    render() {
      return (
        <div className='YoutubeChannel'>
                {this.state.data? <h2 className="youtubeTitle">{this.state.data[0].snippet.channelTitle }</h2>:null}
                {this.state.data? this.createRows(this.state.data):null}
        </div>
      )
    }
  }