import { environment } from './../environments/environment';
import { Component } from '@angular/core';
import io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  socket: any;
  latestData: any[];

  constructor() {
    this.latestData = [];
  }

  ngOnInit() {
    const keyword = 'NFC';
    this.socket = io(environment.socketUri);
    this.socket.on('connect', () => {
      this.socket.on('authSuccess', data => {
        console.log(data);
        this.socket.on('unauthenticated', data => {
          console.log(data);
        });
        this.socket.emit('keyword', keyword);
        this.socket.on(keyword, data => {
          data.count = this.latestData.length + 1;
          this.latestData.unshift(data);
        });
      });
      this.socket.on('authFailure', data => {
        console.log(data);
      });
      this.socket.on('unauthenticated', data => {
        console.log(data);
      });
      this.socket.emit('authenticate', environment.authKey);
    });
  }
}
