import React from 'react';
import './iconfont/iconfont.css';
import './TodoInput.css';

export default function(props){
    return (
        <div className="todoInput">
            <span className="iconfont icon">&#xe604;</span>
            <input type="text" value={props.content} onChange={changeContent.bind(this,props)}
             placeholder="please input you todo" onKeyPress={submit.bind(this,props)}/>
        </div>
    )
}

function submit(props,e){
    if (e.key === 'Enter') {
        if (e.target.value.trim() !== '') {
            props.onSubmit.call(null,e)
        }
    }
}

function changeContent(props,e){
    props.onChange(e)
}