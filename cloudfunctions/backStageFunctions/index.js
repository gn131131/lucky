const queryActivityListByPage = require('./activity/queryListByPage');
const queryActivityById = require('./activity/queryById');
const saveActivity = require('./activity/save');
const updateActivity = require('./activity/update');
const deleteActivity = require('./activity/delete');

const queryWinListByPage = require('./win/queryListByPage');

const queryUserListByPage = require('./user/queryListByPage');

const queryTemplateList = require('./template/queryList');


// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.url) {
    // 获取活动列表
    case '/activity/queryListByPage':
      return await queryActivityListByPage.main(event, context);
    // 查看活动详情
    case '/activity/queryById':
      return await queryActivityById.main(event, context);
    // 新增活动
    case '/activity/save':
      return await saveActivity.main(event, context);
    // 编辑活动
    case '/activity/update':
      return await updateActivity.main(event, context);
    // 删除活动
    case '/activity/delete':
      return await deleteActivity.main(event, context);

    // 获取中奖列表
    case '/win/queryListByPage':
      return await queryWinListByPage.main(event, context);
      
    // 获取用户列表
    case '/user/queryListByPage':
      return await queryUserListByPage.main(event, context);

    // 获取模板列表
    case '/template/queryList':
      return await queryTemplateList.main(event, context);
  }
};
