var userModel = require("../models/user");
var mongoose = require('mongoose');

module.exports.isAdmin = async (userID) => {
  let { level } = await userModel.findOne({ _id: userID }, { _id: 0, level: 1 })
  return level == "admin";
};

module.exports.get = async (userID) => {
  let user = await userModel.findOne({ _id: userID });
  return user;
};

module.exports.updateLastActiveAt = async (user) => {
  await userModel.findOneAndUpdate(
    { _id: user._id },
    { $set: { lastActiveAt: Date.now() } }
  );
};
module.exports.updateLastActiveAt = async (user) => {
  return await userModel
    .findOneAndUpdate({ _id: user._id }, { $set: { lastActiveAt: Date.now() } })
};

module.exports.getUser = async (userID) => {
  return await userModel.findOne({ _id: userID }, { notifications: 0 });
};

module.exports.sendNotification = async (notification, user) => {
  if (user != null) {
    return await userModel.findOneAndUpdate(
      user,
      { $push: { notifications: notification } }
    );
  } else {
    console.log("Sending notification to all users")
    return await userModel.updateMany(
      { $push: { notifications: notification } }
    );
  }
};

module.exports.getUnreadNotifications = async (userID) => {
  console.log(userID);
  let notifications = await userModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(userID) } },
    { $unwind: "$notifications" },
    { $sort: { "notifications.createdAt": -1 } },
    { $replaceRoot: { newRoot: "$notifications" } },
    { $match: { read: false } },
  ])

  return notifications;
}