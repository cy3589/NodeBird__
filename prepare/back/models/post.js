module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      //id가 기본적으로 자동으로 생성됨
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    { charset: "utf8mb4", collate: "utf8mb4_general_ci" }
  );
  Post.associate = (db) => {
    db.Post.belongsTo(db.User); //post.addUser, post.getUser, post.setUser
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); // post.addPostHashtags, post.getUser, post.setUser
    db.Post.hasMany(db.Comment); // port.addComments, post.getComments
    db.Post.hasMany(db.Image); // post.addImages, post.getImages, post.setImages
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); //post.addLikes, post.addLikers, post.getUser, post.setUser
    db.Post.belongsTo(db.Post, { as: "Retweet" }); // post.Rewteet
  };
  return Post;
};
