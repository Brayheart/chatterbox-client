

var app = {};

app.init = function() {

  // $('#main').find('.username').on('click', function() {
  //   app.handleUsernameClick();
  // });
};

app.send = function(message) {

  $.ajax({
    url: 'http://parse.la.hackreactor.com/chatterbox/classes/messages',
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
    type: 'GET',
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

  $('#chats').html(`<blink>${message.username}: ${message.text}</blink>`);
  
};

app.renderRoom = function(room) {
  $('#roomSelect').append(`<li>${room}</li>`);
};

app.handleUsernameClick = function(username) {
//   return;
};

app.handleSubmit = function() {
//   return;
};
