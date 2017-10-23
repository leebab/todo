import React, { Component } from 'react';
import stateCopy from './stateCopy';
import {signIn,signUp,sendResetPasswordEmail} from './leanCloud';
import './UserDialog.css';

export default class UserDialog extends Component {

    constructor(props){
        super(props)
        this.state = {
            selected: 'signIn',
            selectedTab: 'signInOrsignUp',
            formatData: {
                email : '',
                username : '',
                password : ''
            }
        }
    }
    render(){
        let signInForm = (
            <form onSubmit={this.signIn.bind(this)}>
                <div className="input-outer">
                    <span className="user-icon"></span>
                    <input type="text" placeholder="用户名" value={this.state.formatData.username}
                    onChange={this.changeFormatData.bind(this,'username')}/>
                </div>
                <div className="input-outer">
                    <span className="pwd-icon"></span>
                    <input type="password" placeholder="密码" value={this.state.formatData.password}
                    onChange={this.changeFormatData.bind(this,'password')}/>
                </div>
                <div className="submit">
                    <button type="submit">登录</button>
                </div>
                <div className="help">
                    <a href="javascript:;" onClick={this.showForgotPasswordForm.bind(this)}>忘记密码?</a>
                    <a href="javascript:;" onClick={this.switch.bind(this)}>注册!</a>
                </div>
            </form>
        )
        let signUpForm = (
            <form onSubmit={this.signUp.bind(this)}>
                <div className="input-outer">
                    <span className="email-icon"></span>
                    <input type="text" placeholder="邮箱" value={this.state.formatData.email}
                    onChange={this.changeFormatData.bind(this,'email')}/>
                </div>
                <div className="input-outer">
                    <span className="user-icon"></span>
                    <input type="text" placeholder="用户名" value={this.state.formatData.username}
                    onChange={this.changeFormatData.bind(this,'username')}/>
                </div>
                <div className="input-outer">
                    <span className="pwd-icon"></span>
                    <input type="password" placeholder="密码" value={this.state.formatData.password}
                    onChange={this.changeFormatData.bind(this,'password')}/>
                </div>
                <div className="submit">
                    <button type="submit">注册</button>
                </div>
                <div className="help">
                    <a href="javascript:;" onClick={this.switch.bind(this)}>返回登录!</a>
                </div>
            </form>
        )
        let ForgotPasswordForm = (
            <div className="panes">
                <form onSubmit={this.resetPassword.bind(this)}>
                    <div className="input-outer">
                        <span className="email-icon"></span>
                        <input type="text" placeholder="邮箱" value={this.state.formatData.email}
                        onChange={this.changeFormatData.bind(this,'email')}/>
                    </div>
                    <div className="submit">
                        <button type="submit">发送重置邮件</button>
                    </div>
                    <div className="help">
                        <a href="javascript:;" onClick={this.showForgotPasswordForm.bind(this)}>返回登录!</a>
                    </div>
                </form>
            </div>
        )
        let signInOrsignUp = (
            <div className="panes">
                {this.state.selected === 'signIn' ? signInForm : null}
                {this.state.selected === 'signUp' ? signUpForm : null}
            </div>
        )
        return (
            <div className="UserDialog-Wrapper">
                <div className="UserDialog">
                    {this.state.selectedTab === 'signInOrsignUp' ? <h1>{this.state.selected === 'signIn' ? "登录" : "注册"}</h1>
                    : <h1>密码重置</h1>}
                    {this.state.selectedTab === 'signInOrsignUp' ? signInOrsignUp : null}
                    {this.state.selectedTab === 'ForgotPassword' ? ForgotPasswordForm : null}
                </div>
            </div>
        )
    }

    switch(){
        this.setState({
            selected: (this.state.selected === 'signIn' ? 'signUp' : 'signIn')
        })
    }
    showForgotPasswordForm(){
        this.setState({
            selectedTab: (this.state.selectedTab === 'signInOrsignUp' ? 'ForgotPassword' : 'signInOrsignUp')
        })
    }
    changeFormatData(key,e){
        let stateCopy_ = stateCopy(this.state)
        stateCopy_.formatData[key] = e.target.value
        this.setState(stateCopy_)
    }
    signIn(e){
        e.preventDefault()
        if (this.state.formatData.username === '' || this.state.formatData.password === '') {
            alert('用户名和密码不能为空！请重新输入')
            return
        }
        let successFn = (user) => {
            this.props.onSignIn.call(null,user)
        }
        let errorFn = (error) => {
            switch(error.code){
                case 201:
                alert('没有提供密码，或者密码为空。')
                break
                case 210:
                alert('用户名与密码不匹配')
                break
                case 211:
                alert('找不到用户。')
                break
                default:
                alert(error)
            }
        }
        signIn(this.state.formatData.username,this.state.formatData.password,successFn,errorFn)
    }
    signUp(e){
        e.preventDefault()
        if (!fChkMail(this.state.formatData.email)) {
            alert('邮箱格式错误！请重新输入')
            return
        }
        if (this.state.formatData.username === '' || this.state.formatData.password === '') {
            alert('用户名和密码不能为空！请重新输入')
            return
        }
        let {email,username,password} = this.state.formatData
        let successFn = (user) => {
            this.props.onSignIn.call(null,user)
        }
        let errorFn = (error)=>{
            switch(error.code){
                case 201:
                    alert('没有提供密码，或者密码为空')
                    break
                case 202:
                    alert('用户名已被占用')
                    break
                case 217:
                    alert(' 无效的用户名，不允许空白用户名')
                    break
                case 218:
                    alert(' 无效的密码，不允许空白密码')
                    break
                default:
                    alert(error)
            }
        }
        signUp(email,username,password,successFn,errorFn)
    }
    resetPassword(e){
        e.preventDefault()
        if (!fChkMail(this.state.formatData.email)) {
            alert('邮箱格式错误！请重新输入')
            return
        }
        let successFn = (success) => {
            if (success) {
                if (window.confirm('密码重置链接发送成功，请及时查看邮箱！是否返回登录界面？')) {
                    this.showForgotPasswordForm()
                }
            }
        }
        let errorFn = (error) => {
            alert('请确认邮箱是否正确')
        }
        sendResetPasswordEmail(this.state.formatData.email,successFn,errorFn)
    }
}

function fChkMail(szMail){ 
    var szReg=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/; 
    var bChk=szReg.test(szMail);
    return bChk; 
} 