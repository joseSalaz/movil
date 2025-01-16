import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.css']
})
export class NotificacionComponent {
  @Input() message: string | null = null;
  @Input() success: boolean = true;
}
