import React,{ Component } from 'react';
import ListItem from './ListItem';
import './iconfont/iconfont.css';
import './List.css';
export default class List extends Component {
    constructor(props){
        super(props)
        this.state = {
            currentGroup: ''
        }
    }
    render(){
        let list = this.props.todoGroup.filter((item) => !item.deleted).map((item,index) => {
            return (
            <li key={index}>
                <ListItem group={item} onDelete={this.deleteGroup.bind(this)} onSelected={this.props.getCurrentGroup}/>
            </li>
            )
        })
        return (
            <ul className="todoGroup">
              {list}
            </ul>
        )
    }
    deleteGroup(group){
        let isDelete = window.confirm('Delete the group and all todo under it ?');
        if (isDelete) {
            this.props.deleteGroup.call(null,group)
        }
    }
}