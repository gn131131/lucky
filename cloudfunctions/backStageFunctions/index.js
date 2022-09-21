const queryActivityListByPage = require('./activity/queryListByPage');
const queryActivityById = require('./activity/queryById');
const saveActivity = require('./activity/save');
const updateActivity = require('./activity/update');
const deleteActivity = require('./activity/delete');
const deleteActivityById = require('./activity/deleteById');
const updateParticipateUser = require('./activity/updateParticipateUser');

const queryWinListByPage = require('./win/queryListByPage');

const queryUserListByPage = require('./user/queryListByPage');
const changeAvatarStatus = require('./user/changeAvatarStatus');

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
    // 批量删除活动
    case '/activity/delete':
      return await deleteActivity.main(event, context);
    // 根据id删除活动
    case '/activity/deleteById':
      return await deleteActivityById.main(event, context);
    // 更新参与用户信息
    case '/activity/updateParticipateUser':
      return await updateParticipateUser.main(event, context);

    // 获取中奖列表
    case '/win/queryListByPage':
      return await queryWinListByPage.main(event, context);
      
    // 获取用户列表
    case '/user/queryListByPage':
      return await queryUserListByPage.main(event, context);
    // 修改头像状态
    case '/user/changeAvatarStatus':
      return await changeAvatarStatus.main(event, context);

    // 获取模板列表
    case '/template/queryList':
      return await queryTemplateList.main(event, context);
  }
};
