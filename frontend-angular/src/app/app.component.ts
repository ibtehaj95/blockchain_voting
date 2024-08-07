import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { SystemMessage, Confirmation, SystemMessageType } from './_models/system.model';
import { SystemMessageService } from './shared/components/system-message/system-message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Decentralized Voting System';

  delayedSystemMessages: SystemMessage[] = [];
  isSystemMessageComponentActive: boolean = false;

  delayedConfirmations: Confirmation[] = [];
  isConfirmationComponentActive: boolean = false;

  @ViewChild('systemMessageHost', { read: ViewContainerRef })
  systemMessageHost!: ViewContainerRef;

  @ViewChild('confirmationHost', { read: ViewContainerRef })
  confirmationHost!: ViewContainerRef;


  constructor(
    private systemMessageService: SystemMessageService,
  ) {}

  ngOnInit(): void {
    // system messages


    this.systemMessageService.systemMessageDestroyed$.subscribe(() => {
      this.isSystemMessageComponentActive = false;
      if (this.delayedSystemMessages.length > 0) {
        let message = this.delayedSystemMessages.shift();
        if(message)
          this.systemMessageService.emitSystemMessage(message);
      }
    });

    this.systemMessageService.systemMessage$.subscribe((systemMessage) => {
      console.log("systemMessage", systemMessage)
      if (this.isSystemMessageComponentActive) {
        this.delayedSystemMessages.push(systemMessage);
        return;
      } else {
        this.isSystemMessageComponentActive = true;
        this.systemMessageService.createSystemMessage(
          systemMessage.message,
          this.systemMessageHost,
          systemMessage.messageType,
          systemMessage.noTimeOut,
          systemMessage.timeUntilDestruction
        );
      }
    });

    // confirmation
    this.systemMessageService.confirmationDestroyed$.subscribe(() => {
      this.isConfirmationComponentActive = false;
      if (this.delayedConfirmations.length > 0) {
        let confirmation = this.delayedConfirmations.shift();
        if(confirmation)
          this.systemMessageService.emitConfirmation(confirmation);
      }
    });

    this.systemMessageService.confirmation$.subscribe((confirmationText) => {
      console.log("confirmationText", confirmationText)
      if (this.isSystemMessageComponentActive) {
        this.delayedConfirmations.push(confirmationText);
        return;
      } else {
        this.isConfirmationComponentActive = true;
        this.systemMessageService.createConfirmation(
          confirmationText,
          this.confirmationHost
        );
      }
    });

    

  }

  ngAfterViewInit(): void {
    const systemMessage: SystemMessage = {
      message: "Test",
      messageType: SystemMessageType.NOTIFICATION,
      noTimeOut: true,
      timeUntilDestruction: 0
    }
    this.systemMessageService.emitConfirmation({
      id: "Test",
      text: "Test"
    })

    this.systemMessageService.emitSystemMessage(systemMessage)

  }

}
