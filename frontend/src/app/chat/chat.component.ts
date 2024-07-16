import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from './Message';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  msgs: Message[] = [];

  form: FormGroup = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    content: new FormControl<string>('', Validators.required)
  });

  constructor(private webSocketService: WebsocketService) {}

  ngOnInit(): void {
    this.webSocketService.listen(msg => {
      this.msgs.push(msg);
    });
  }

  add(name: string, content: string): void {
    const msg: Message = {
      name: name,
      content: content
    };
    this.webSocketService.send(msg);
    console.log(msg);
  }

  click(): void {
    this.add(this.form.value.name, this.form.value.content);
    this.form.reset({});
  }
}
