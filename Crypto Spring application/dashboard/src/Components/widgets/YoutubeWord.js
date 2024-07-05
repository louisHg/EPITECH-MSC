import React from "react"
import "./YoutubeWord.css"

export default class YoutubeWord extends React.Component {
    state = {
        data:''
    }
    
    componentDidMount() {
        this.callAPI() 
        this.interval = setInterval(()=> {
            this.callAPI();
            console.log("updated youtubeSearch")
        },30000)
    }
    componentWillUnmount(){
        clearInterval(this.interval)
    }
    
    async callAPI(){

        await fetch(`http://localhost:8081/api/youtube_search?keyword=`+ this.props.search_word)
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
                            {video.snippet.channelTitle}<br/>
                            {video.snippet.publishTime}<br/>
                        </div>
                    </div>})
    }

    render() {
      return (
        <div className='youtubeSearch'>
            <h2 className="youtubeTitle">{ decodeURI(this.props.search_word)}</h2>
            {this.state.data? this.createRows(this.state.data):null}
        </div>
      )
    }
  }