import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { SystemMessage, Confirmation, ConfirmationResponse, SystemMessageType } from 'src/app/_models/system.model';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { SystemMessageComponent } from './system-message.component';


@Injectable({
  providedIn: 'root'
})
export class SystemMessageService {
  private hostViewContainerRefSysMsg!: ViewContainerRef;
  private systemMessageCmpRef!: ComponentRef<any>;
  private closeSubMsg!: Subscription;
  private systemMessageNotifier$: Subject<SystemMessage> = new Subject();
  public systemMessage$ = this.systemMessageNotifier$.asObservable();
  private sysMsgDestroyedNotifier$: Subject<void> = new Subject();
  public systemMessageDestroyed$ = this.sysMsgDestroyedNotifier$.asObservable();


  private confirmationNotifier$: Subject<Confirmation> = new Subject();
  public confirmation$ = this.confirmationNotifier$.asObservable();
  private confirmationDestroyedNotifier$: Subject<void> = new Subject();
  public confirmationDestroyed$ = this.confirmationDestroyedNotifier$.asObservable();
  private confirmationResponseSubject$: Subject<ConfirmationResponse> = new Subject();
  public confirmationResponse$ = this.confirmationResponseSubject$.asObservable()
  private hostViewContainerRefConfirm!: ViewContainerRef;
  private confirmMessageCmpRef!: ComponentRef<any>
  private closeSubConfirm!: Subscription;
  constructor() { }


  createSystemMessage(message: string, vcr: ViewContainerRef, messageType: SystemMessageType, noTimeOut: boolean = false, timeUntilDestruction: number = 1000*3600){
    this.hostViewContainerRefSysMsg = vcr;
    this.hostViewContainerRefSysMsg.clear();
    this.systemMessageCmpRef = this.hostViewContainerRefSysMsg.createComponent(SystemMessageComponent);
    this.systemMessageCmpRef.instance.message = message;
    this.systemMessageCmpRef.instance.timeUntilDestruction = timeUntilDestruction;
    this.systemMessageCmpRef.instance.messageType = messageType;
    this.systemMessageCmpRef.instance.noTimeOut = noTimeOut;
    this.closeSubMsg = this.systemMessageCmpRef.instance.closeMessage.subscribe(() => {
      this.closeSubMsg.unsubscribe();
      this.hostViewContainerRefSysMsg.clear();
      this.sysMsgDestroyedNotifier$.next();
    })
  }

 createConfirmation(confirmation: Confirmation, vcr: ViewContainerRef): void {
    this.hostViewContainerRefConfirm = vcr;
    this.confirmMessageCmpRef = this.hostViewContainerRefConfirm.createComponent(ConfirmationComponent);
    this.confirmMessageCmpRef.instance.confirmMessage = confirmation.text;
    this.closeSubConfirm = this.confirmMessageCmpRef.instance.confirmEvent.subscribe((confirmValue: boolean) => {
      this.closeSubConfirm.unsubscribe();
      this.hostViewContainerRefConfirm.clear();
      this.confirmationResponseSubject$.next({confirmValue: confirmValue, id: confirmation.id});
    })
  }

  emitSystemMessage(systemMessage: SystemMessage){
    this.systemMessageNotifier$.next(systemMessage);
  }

  emitConfirmation(confirmation: Confirmation): Observable<ConfirmationResponse>{
    this.confirmationNotifier$.next(confirmation);
    return this.confirmationResponse$;
  }
}
