document.addEventListener('DOMContentLoaded', function() {
  const socket = io();
  const messages = document.getElementById('messages');
  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const $locationBtn = document.getElementById('locationBtn');
  //const roomsElement = document.getElementById('rooms');

  const params = Qs.parse(location.search, { ignoreQueryPrefix: true });


  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value , (error) => {
        if (error) {
         alert(error);
        } else {
          console.log('message sent');
        }
      });
      input.value = '';
    }
  });

  $locationBtn.addEventListener('click', function() {
    if (!navigator.geolocation) {
      return alert('Geolocation is not supported by your browser.');
    }

    navigator.geolocation.getCurrentPosition(async function(position) {
      await formatLocationMessage(position);
    }, function(error) {
      alert('Error getting location:', error);
    });
  });

  socket.on('broadcast', function(msg) {
    const item = document.createElement('li');
    item.innerHTML = `<p>${msg.user}<small> > ${msg.timestamp}</small></p><strong>${msg.text}</strong>`;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });
  socket.emit('join', params , (error) => {
    if (error) {
      location.href= '/'
      alert(error);
      return  
    }
  })


 // Assuming you have a WebSocket connection established and 'socket' is the WebSocket object.

socket.on('room', (room) => {
  const roomsElement = document.getElementById('rooms');
  roomsElement.innerHTML = `<h3> Room : ${room.room} </h3>`;
  
  const item = document.createElement('ol');
  room.users.forEach((user) => {
    const li = document.createElement('li');
    li.textContent = user.userName;
    li.style.color = 'white';
    item.appendChild(li);
  });

  roomsElement.appendChild(item);
});




  async function formatLocationMessage(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const locationMsg = `<a href="https://www.google.com/maps?q=${latitude},${longitude}" target="_blank">View Location</a>`;
    $locationBtn.setAttribute('disabled', 'disabled');
    socket.emit('location message', locationMsg, async () => {
      await $locationBtn.removeAttribute('disabled');
    });
  }
});
