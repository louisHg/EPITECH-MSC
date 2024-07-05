import React from "react"

export default class AboutJson extends React.Component {
    state = {
        data:'',
        apiKey : '2063ab0c816c49ba892d7eca2e6bd577',
        clientI : '',
        changedData: false
    }
    
    componentDidMount() {
        this.callAPI() 
    }
    
    async callAPI(){
        await fetch('https://ipgeolocation.abstractapi.com/v1/?api_key=' + this.state.apiKey)
        .then((res)=>res.text())
        .then((res)=>this.setState({data : JSON.parse(res)}))
        .then(()=>this.changeData())
    }
    changeData(){
        var date = new Date;
        this.props.props.client.host = this.state.data.ip_address;
        this.props.props.server.current_time = date.getTime()
        this.setState({ changeData : true})
    }

    render() {
      return (
        <div><pre>{this.state.data? JSON.stringify(this.props.props,null,2) :null}</pre></div>
      )
    }
  }