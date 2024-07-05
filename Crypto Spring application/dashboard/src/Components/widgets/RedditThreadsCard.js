import React from "react"
import "./RedditThreadsCard.css"

export default class RedditThreadsCard extends React.Component {
    state = {
        data:''
    }
    
    componentDidMount() {
        this.callAPI() 
        this.interval = setInterval(()=> {
            this.callAPI();
            console.log("updated redditThread")
        },30000)
    }
    componentWillUnmount(){
        clearInterval(this.interval)
    }
    
    async callAPI(){
        await fetch(`http://localhost:8081/api/reddit_threads?subreddit=`+ this.props.sub)
            .then((res)=>res.text())
            .then((res)=>this.setState({data : JSON.parse(res)}))
    }

    redirectToThread(link){
        window.open("https://reddit.com" + link)
    }

    createRows(props){
        return props[this.props.sub].map((thread)=> {
            return <div className="thread" key={thread.link} onClick={()=>this.redirectToThread(thread.link)}>
                        {thread.title}<br/>
                        {thread.upvotes} upvotes {thread.comments} comments<br/>
                    </div>})
    }

    render() {
      return (
        <div className='frontpage'>
            <h2 className="subTitle">{this.props.sub}</h2>
            {this.state.data? this.createRows(this.state.data):null}
        </div>
      )
    }
  }