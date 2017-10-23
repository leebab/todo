import React,{Component} from 'react';

export default class ListItem extends Component {
    render(){
        return (
                <div className={this.props.group.selected ? "ListItem active" : "ListItem"} onClick={this.SelectGroup.bind(this)}>
                    <span className="iconfont icon">&#xe641;</span>
                    <span className="listname">{this.props.group.groupName}</span>
                    <span className="groupdeleted iconfont" onClick={this.delete.bind(this)}>&#xe624;</span>
                </div>
        )
    }
    delete(e) {
        e.stopPropagation()
        this.props.onDelete.call(null,this.props.group)
    }
    SelectGroup(){
        this.props.onSelected.call(null,this.props.group)
    }
}