
import {ajax, isLogin} from '../utils/ajax.js'
import '../lib/jquery.js'
import {pwdTest} from '../utils/reg.js'


(async () => {
    //判断是否登录
    let {status, user, token} = await isLogin();
    if (status != 1) {
        alert('请先登录！');
        location.href = './login.html';
    }

    //表单提交时触发
    $('form').on('submit', async e => {
        //阻止默认提交
        e.preventDefault();
        //获取输入的数据
        let oldPassword = $('.oldpassword').val();
        let newPassword = $('.newpassword').val();
        let rNewPassword = $('.rnewpassword').val();

        //判断是否是空串
        if (oldPassword == '') return alert('旧密码不能为空');
        if (newPassword == '') return alert('新密码不能为空');
        if (rNewPassword == '') return alert('确认新密码不能为空');
        //正则校验
        if (!pwdTest(newPassword)) return alert('新密码格式错误');
        //两次密码是否一致
        if (newPassword != rNewPassword) return alert('两次密码不一致');

        //发送的数据
        let data = {id: user.id, oldPassword, newPassword, rNewPassword};
        let {data: {code}} = await ajax.post('/users/rpwd', data, {headers: {authorization: token}});
        if (code != 1) return alert('修改失败');

        //修改密码后会自动注销，删本地存储
        localStorage.removeItem('token');
        localStorage.removeItem('uid');
        //重新登陆
        alert('修改成功，点击确定跳转至登录页面');
        location.href = './login.html';
    })
})();