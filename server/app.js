const EventEmitter = require('events').EventEmitter;

const TwitterSearcher = require('./lib/twitterSearcher');
const io = require('socket.io')();

io.on('connection', client => {
  const eventEmitter = new EventEmitter();
  const searcher = new TwitterSearcher();
  searcher.setEventEmitter(eventEmitter);
  let isAuthenticated = false;
  client.on('authenticate', (authParams) => {
    isAuthenticated = true;
    client.emit('authSuccess', 'Authentication Success')
    // client.emit('authFailure', 'Authentication Success')
  })
  client.on('keyword', keyword => {
    if(!isAuthenticated) {
      client.emit('unauthenticated', 'Not Authenticated')
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

io.listen(9000);
