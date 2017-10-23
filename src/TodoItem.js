import React,{Component} from 'react';
import './iconfont/iconfont.css';
import './TodoItem.css';

export default class TodoItem extends Component {
    render(){
        return (
            <div className="todoItem">
                {this.props.todo.status === 'completed' ?  
                <button className="iconfont completed color" onClick={this.toggle.bind(this)}>&#xe671;</button>
                : <button className="iconfont completed" onClick={this.toggle.bind(this)}>&#xe670;</button>}
                {this.props.todo.status === 'completed' ?  
                <span className="title through">{this.props.todo.title}</span>
                : <span className="title">{this.props.todo.title}</span>}
                <button className="iconfont close" onClick={this.delete.bind(this)}>&#xe63c;</button>
            </div>
        )
    }

    toggle(e){
        this.props.onToggle(e,this.props.todo)
    }
    delete(e){
        this.props.onDelete(e,this.props.todo)
    }
}