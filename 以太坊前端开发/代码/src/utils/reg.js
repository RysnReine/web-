// 正则校验函数(基础柯里化)
function regTest(reg) {
    return (value) => {
        return reg.test(value)
    }
}
//用户名 开头小写字母或数字，后面在跟 3-11 个数字字母下划线
let nameTest = regTest(/^[a-z0-9]\w{3,11}$/);
//密码 6-12 个数字字母下划线
let pwdTest = regTest(/\w{6,12}/);
//昵称 2-5 个汉字
let nickTest = regTest(/^[\u4e00-\u9fa5]{2,5}$/);
//年龄 1-120
let ageTest = regTest(/^([1-9]\d?|1[01]\d|120)$/);
//性别 男/女
let sexTest = regTest(/^(男|女)$/);

//导出
export { nameTest, pwdTest, nickTest, ageTest, sexTest }