import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor() {}

  async showSuccess(message: string, messageService: MessageService) {
    var summary = 'Succes';
    messageService.add({
      severity: 'success',
      summary: summary,
      detail: message,
      life: 3000,
    });
  }

  async showError(message: string, messageService: MessageService) {
    var summary = 'Error';
    messageService.add({
      severity: 'error',
      summary: summary,
      detail: message,
      life: 3000,
    });
  }

  async showWarning(message: string, messageService: MessageService) {
    var summary = 'Warning';
    messageService.add({
      severity: 'warning',
      summary: summary,
      detail: message,
      life: 3000,
    });
  }

  async showInfo(message: string, messageService: MessageService) {
    var summary = 'Information';
    messageService.add({
      severity: 'info',
      summary: summary,
      detail: message,
      life: 3000,
    });
  }
}
