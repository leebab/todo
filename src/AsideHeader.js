import React,{Component} from 'react';
import './AsideHeader.css';
import './iconfont/iconfont.css';
export default class AsideHeader extends Component {

    render(){
        return (
            <div className="AsideHeader">
                <span className="avatar iconfont">&#xe601;</span>
                <span className="title">{this.props.username}</span>
                <botton className="exit iconfont" title="退出" onClick={this.props.onSignOut}>&#xe61f;</botton>
            </div>
        )
    }
}