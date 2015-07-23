module.exports = {

  errorGen: function(title, excerpt, body) {
    var list = [];
    var msg1 = "Title can not be blank.";
    var msg2 = "Excerpt can not be blank.";
    var msg3 = "Body can not be blank.";
    if (!title) {
      list.push(msg1);
    }
    if (!excerpt) {
      list.push(msg2);
    }
    if (!body) {
      list.push(msg3);
    }
    return list;
  }
};
