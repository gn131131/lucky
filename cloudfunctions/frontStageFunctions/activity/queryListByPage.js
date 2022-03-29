const cloud = require('wx-server-sdk');
const convert = require('../utils/convert');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 分页获取发布且启用的活动列表，包含奖品表
exports.main = async (event, context) => {
  try {
    const _ = db.command;
    const data = event.data; // 接收数据
    console.log('分页获取活动列表', data);
    const pageSize = data.page.pageSize;
    const pageNum = data.page.pageNum; // 分页数据
    // 查询参与信息
    let participateActivityIds = [];
    if (data.userId) {
      const res = await db.collection('participate_user').where({
        activity_id: data.id,
        user_id: data.userId
      }).get();
      
      participateActivityIds = res.data.map(item => item.activity_id);
    }
    console.log('参与ids', participateActivityIds);
    // 查询业务数据
    const countResult = await db.collection('activity').count();
    const total = countResult.total;

    // 查询数据库信息，发布且启用状态，lookup查询奖品列表
    const matchParams = {
      publish_status: 1,
      status: 1
    };
    if (participateActivityIds.length > 0) {
      matchParams._id = _.in(participateActivityIds);
    }
    console.log('匹配参数', matchParams);
    const res = await db.collection('activity').aggregate()
    .sort({
      update_time: -1
    })
    .match(matchParams)
    .lookup({
      from: 'prize',
      localField: '_id',
      foreignField: 'activity_id',
      as: 'prizeList'
    }).skip(pageSize * (pageNum - 1)).limit(pageSize).end();
    console.log('lookup查询结果', res);

    return {
      success: true,
      data: {records: res.list.map(item => convert.Activity(item)), page: {pageSize: pageSize, pageNum: pageNum, total: total}}
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};