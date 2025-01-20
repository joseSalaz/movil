import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificacionComponent {
  @Input() message: string | null = null;
  @Input() success: boolean = true;
}
