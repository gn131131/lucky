exports.Activity = (params) => {
  return {
    id: params._id,
    name: params.name,
    participateNum: params.participate_num,
    winNum: params.win_num,
    watchNum: params.watch_num,
    activeTimeRange: params.active_time_range,
    prizeList: params.prizeList ? params.prizeList.map(item => this.Prize(item)) : [],
    participateUserList: params.participateUserList ? params.participateUserList.map(item => this.ParticipateUser(item)) : [],
    showProbability: params.show_probability,
    createTime: params.create_time,
    updateTime: params.update_time
  }
};

exports.User = (params) => {
  return {
    id: params._id,
    openId: params.open_id,
    nickName: params.nick_name,
    avatarUrl: params.avatar_url,
    probabilityIncrease: params.probability_increase,
    createTime: params.create_time,
    updateTime: params.update_time,
  }
};

exports.Prize = (params) => {
  return {
    id: params._id,
    activityId: params.activity_id,
    name: params.name,
    fileId: params.file_id,
    createTime: params.create_time,
    updateTime: params.update_time,
  }
};

exports.ParticipateUser = (params) => {
  return {
    id: params._id,
    userId: params.user_id,
    nickName: params.nick_name,
    avatarUrl: params.avatar_url,
    activityId: params.activity_id,
    drawTimes: params.draw_times,
    surplusDrawTimes: params.surplus_draw_times,
    winTimes: params.win_times,
    createTime: params.create_time,
    updateTime: params.update_time,
  }
};

exports.WinUser = (params) => {
  return {
    id: params._id,
    userId: params.user_id,
    activityId: params.activity_id,
    activityName: params.activity_name,
    prizeId: params.prize_id,
    prizeName: params.prize_name,
    drawTimes: params.draw_times,
    surplusDrawTimes: params.surplus_draw_times,
    userList: params.userList ? params.userList.map(item => this.User(item)) : [],
    winTime: params.win_time
  }
};

exports.History = (params) => {
  return {
    id: params._id,
    userId: params.user_id,
    activityId: params.activity_id,
    activityName: params.activity_name,
    createTime: params.create_time,
    updateTime: params.update_time,
  }
};