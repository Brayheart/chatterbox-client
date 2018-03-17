
var app = {
  server: 'http://parse.la.hackreactor.com/chatterbox/classes/messages',
  username: 'anonymous',
  rooms: {},
  friends: {}
};

app.init = function() {

  $('#main').find('.username').on('click', app.handleUsernameClick);

  $('#send').on('click', app.handleSubmit);

  $('#roomCreate').on('click', app.handleNewRoom);

  $('#roomSelect').on('change', app.handleRoomChange);
  
  $('#chats').on('click', '.username', app.handleUsernameClick);

  app.rooms['lobby'] = 'lobby';

  app.addSpinner();

  app.fetch(function(results) {
    results.forEach(function(msg) {

      if (!(msg.roomname in app.rooms)) {
        app.rooms[msg.roomname] = msg.roomname;
      }

      if (msg.roomname === $('#roomSelect').val()) {
        app.renderMessage(msg, true);
      }
    });

    for (var room in app.rooms) {
      $('#roomSelect').append(`<option>${room}</option>`);
    }

    app.removeSpinner();
  });

};

app.send = function(message) {
console.log('msg', message)

  $.ajax({
    url: app.server,
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
    url: app.server,
    type: 'GET',
    data: 'order=-createdAt',
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message received');
      callback(data.results);
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
                  <span class="username">${_.escape(message.username)}: </span>
                  <span>${_.escape(message.text)}</span>
                </div>`);

  console.log(message.username in app.friends)

  if (message.username in app.friends) {
    $msg.attr('id', 'friend');
  }
  
  // If fetching messages, append messages
  // If posting singular message, prepend message.
  if (fetching) {
    $('#chats').append($msg);
  } else {
    $('#chats').prepend($msg);
  }
};

app.handleRoomChange = function() {
  app.clearMessages();
  app.addSpinner();
  app.fetch(function(results) {
    results.forEach(function(msg) {
      if (msg.roomname === $('#roomSelect').val()) {
        app.renderMessage(msg, true);
      }
    });
    app.removeSpinner();
  });

}

app.renderRoom = function(room) {
  $('#roomSelect').append(`<option>${room}</option>`);
};

app.handleUsernameClick = function(event) {
  let username = event.target.innerText.slice(0,event.target.innerText.length - 2);

  app.friends[username] = !app.friends[username];

  app.clearMessages();
  app.addSpinner();

  if (app.friends[username]) {
    app.fetch(function(results) {
    results.forEach(function(msg) {
      if (msg.roomname === $('#roomSelect').val()) {
        app.renderMessage(msg, true);
      }
    });
    app.removeSpinner();
  });

  }

};

app.handleNewRoom = function() {

  let newRoom = $('#roomCreateText').val();

  $('#roomSelect').append(`<option>${newRoom}</option>`);

  $('#roomCreateText').val('');

  $('#roomSelect').val(newRoom);

};

app.handleSubmit = function() {

  const sentMsg = {
    username: window.location.search.slice(10),
    text: $('#msg').val(),
    roomname: $('#roomSelect').val()
  };
  
  app.send(sentMsg);

  app.renderMessage(sentMsg, false);

  $('#msg').val('');
};

app.addSpinner = function() {
  $('.spinner').attr('src', './images/spiffygif_46x46.gif');
};

app.removeSpinner = function() {
  $('.spinner').removeAttr('src');
};


$(document).ready(function() {
  app.init();
});