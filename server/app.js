const EventEmitter = require('events').EventEmitter;
const cluster = require('cluster');
const TwitterSearcher = require('./lib/twitterSearcher');
const io = require('socket.io')();
const config = require('./config');
const AuthHandler = require('./lib/authHandler');
const authHandler = new AuthHandler();
// if(cluster.isMaster) {
//   for(let i = 0; i < require('os').cpus().length; i++) {
//     const worker = cluster.fork();
//   }
// } else {
//   process.on('exit', () => cluster.fork())
io.on('connection', client => {
  const eventEmitter = new EventEmitter();
  const searcher = new TwitterSearcher();
  searcher.setEventEmitter(eventEmitter);
  let isAuthenticated = false;
  client.on('authenticate', authParams => {
    return authHandler
      .getKeysFromAuthParams(authParams)
      .then(keys => {
        isAuthenticated = true;
        client.emit('authSuccess', 'Authentication Success');
      })
      .catch(e => {
        console.log(e);
        client.emit('authFailure', 'Authentication Failure');
      });
  });
  client.on('keyword', keyword => {
    if (!isAuthenticated) {
      client.emit('unauthenticated', 'Not Authenticated');
    } else {
      if (searcher.getKeyword()) {
        eventEmitter.removeAllListeners(searcher.getKeyword());
      }

      eventEmitter.on(keyword, data => client.emit(keyword, data));
      searcher.setKeyword(keyword);
      searcher.start();
    }
  });

  client.on('disconnect', () => {
    searcher.stop();
  });
});

io.listen(config.SOCKET_PORT);
// }
