import React, { Component } from 'react';
import TodoInput from './TodoInput';
import TodoItem from './TodoItem';
import List from './List';
import AsideHeader from './AsideHeader';
import stateCopy from './stateCopy';
import MainHeader from './MainHeader';
import UserDialog from './UserDialog';
import {signOut,getCurrentUser,Module} from './leanCloud';
import 'normalize.css';
import './App.css';
import './reset.css';
import './iconfont/iconfont.css';


class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      newtodo: '',
      user: getCurrentUser() || {},
      todoGroup: [],
      currentGroup: {},
      todolist: []
    }
    let user = getCurrentUser()
    if (user) {
      Module.getTodoGroupByUser(user,(groups) => {
        let stateCopy_ = stateCopy(this.state)
        groups[0].selected = true
        stateCopy_.todoGroup = groups
        stateCopy_.currentGroup = groups[0]
        this.setState(stateCopy_)
      },(error) => {
        console.log(error)
      })

      Module.getTodoByUser(user,(todos) => {
        let stateCopy_ = stateCopy(this.state)
        stateCopy_.todolist = todos
        this.setState(stateCopy_)
      },(error) => {
        console.log(error)
      })
      
    }
  } 
  render() {
      let todos = this.state.todolist.filter((item) => !item.deleted && (item.group === this.state.currentGroup.groupName)).map((item,index) => {
      return <li key={item.id}><TodoItem todo={item} onToggle={this.toggle.bind(this)} onDelete={this.delete.bind(this)}/></li>
    })
    return (
      <div className="App">
        {this.state.user.id ? null : <UserDialog onSignIn={this.signInOrsignUp.bind(this)}
                                                 onSignUp={this.signInOrsignUp.bind(this)}/>}

        <div className="aside">
            <AsideHeader username={this.state.user.username} onSignOut={this.signOut.bind(this)}/>
            <div className="AsideContent innerbox">
              <List todoGroup={this.state.todoGroup} deleteGroup={this.deleteGroup.bind(this)} getCurrentGroup={this.getCurrentGroup.bind(this)}/>
              <div className="addlist" onClick={this.addList.bind(this)}>
                <span className="iconfont add">&#xe604;</span>
                <span>新建清单</span>
              </div>
            </div>
        </div>
        <div className="main">
          <div className="main-header">
            <MainHeader groupName={this.state.currentGroup.groupName} onChange={this.changeGroupName.bind(this)}/>
          </div>
          <div className="main-container">
            <div className="inputWrapper">
              <TodoInput content={this.state.newtodo} onChange={this.changeContent.bind(this)} onSubmit={this.addTodo.bind(this)}/>
            </div>
            <div className="todolist">
              <ul>
                {todos}
              </ul>
            </div>
          </div>
          <div className="main-bg"></div>
        </div>
        
      </div>
    );
  }

  signOut(){
    if (window.confirm('您确定要退出?')) {
      signOut()
    } else {
      return
    }
    
    let stateCopy_ = stateCopy(this.state)
    stateCopy_.user = {}
    this.setState(stateCopy_)
  }
  signInOrsignUp(user){
    let stateCopy_ = stateCopy(this.state)
    stateCopy_.user = user

      Module.getTodoGroupByUser(user,(groups) => {
        let stateCopy_ = stateCopy(this.state)
        groups[0].selected = true
        stateCopy_.todoGroup = groups
        stateCopy_.currentGroup = groups[0]
        this.setState(stateCopy_)
      },(error) => {
        console.log(error)
      })

      Module.getTodoByUser(user,(todos) => {
        let stateCopy_ = stateCopy(this.state)
        stateCopy_.todolist = todos
        this.setState(stateCopy_)
      },(error) => {
        console.log(error)
      })
      
      
      this.setState(stateCopy_)
  }
  changeGroupName(event){
    this.state.todoGroup.filter((item) => !item.deleted).map((item,index) => {
      if (item.groupName === event.target.value) {
        window.confirm("清单已存在，请重新修改")
        return
      }
    })
    
    let stateCopy_ = stateCopy(this.state)
    stateCopy_.todoGroup.map((item,index) => {
        if (item.groupName === this.state.currentGroup.groupName) {
          item.groupName = event.target.value
          Module.updateTodoGroup(item,(res) => {
            alert('修改成功')
          },(error) => {
            console.log(error)
            return
          })
        }
      })
    stateCopy_.currentGroup.groupName = event.target.value
    stateCopy_.todolist.filter((item) => item.group === this.state.currentGroup.groupName).map((item) => item.group = event.target.value)
    this.setState(stateCopy_)
  }

  getCurrentGroup(group){
    let stateCopy_ = stateCopy(this.state)
    stateCopy_.todoGroup.map((item,index) => {
      if (item.groupName === group.groupName) {
        item.selected = true
      }else{
        item.selected = false
      }
    })
    stateCopy_.currentGroup = group
    this.setState(stateCopy_)
  }
  toggle(e,todo){
    todo.status = todo.status === 'completed' ? '' : 'completed'
    Module.updateTodo(todo,(response) => {
      this.setState(this.state)
    },(error) => {
      console.log(error)
    })
  }

  delete(e,todo){
    Module.destroyTodo(todo.id,(res) => {
      todo.deleted = true
      this.setState(this.state)
    },(error) => {
      console.log(error)
    })
    todo.deleted = true
    this.setState(this.state)
  }
  addTodo(event){
    if (this.state.currentGroup.id) {
      let newtodo = {
        deleted: false,
        status: '',
        title: event.target.value,
        group: this.state.currentGroup.groupName
      }
      Module.createTodo(newtodo,(id) => {
        newtodo.id = id
        console.log(id)
      },(error) => {
        alert(error)
      })
      let stateCopy_ = stateCopy(this.state)
      stateCopy_.todolist.push(newtodo)
      stateCopy_.newtodo = ''
      this.setState(stateCopy_)
    } else {
      alert('请先新建分组或者选择一个分组')
      return
    }
    
  }
  changeContent(event){
    let stateCopy_ = stateCopy(this.state)
    stateCopy_.newtodo = event.target.value
    this.setState(stateCopy_)
  }
  deleteGroup(group){
    Module.destroyTodoGroup(group.id,(res) => {
      alert('删除成功')
      group.deleted = true
      let stateCopy_ = stateCopy(this.state)
      stateCopy_.todolist.filter((item) => item.group === group.groupName).map((item,index) => {
        item.deleted = true
        Module.destroyTodo(item.id)
      })
      stateCopy_.currentGroup = {}
      this.setState(stateCopy_)
    },(error) => {
      console.log(error)
    })
  }
  getGroupName(){
    let i = 1;
    while (this.check(i)) {
      i = i + 1
    }
    return '新建清单'+i;
  }
  check(i){
    let name = '新建清单'+i
    let flog = false
    this.state.todoGroup.filter((item) => !item.deleted).map((item,index) => {
      if (item.groupName === name) {
        flog = true
      }
    })
    return flog
  }
  addList(e){
    const newGroup = {
      groupName: this.getGroupName(),
      selected: false,
      deleted: false
    }
    Module.createTodoGroup(newGroup,(id) => {
      newGroup.id = id
      newGroup.selected = true
      let stateCopy_ = stateCopy(this.state)
      stateCopy_.todoGroup.map((item,index) => {
        item.selected = false
      })
      stateCopy_.currentGroup = newGroup
      stateCopy_.todoGroup.push(newGroup)
      this.setState(stateCopy_)
    },(error) => {
      alert(error)
    })
    
  }
}
export default App;
