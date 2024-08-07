import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { trigger, transition, style, animate } from '@angular/animations';
import { SystemMessageType } from 'src/app/_models/system.model';


@Component({
  selector: 'app-system-message',
  templateUrl: './system-message.component.html',
  styleUrls: ['./system-message.component.scss'],
  animations: [
    trigger("load", [
      transition("* => enter", [
        style({opacity: 0}),
        animate(
          120,
          style({opacity: 1 })
        ),
      ]),
      transition(":leave", [
        style({opacity: 0}),
        animate(
          120,
          style({opacity: 1 })
        ),
      ])
    ])
  ]
})
export class SystemMessageComponent implements AfterViewInit {
  @Input() message: string = ""
  @Input() messageType!: SystemMessageType;
  @Output() closeMessage = new EventEmitter<void>();
  @Input() timeUntilDestruction: number = 4500;
  @Input() noTimeOut: boolean = false;
  systemMessageType = SystemMessageType;
  constructor(private domSanitizer: DomSanitizer) { }

  ngAfterViewInit(): void {
    if(!this.noTimeOut){
      setTimeout(() => {
        this.close()
      }, (this.timeUntilDestruction));
    }

  }

  close(){
    this.closeMessage.emit();
  }

  getTrustedHTML(): SafeHtml{
    let html: SafeHtml = this.domSanitizer.bypassSecurityTrustHtml(this.message);
    return html;
  }
}
