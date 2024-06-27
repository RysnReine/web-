
import {ajax} from '../utils/ajax.js'
import '../lib/jquery.js'

//渲染函数
async function render() {
    //如果没有商品的 id，报非法访问，并且跳回商品列表页
    let id = sessionStorage.getItem('id');
    if (!id) {
        alert('非法访问');
        return location.href = './list.html';
    }

    //请求商品详细信息
    let {data: {code, info}} = await ajax.get(`/goods/item/${id}`);
    if (code != 1) {
        alert('获取商品详情失败');
        return location.href = './list.html';
    }

    //设置名称，图片
    $('.title').text(info.title);
    $('.middleimg').attr('src', info.img_big_logo);
    $('.desc').html(info.goods_introduce);
    //原价，折扣，当前价格
    $('.old').text(info.price);
    $('.discount').text(info.current_price / info.price);
    $('.curprice').text(info.current_price);
}
render();