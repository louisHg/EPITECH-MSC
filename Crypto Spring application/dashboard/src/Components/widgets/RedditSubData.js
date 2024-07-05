import React from "react"
import "./RedditSubData.css"

export default class RedditSubData extends React.Component {
    state = {
        data:''
    }
    
    componentDidMount() {
        this.callAPI() 
        this.interval = setInterval(()=> {
            this.callAPI();
            console.log("updated redditSubData")
        },30000)
    }
    componentWillUnmount(){
        clearInterval(this.interval)
    }
    
    async callAPI(){
        await fetch(`http://localhost:8081/api/subreddit_data?sub=`+ this.props.sub)
            .then((res)=>res.text())
            .then((res)=>JSON.parse(res))
            .then((res)=>this.setState({data : res}))
    }
    render() {
      return (
        <div className='redditData'>
            {this.state.data? 
                <div>
                    <h2>{ decodeURI(this.state.data.title)}</h2>
                    <img id="subBanner" src={this.state.data.banner_img} alt=""/>
                    <p>
                        Current users : {this.state.data.current_users} <br/>
                        {this.state.data.total_subscribers}<br/>
                    </p>
                </div>
                :null}
        </div>
      )
    }
  }