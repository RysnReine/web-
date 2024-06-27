
import '../lib/jquery.js'
import {ajax} from '../utils/ajax.js'
//导入用户名与密码正则校验
import { nameTest, pwdTest } from "../utils/reg.js";

//当表单提交时
$('form').on('submit', async e => {
    //阻止默认提交行为
    e.preventDefault();
    //获取参数
    let username = $('.username').val();
    let password = $('.password').val();

    //不能是空串
    if (username == '' || password == '') return alert('表单不能为空');
    //用户名格式验证
    if (!nameTest(username)) return alert('用户名格式错误');
    //密码格式验证
    if (!pwdTest(password)) return alert('密码格式错误');

    // post 请求登录，带上用户名跟密码
    let {data: {code, message, token, user}} = await ajax.post('/users/login', {username, password});
    //登录失败，显示错误信息
    if (code != 1) {
        if (message == '用户名或密码错误') $('.error').css('display', 'block');
        //可能是被冻结，输出联系管理员
        else alert(message);
        return;
    }
    //登录成功，保存 token 跟 id
    localStorage.setItem('token', token);
    localStorage.setItem('uid', user.id);
    //跳转到主页
    location.href = './index.html';
})