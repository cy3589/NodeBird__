module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define(
    "Hashtag",
    {
      //id가 기본적으로 자동으로 생성됨
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    { charset: "utf8mb4", collate: "utf8mb4_general_ci" }
  );
  Hashtag.associate = (db) => {
    db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" });
  };
  return Hashtag;
};
