const queryActivityListByPage = require('./activity/queryListByPage');
const queryActivityById = require('./activity/queryById');
const checkCode = require('./activity/checkCode');
const participate = require('./activity/participate');
const watch = require('./activity/watch');
const draw = require('./activity/draw');

const queryHistoryListByPage = require('./history/queryListByPage');

const queryWinListByPage = require('./win/queryListByPage');

const saveUser = require('./user/save');
const checkLogon = require('./user/checkLogon');

const verify = require('./admin/verify');


// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.url) {
    // 获取活动列表
    case '/activity/queryListByPage':
      return await queryActivityListByPage.main(event, context);
    // 查看活动详情
    case '/activity/queryById':
      return await queryActivityById.main(event, context);
    // 验证活动码是否正确
    case '/activity/checkCode':
      return await checkCode.main(event, context);
    // 参加活动
    case '/activity/participate':
      return await participate.main(event, context);
    // 围观活动
    case '/activity/watch':
      return await watch.main(event, context);
    // 抽奖
    case '/activity/draw':
      return await draw.main(event, context);
      
    // 获取活动历史记录列表
    case '/history/queryListByPage':
      return await queryHistoryListByPage.main(event, context);

    // 获取中奖列表
    case '/win/queryListByPage':
      return await queryWinListByPage.main(event, context);

    // 新增用户
    case '/user/save':
      return await saveUser.main(event, context);
    // 登录（查看用户是否已注册）
    case '/user/checkLogon':
      return await checkLogon.main(event, context);

    // 验证密码
    case '/admin/verify':
      return await verify.main(event, context);
  }
};
