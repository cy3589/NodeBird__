const { Sequelize } = require("sequelize");
const sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      //id가 기본적으로 자동으로 생성됨
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // createdAt: {
      //   type: Sequelize.DATE(6),
      //   allowNull: false,
      //   defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
      // },
      // updatedAt: {
      //   type: Sequelize.DATE(6),
      //   allowNull: false,
      //   defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(6)"),
      // },
    },
    { charset: "utf8mb4", collate: "utf8mb4_general_ci" }
  );
  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
  };
  return Comment;
};
