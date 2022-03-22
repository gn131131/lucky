import { utilsService } from "./service";

export const fHttp = {
  user: {
    // 新增用户
    save: (data) => {
      return utilsService.http('/f/user/save', data);
    },
    // 查看用户是否已注册
    checkLogon: () => {
      return utilsService.http('/f/user/checkLogon');
    },
    // 获取用户信息
    getUserInfo: () => {
      return utilsService.http('/f/user/getUserInfo');
    },
  },
  admin: {
    // 验证密码
    verify: (password) => {
      return utilsService.http('/f/admin/verify', {password: password});
    }
  },
  activity: {
    // 获取活动列表
    queryListByPage: (data) => {
      return utilsService.http('/f/activity/queryListByPage', data);
    },
    // 查看活动详情
    queryById: (id) => {
      return utilsService.http('/f/activity/queryById', {id});
    },
    // 验证活动码是否正确
    checkCode: (id, code) => {
      return utilsService.http('/f/activity/checkCode', {id, code});
    },
    // 参加活动
    participate: (id, userId) => {
      return utilsService.http('/f/activity/participate', {id, userId});
    },
    // 抽奖
    draw: (id, userId) => {
      return utilsService.http('/f/activity/draw', {id, userId});
    },
    // 围观活动
    watch: (id, userId) => {
      return utilsService.http('/f/activity/watch', {id, userId});
    },
  },
  history: {
    // 获取当前用户历史记录列表
    queryListByPage: (data, userId) => {
      return utilsService.http('/f/history/queryListByPage', Object.assign(data, {userId}));
    },
  },
  win: {
    // 获取当前用户中奖记录列表
    queryListByPage: (data, userId) => {
      return utilsService.http('/f/win/queryListByPage', Object.assign(data, {userId}));
    },
  },
};

export const bHttp = {
  activity: {
    // 获取活动列表
    queryListByPage: (data) => {
      return utilsService.http('/b/activity/queryListByPage', data);
    },
    // 查看活动详情
    queryById: (id) => {
      return utilsService.http('/b/activity/queryById', {id: id});
    },
    // 新增活动
    save: (data) => {
      return utilsService.http('/b/activity/save', data);
    },
    // 编辑活动
    update: (data) => {
      return utilsService.http('/b/activity/update', data);
    },
    // 删除活动
    delete: (delIds) => {
      return utilsService.http('/b/activity/delete', {delIds: delIds});
    }
  },
  user: {
    // 获取用户列表
    queryListByPage: (data) => {
      return utilsService.http('/b/user/queryListByPage', data);
    },
  },
  win: {
    // 获取中奖记录列表
    queryListByPage: (data) => {
      return utilsService.http('/b/win/queryListByPage', data);
    },
  },
  template: {
    // 获取模板列表
    queryList: () => {
      return utilsService.http('/b/template/queryList', {});
    }
  }
};