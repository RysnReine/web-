
import {ajax, isLogin} from '../utils/ajax.js'
import '../lib/jquery.js'
import {nickTest, sexTest, ageTest} from '../utils/reg.js'

(async () => {
    //经典判断是否登录
    let {status, user, token} = await isLogin();
    if (status != 1) {
        alert('请先登录！');
        location.href = './login.html';
    }
    
    //将原本的个人数据渲染上去
    $('.username').val(user.username);
    $('.age').val(user.age);
    $('.gender').val(user.gender);
    $('.nickname').val(user.nickname);

    //当表单提交时
    $('form').on('submit', async e => {
        //阻止默认行为
        e.preventDefault();

        //获取输入的数据
        let age = $('.age').val();
        let gender = $('.gender').val();
        let nickname = $('.nickname').val();

        //判断个数据是否是空串
        if (age == '') return alert('年龄不能为空');
        if (gender == '') return alert('性别不能为空');
        if (nickname == '') return alert('昵称不能为空');
        //正则校验
        if (!ageTest(age)) return alert('年龄格式错误');
        if (!sexTest(gender)) return alert('性别格式错误');
        if (!nickTest(nickname)) return alert('昵称格式错误');

        //要给服务器传递的数据
        let data = {id: user.id, age, gender, nickname};
        //请求 update 接口，更新用户信息
        let {data: {code}} = await ajax.post('/users/update', data, {headers: {authorization: token}});
        if (code != 1) return alert('修改失败');
        alert('修改成功');
    })
})();