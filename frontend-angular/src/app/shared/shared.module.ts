import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularMatModule } from "../angular-material/angular-material.module";
import { SystemMessageComponent } from './components/system-message/system-message.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';


const sharedModules = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMatModule,
]

const sharedComponents = [
    SystemMessageComponent,
    ConfirmationComponent
]

@NgModule({
    declarations: sharedComponents,
    imports: [
        ...sharedModules
    ],
    exports: [
        ...sharedModules,
        ...sharedComponents
    ]
})
export class SharedModule {}