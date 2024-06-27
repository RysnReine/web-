
import '../lib/jquery.js'
import {ajax} from '../utils/ajax.js'

let listBox = $('.list');  //商品列表
let categoryBox = $('.category');  //分类
let filterBox = $('.filterBox').first();  //热销/折扣
let saleBox = $('.saleBox');  //打几折
let sortBox = $('.sortBox');  //排序
let searchBox = $('.search');  //查询

//首页末页，上一页下一页
let firstBtn = $('.first');
let prevBtn = $('.prev');
let nextBtn = $('.next');
let lastBtn = $('.last');

let totalBox = $('.total');  // 当前页 / 总页数
let pagesizeBox = $('.pagesize');  //一页多少条数据
let jumpBox = $('.jump');  //跳转的那个输入值的那个
let jumpBtn = $('.go');  //跳转按钮

let totalPage;  //总页数
//请求发送的数据
let data = {
    current: 1,  //当前页
    pagesize: 12,  //一页多少条数据显示
    search: '',  //模糊搜索关键字
    filter: '',  //hot,sale,''  空字符串表示全部 (热销/折扣)筛选
    saleType: 10,  //折扣类型 5~10
    sortType: 'id',  // id || sale || price排序类型
    sortMethod: 'ASC',  // ASC 正序, DESC 倒序
    category: '',  //分类  空字符串表示全部
}

//渲染分类列表
async function renderCategory(){
    //请求 category 获取分类列表
    let {data: {code, list}} = await ajax.get('/goods/category');
    if (code != 1) return console.log('获取分类列表失败');

    //清空原本的
    categoryBox.empty();
    let str = `<li class="active">全部</li>`;
    //遍历分类列表添加
    list.forEach(e => str += `<li>${e}</li>`);
    //渲染到页面上
    categoryBox.html(str);
}
renderCategory();

//渲染商品列表
async function renderList() {
    //发送 data，请求商品列表
    let {data: {code, list, total}} = await ajax.get('/goods/list', {params: data});
    if (code != 1) return console.log('获取商品列表失败');

    //渲染列表
    let str = ``;
    list.forEach(e => {
        str += `<li data-id="${e.goods_id}">
                    <div class="show">
                        <img src="${e.img_big_logo}">
                        ${e.is_hot ? '<span class="hot">热销</span>' : ''}
                        ${e.is_sale ? '<span>折扣</span>' : ''}
                    </div>
                    <div class="info">
                        <p class="title">${e.title}</p>
                        <p class="price">
                            <span class="curr">¥ ${e.current_price}</span>
                            <span class="old">¥ ${e.price}</span>
                        </p>        
                    </div>
                </li>`
    })
    //没有时显示 nothing 图片，并且页数为 0
    if (list.length == 0) {
        data.current = 0;
        str = '<img src="../img/no.png" alt="">';
    }
    listBox.html(str);

    // 当前页 / 总页数
    totalPage = total;
    totalBox.text(`${data.current} / ${totalPage}`);
    //跳转改为当前页
    jumpBox.val(`${data.current}`);

    //把首页，末页，上一页，下一页全部设置成能按
    prevBtn.removeClass('disable');
    nextBtn.removeClass('disable');
    firstBtn.removeClass('disable');
    lastBtn.removeClass('disable');
    //判断当前页在哪， <= 1 首页跟上一页就不能按
    if (data.current <= 1) {
        prevBtn.addClass('disable');
        firstBtn.addClass('disable');
    }
    // 最后一页时下一页跟末页就不能按
    if (data.current == totalPage) {
        nextBtn.addClass('disable');
        lastBtn.addClass('disable');
    }
}
renderList();

//分类
categoryBox.on('click', ({target}) => {
    if (target.nodeName == 'LI') {
        //所有 <li> 删除 active 类
        categoryBox.children().removeClass('active');
        //点击的那个 li 加上 active
        target.classList.add('active');
        //获取点击的文本
        let str = target.innerText;
        if (str == '全部') str = '';
        //修改 data 的 category 属性
        data.category = str;
        //重新渲染
        renderList();
    }
})

//首页 末页
firstBtn.on('click', () => {
    //将当前页设为 1，重新渲染
    data.current = 1;
    renderList();
})
lastBtn.on('click', () => {
    data.current = totalPage;
    renderList();
})
//上一页 下一页
prevBtn.on('click', () => {
    if (data.current > 1) data.current--;
    renderList();
})
nextBtn.on('click', () => {
    if (data.current < totalPage) data.current++;
    renderList();
})
//跳转
jumpBtn.on('click', () => {
    //获取跳转页的值
    let target = jumpBox.val();
    //判断是否在范围内
    if (target < 1 || target > totalPage) return alert('跳转页不存在');
    //将当前页标为要跳转的页数
    data.current = target;
    renderList();
})

//一页显示几条
pagesizeBox.on('change', () => {
    //获取值
    data.pagesize = pagesizeBox.val();
    data.current = 1;
    renderList();
})

// 热销/折扣
filterBox.on('click', ({target}) => {
    if (target.nodeName == 'LI') {
        filterBox.children().removeClass('active');
        //当前点击的 li 添加 active
        target.classList.add('active');
        //获取分类类型
        data.filter = target.dataset.type;
        data.current = 1;
        renderList();
    }
})
//几折
saleBox.on('click', ({target}) => {
    if (target.nodeName == 'LI') {
        saleBox.children().removeClass('active');
        target.classList.add('active');
        data.saleType = target.dataset.type;
        data.current = 1;
        renderList();
    }
})

//排序
sortBox.on('click', ({target}) => {
    if (target.nodeName == 'LI') {
        sortBox.children().removeClass('active');
        target.classList.add('active');
        //获取排序类型（id、折扣、价格）
        data.sortType = target.dataset.type;
        //获取排序方法（正序、倒序）
        data.sortMethod = target.dataset.method;
        data.current = 1;
        renderList();
    }
})

//搜索
searchBox.on('input', () => {
    //当搜索框输入时，获取值
    data.search = searchBox.val();
    data.current = 1;
    //重新渲染
    renderList();
})

//商品详情
listBox.on('click', ({target}) => {
    if (target.nodeName == 'LI') {
        //获取点击的商品的 id
        let id = target.dataset.id;
        //存在会话里面
        sessionStorage.setItem('id', id);
        //跳转到详情页
        location.href = './detail.html';
    }
})