import { Component } from '@angular/core';
import { ApiService } from '../../../@core/services/api.service';

@Component({
  selector: 'app-credential-leak',
  templateUrl: './credential-leak.component.html',
  styleUrls: ['./credential-leak.component.less'],
})
export class CredentialLeakComponent {
  credential = '';
  result: any = null;
  loading = false;

  constructor(private apiService: ApiService) {}

  detect() {
    if (!this.credential.trim()) return;
    this.loading = true;
    this.result = null;
    this.apiService.post('/security/credential-leak', '/detect', { credential: this.credential.trim() })
      .subscribe({
        next: ({ body }) => {
          this.result = body;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }
}
