const EventEmitter = require('events').EventEmitter;

const TwitterSearcher = require('./lib/twitterSearcher');
const io = require('socket.io')();

io.on('connection', client => {
  const eventEmitter = new EventEmitter();
  const searcher = new TwitterSearcher();
  searcher.setEventEmitter(eventEmitter);
  client.on('keyword', keyword => {
    console.log(keyword);
    if (searcher.getKeyword()) {
      eventEmitter.removeAllListeners(searcher.getKeyword());
    }

    eventEmitter.on(keyword, data => io.emit(keyword, data));
    searcher.setKeyword(keyword);
    searcher.start();
  });

  client.on('disconnect', () => {
    searcher.stop();
  });
});

io.listen(9000);
