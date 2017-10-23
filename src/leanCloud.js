import AV from 'leancloud-storage';

var APP_ID = 'pti3lA6h2l7QEIqmItvUGcDO-gzGzoHsz';
var APP_KEY = '8PQtHLhO4Wm2zGDnNX5XOvFx';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});

export default AV;

export function signIn(username,password,successFn,errorFn) {
    AV.User.logIn(username, password).then(function (loginedUser) {
      let user = getUserFormAVUser(loginedUser)
      successFn.call(null,user)
    }, function (error) {
      errorFn.call(null,error)
    });
}
export function signUp(email,username,password,successFn,errorFn) {
    // 新建 AVUser 对象实例
    var user = new AV.User();
    // 设置用户名
    user.setUsername(username);
    // 设置密码
    user.setPassword(password);
    // 设置邮箱
    user.setEmail(email);
    user.signUp().then(function (loginedUser) {
        let user = getUserFormAVUser(loginedUser)
        successFn.call(null,user)
      }, function (error) {
        errorFn.call(null,error)
    });
}
export function signOut(){
  AV.User.logOut()
  return undefined
}
export function sendResetPasswordEmail(email,successFn,errorFn) {
    AV.User.requestPasswordReset(email).then(function (success) {
      successFn.call(null,success)
    }, function (error) {
      errorFn.call(null,error)
    });
}
function getUserFormAVUser(AVUser){
  return {
    id: AVUser.id,
    ...AVUser.attributes
  }
}
export function getCurrentUser(){
  let user = AV.User.current();
  if(user){
    return getUserFormAVUser(user)
  }else{
    return null
  }
}
export const Module = {
  createTodo({status,title,deleted,group},successFn,errorFn){
    let Todo = AV.Object.extend('Todo')
    let todo = new Todo()

    todo.set('title',title)
    todo.set('status',status)
    todo.set('deleted',deleted)
    todo.set('group',group)

    // 新建一个 ACL 实例
    let acl = new AV.ACL()
    acl.setPublicReadAccess(false)
    console.log(AV.User.current())
    acl.setWriteAccess(AV.User.current(),true)
    acl.setReadAccess(AV.User.current(),true)
    //将ACL实例赋予todo对象
    todo.setACL(acl)

    todo.save().then(function (response){
      successFn && successFn.call(null,response.id)
    },function(error){
      errorFn && errorFn.call(null,error)
    });
  },
  updateTodo({id,title,status,deleted,group},successFn,errorFn) {
    let todo = AV.Object.createWithoutData('Todo',id)
    title !== undefined && todo.set('title',title)
    status !== undefined && todo.set('status',status)
    deleted !== undefined && todo.set('deleted',deleted)
    group !== undefined && todo.set('group',group)
    todo.save().then((response) => {
      successFn && successFn.call(null,response)
    },(error) => {
      errorFn && errorFn.call(null,error)
    })
  },
  destroyTodo(todoId,successFn,errorFn){
    let todo = AV.Object.createWithoutData('Todo', todoId)
    todo.destroy().then(function(success){
      successFn && successFn.call(null)
    },function(error){
      errorFn && errorFn.call(null,error)
    })
  },
  createTodoGroup({groupName,selected,deleted},successFn,errorFn){
    let TodoGroup = AV.Object.extend('TodoGroup')
    let todoGroup = new TodoGroup()

    todoGroup.set('groupName',groupName)
    todoGroup.set('selected',selected)
    todoGroup.set('deleted',deleted)

    // 新建一个 ACL 实例
    let acl = new AV.ACL()
    acl.setPublicReadAccess(false)
    console.log(AV.User.current())
    acl.setWriteAccess(AV.User.current(),true)
    acl.setReadAccess(AV.User.current(),true)
    //将ACL实例赋予todo对象
    todoGroup.setACL(acl)

    todoGroup.save().then(function (response){
      console.log(response.id)
      successFn.call(null,response.id)
    },function(error){
      errorFn && errorFn.call(null,error)
    });
  },
  updateTodoGroup({id,groupName,selected,deleted},successFn,errorFn){
    let todoGroup = AV.Object.createWithoutData('TodoGroup', id)

    groupName !== undefined && todoGroup.set('groupName',groupName)
    // selected !== undefined && todoGroup.set('selected',selected)
    deleted !== undefined && todoGroup.set('deleted',deleted)
    todoGroup.save().then((response) => {
      successFn && successFn.call(null)
    },(error) => {
      errorFn && errorFn.call(null,error)
    })
  },
  destroyTodoGroup(groupId,successFn,errorFn){
    let todoGroup = AV.Object.createWithoutData('TodoGroup', groupId)
    todoGroup.destroy().then(function(success){
      successFn && successFn.call(null)
    },function(error){
      errorFn && errorFn.call(null,error)
    })
  },
  getTodoByUser(user,successFn,errorFn){
    let query = new AV.Query('Todo')
    query.find().then((response) => {
      let array = response.map((t) => {
        return{id:t.id,...t.attributes}
      })
      successFn.call(null,array)
    },(error) => {
      errorFn && errorFn.call(null,error)
    })
  },
  getTodoGroupByUser(user,successFn,errorFn){
    let query = new AV.Query('TodoGroup')
    query.find().then((response) => {
      let array = response.map((item) => {
        return {id:item.id,...item.attributes}
      })
      successFn.call(null,array)
    },(error) => {
      errorFn && errorFn.call(null,error)
    })
  }
}
