import CryptoChart from "../../Components/widgets/CryptoChart"
import MeteoCard from "../../Components/widgets/MeteoCard"
import RedditThreadsCard from "../../Components/widgets/RedditThreadsCard"
import RedditSubData from "../../Components/widgets/RedditSubData"
import CryptoGraph from "../../Components/widgets/CryptoGraph"
import YoutubeChannel from "../../Components/widgets/YoutubeChannel"
import YoutubeWord from "../../Components/widgets/YoutubeWord"
import React from "react"
import axios from "axios"
import "./home.css"

export default class Home extends React.Component {
    state = {
      features:'',
      cleanFeatures:'',
      username:''
    }
  
    componentDidUpdate() {
        if(this.state.username === ''){
            this.setState({username : this.props.username})
        }
        else{
            if(this.state.features === ''){
                this.callApi()
            }           
        }
    }
        
    async callApi(){
        await axios.get('http://localhost:8081/api/user_features?username=' + this.props.username)
        .then((res) => this.setState({ features : res }))
        .then(()=>this.changeFeatures())
    }
    changeFeatures(){
      this.setState({cleanFeatures : this.state.features.data.features})
      console.log(this.state.cleanFeatures)
    }
  
    render() {
      return (
        <div className="mainPage">
          {this.state.cleanFeatures ? 
          <div>
            {this.state.cleanFeatures.meteo.enabled? <div><MeteoCard town={this.state.cleanFeatures.meteo.city}/></div>: null}
             <div className="Crypto">
              {this.state.cleanFeatures.crypto.cryptoChart? <div><CryptoChart coin={this.state.cleanFeatures.crypto.coins}/></div> :null}
              {this.state.cleanFeatures.crypto.cryptoGraph? <div><CryptoGraph coin={this.state.cleanFeatures.crypto.coins}/></div> :null}
            </div>
            <div className="Reddit">
              {this.state.cleanFeatures.reddit.subThreads? <div><RedditThreadsCard sub={this.state.cleanFeatures.reddit.subreddit}/></div>: null}
              {this.state.cleanFeatures.reddit.subData? <div><RedditSubData sub={this.state.cleanFeatures.reddit.subreddit}/></div>:null}
            </div>
            <div className="Youtube">
                {this.state.cleanFeatures.youtube.youtubeChannel.enabled? <div><YoutubeChannel channelLink={this.state.cleanFeatures.youtube.youtubeChannel.channel}/></div>:null}
                {this.state.cleanFeatures.youtube.youtubeSearch.enabled? <div><YoutubeWord search_word={this.state.cleanFeatures.youtube.youtubeSearch.search}/></div>:null}
            </div>
          </div>
          :null}
        </div>
      )
    }
  }
