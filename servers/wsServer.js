const WebSocket = require('ws');

const room = {};

const init = () => {
  const server = new WebSocket.Server({ port: 5000 });
  console.log('FreeSO Dashboard WS Server listening on 5000');

  server.on('connection', (ws) => {
    ws.on('message', (data) => {
      try {
        const dataObj = JSON.parse(data);
        if (dataObj.solution) {
          room[dataObj.id].latest = dataObj.solution;
          server.clients.forEach((client) => {
            if (room[dataObj.id].team.includes(client)) {
              client.send(JSON.stringify({ solution: dataObj.solution }));
            }
          });
        } else if (dataObj.private) {
          // Create new room and add user.
          room[dataObj.id] = {
            leader: ws,
            team: [],
            time: Date.now(),
          };
          room[dataObj.id].team.push(ws);
        } else if (dataObj.id && room[dataObj.id]) {
          // Add follower to room.
          if (!room[dataObj.id].team.includes(ws)) {
            room[dataObj.id].team.push(ws);
            ws.send(JSON.stringify({ solution: room[dataObj.id].latest }));
          }
          // Update the room count
          server.clients.forEach((client) => {
            if (room[dataObj.id].team.includes(client)) {
              client.send(JSON.stringify({ population: room[dataObj.id].team.length }));
            }
          });
        } else {
          ws.send(JSON.stringify({ error: 'Something went wrong. Make sure you have the right room ID.' }));
        }
      } catch (error) {
        ws.send(JSON.stringify({ error: `I can't work with this message. Here's what I received: ${data}` }));
      }
    });
  });

  const sixHours = 216e5;
  const interval = setInterval(() => {
    Object.keys(room).forEach((roomID) => {
      if (Date.now() - room[roomID].time > sixHours) {
        room[roomID].team.forEach((ws) => {
          ws.terminate();
        });
        delete room[roomID];
      }
    });
  }, sixHours);
};

module.exports = {
  init,
};
