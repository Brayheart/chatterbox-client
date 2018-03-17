
var app = {
  server: 'http://parse.la.hackreactor.com/chatterbox/classes/messages'
};

app.init = function() {

  $('#main').find('.username').on('click', function() {
    app.handleUsernameClick();
  });

  $('#send').on('click', function() {
    let msg = $('#msg').val();
    app.handleSubmit(msg);
    $('#msg').text('');
  });

  app.fetch();
};

app.send = function(message) {

  $.ajax({
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');

    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function() {

  $.ajax({
    url: this.server,
    type: 'GET',
    data: 'order=-createdAt',
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message received');

      let chats = data.results;

      chats.forEach(function(msg) {
        app.renderMessage(msg);
      });

    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.clearMessages = function() {
  $('#chats').html('');
};

app.renderMessage = function(message) {
  // Format of message input:

  //   var message = {
  //   username: 'batman',
  //   text: 'trololo',
  //   roomname: '4chan'
  // };

  let $msg = $(`<div class="msg"><span class="username">${message.username}:<span>
                ${message.text}</div><br>`);

  $('#chats').append($msg);
};

app.renderRoom = function(room) {
  $('#roomSelect').append(`<option>${room}</option>`);
};

app.handleUsernameClick = function() {

};

app.handleSubmit = function(msg) {

};

$(document).ready(function() {
  app.init();
});