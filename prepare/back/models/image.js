module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    "Image",
    {
      //id가 기본적으로 자동으로 생성됨
      src: { type: DataTypes.STRING(200), allowNull: false },
    },
    { charset: "utf8", collate: "utf8mb3_general_ci" }
  );
  Image.associate = (db) => {
    db.Image.belongsTo(db.Post);
  };
  return Image;
};
