
import '../lib/jquery.js'
import {ajax} from '../utils/ajax.js'
import { nameTest, pwdTest, nickTest } from "../utils/reg.js";

//当表单提交时
$('form').on('submit', async e => {
    //阻止默认行为
    e.preventDefault();

    //获取表单
    let username = $('.username').val();
    let password = $('.password').val();
    let rpassword = $('.rpassword').val();
    let nickname = $('.nickname').val();

    //验证空串以及格式
    if (username == '' || password == '' || rpassword == '' || nickname == '') return alert('表单不为空');
    if (!nameTest(username)) return alert('用户名格式错误');
    if (!pwdTest(password)) return alert('密码格式错误');
    if (!nickTest(nickname)) return alert('昵称格式错误');
    //两个密码是否一致
    if (password != rpassword) return alert('两次密码不一致');

    //发送的数据
    let data = {username, password, rpassword, nickname}
    let {data: {code}} = await ajax.post('/users/register', data);
    //失败
    if (code != 1) return $('.error').css('display', 'block');
    //成功跳转到登录页面
    alert('注册成功跳转登录页面')
    location.href = './login.html';
})