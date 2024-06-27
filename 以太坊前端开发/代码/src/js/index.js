
import {ajax, isLogin} from '../utils/ajax.js'
import '../lib/jquery.js'
import '../lib/layui/layui.js';

(async () => {
    //用户是否登录
    let {status, user} = await isLogin();
    //如果登录了
    if (status == 1) {
        //切换显示
        $('.off').removeClass('active');
        $('.on').addClass('active');
    
        //昵称 个人中心
        $('.nickname').text(user.nickname);
        $('.self').on('click', () => location.href = './self.html')
        //退出登录
        $('.logout').on('click', async () => {
            //弹窗询问是否注销
            if (!confirm('确定要退出登录吗？')) return;
            //获取本地存储信息
            let id = localStorage.getItem('uid');
            let token = localStorage.getItem('token');
            //请求退出登录
            let {data: {code}} = await ajax.get('/users/logout', {params: {id}, headers: {authorization: token}});
            if (code != 1) return alert('注销失败');
            //删除本地存储数据
            localStorage.removeItem('token');
            localStorage.removeItem('uid');
            //切换显示
            $('.off').addClass('active');
            $('.on').removeClass('active');
        })
    }
})()

//渲染轮播图
async function render() {
    //获取轮播图列表
    let { data: { code, list } } = await ajax.get('/carousel/list');
    if (code != 1) return console.log('获取轮播图失败');
    
    let str = ``;
    //localhost:9000/轮播图名称 可以直接获取到
    list.forEach(e => str += `<div><img src="${ajax.defaults.baseURL}/${e.name}"></div>`);
    //渲染
    $('#carousel > :first-child').html(str);

    //渲染轮播图
    layui.carousel.render({
        elem: '#carousel', // 选择器
        width: '1200px', //设置容器宽度
        height: '600px',
        arrow: 'hover',
        anim: 'fade' //切换动画方式
    });
}
render();