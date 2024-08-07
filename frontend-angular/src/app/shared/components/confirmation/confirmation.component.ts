import { trigger, style, animate, transition } from '@angular/animations';
import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
  animations: [
    trigger("load", [
      transition(":enter", [
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
export class ConfirmationComponent implements OnInit {
  @Input() confirmMessage: string = "";
  @Output() confirmEvent = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
  }

  confirm(bool: boolean){
    this.confirmEvent.emit(bool)
  }
}
