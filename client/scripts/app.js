
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
  });


  $('#roomSelect').on('change', function() {
    app.fetch(function(results) {
      results.forEach(function(msg) {
        if (msg.roomname === $('#roomSelect').val()) {
          app.renderMessage(msg, true);
        }
      });
    });
  });

  $('.spinner').attr('src', './images/spiffygif_46x46.gif');
  
  $('#roomSelect').append('<option>lobby</option>');

  var rooms = ['lobby'];

  app.fetch(function(results) {
    results.forEach(function(msg) {

      if (rooms.indexOf(msg.roomname) < 0) {
        rooms.push(msg.roomname);
      }

      if (msg.roomname === rooms[0]) {
        app.renderMessage(msg, true);
      }
    });

    rooms.shift(); // cut off lobby
    rooms.forEach(function(room) {
      $('#roomSelect').append(`<option>${room}</option>`);
    });

    $('.spinner').removeAttr('src');
  });

};

app.send = function(message) {
console.log('msg', message)

  $.ajax({
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('data sent', data);
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};

app.fetch = function(callback) {

  $.ajax({
    url: this.server,
    type: 'GET',
    data: 'order=-createdAt',
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message received');

      callback(data.results);

      // let chats = data.results;

      // let currentRoom = $('#roomSelect').val();

      // chats.forEach(function(msg) {
      //   if (!(/<|>/).test(msg.text)) {
      //     if (msg.roomname === currentRoom) {
      //       console.log(msg.roomname);
      //       app.renderMessage(msg, true);
      //     }
      //   }
      // });

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

app.renderMessage = function(message, fetching) {
  // Format of message input:

  //   var message = {
  //   username: 'batman',
  //   text: 'trololo',
  //   roomname: '4chan'
  // };

  let $msg = $(`<div class="chat">
                  <span class="username">${message.username}: </span>
                  <span>${_.escape(message.text)}</span>
                </div>`);
  
  // If fetching messages, append messages
  // If posting singular message, prepend message.
  if (fetching) {
    $('#chats').append($msg);
  } else {
    $('#chats').prepend($msg);
  }
};

app.renderRoom = function(room) {
  $('#roomSelect').append(`<option>${room}</option>`);
};

app.handleUsernameClick = function() {
};

app.handleSubmit = function(msg) {
  
  const sentMsg = {
    'username': 'test',
    text: msg,
    roomname: $('roomSelect').val()
  };
  
  this.send(sentMsg);

  this.renderMessage(sentMsg, false);

  $('#msg').val('');
};

$(document).ready(function() {
  app.init();
});