import React,{Component} from 'react';
import stateCopy from './stateCopy';
import './MainHeader.css'

export default class MainHeader extends Component {
    constructor(props){
        super(props)
        this.state = {
            edit: ''
        }
    }
    render(){
        return (
            <div className="MainHeader">
                <div className="header-content">
                    {this.state.edit ? <input className="groupInput" onBlur={this.changeGroupName.bind(this)} 
                    defaultValue={this.props.groupName} onKeyPress={this.submit.bind(this)}/> 
                    : <h1 onClick={this.switch.bind(this)}>{this.props.groupName}</h1>}
                </div>
            </div>            
        )
    }
    submit(e){
        if(e.key === 'Enter'){
            this.changeGroupName(e)
        }
    }
    changeGroupName(e){
        var stateCopy_ = stateCopy(this.state)
        stateCopy_.edit = ''
        this.setState(stateCopy_)

        if (e.target.value === this.props.groupName) {
            return
        }
        if (this.props.groupName === '默认分组') {
            alert('默认分组不可修改')
            return
        }
        this.props.onChange.call(null,e)
    }
    switch(){
        var stateCopy_ = stateCopy(this.state)
        stateCopy_.edit = 'edit'
        this.setState(stateCopy_)
    }
    componentDidUpdate(){
        if (document.getElementsByClassName('groupInput')[0]) {
           document.getElementsByClassName('groupInput')[0].focus() 
        }
    }
}
