import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../@core/services/api.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';

@Component({
  selector: 'app-user-webauthn-settings',
  templateUrl: './user-webauthn-settings.component.html',
  styleUrls: ['./user-webauthn-settings.component.less'],
})
export class UserWebauthnSettingsComponent implements OnInit {

  credentials: any[] = [];
  loading = false;
  supported = false;

  constructor(private apiService: ApiService, private toastUtil: ToastUtil) {
    this.supported = !!window.PublicKeyCredential;
  }

  ngOnInit() {
    this.loadCredentials();
  }

  loadCredentials() {
    this.apiService.get('/webauthn', '/credentials', {}).subscribe((res: any) => {
      this.credentials = res.body || [];
    });
  }

  async register() {
    this.loading = true;
    try {
      // 1. Get options from server
      const optionsRes: any = await this.apiService.get('/webauthn', '/register/options', {}).toPromise();
      const options = optionsRes.body;

      // 2. Convert base64url to ArrayBuffer
      const publicKeyOptions: PublicKeyCredentialCreationOptions = {
        challenge: this.base64urlToBuffer(options.challenge),
        rp: options.rp,
        user: {
          id: this.base64urlToBuffer(options.user.id),
          name: options.user.name,
          displayName: options.user.displayName,
        },
        pubKeyCredParams: options.pubKeyCredParams,
        authenticatorSelection: options.authenticatorSelection,
        timeout: options.timeout,
        attestation: options.attestation as AttestationConveyancePreference,
        excludeCredentials: (options.excludeCredentials || []).map((c: any) => ({
          type: c.type,
          id: this.base64urlToBuffer(c.id),
        })),
      };

      // 3. Call WebAuthn API
      const credential = await navigator.credentials.create({ publicKey: publicKeyOptions }) as PublicKeyCredential;
      const attestationResponse = credential.response as AuthenticatorAttestationResponse;

      // 4. Send to server
      const body = {
        id: this.bufferToBase64url(credential.rawId),
        type: credential.type,
        response: {
          attestationObject: this.bufferToBase64url(attestationResponse.attestationObject),
          clientDataJSON: this.bufferToBase64url(attestationResponse.clientDataJSON),
        },
        transports: (attestationResponse as any).getTransports ? (attestationResponse as any).getTransports() : ['internal'],
        deviceName: navigator.platform || 'Device',
      };

      await this.apiService.post('/webauthn', '/register/complete', body).toPromise();
      localStorage.setItem('webauthn_registered', 'true');
      this.toastUtil.onSuccessToast(TOAST_CONTENT.ADD);
      this.loadCredentials();
    } catch (e: any) {
      console.error('WebAuthn registration failed:', e);
      alert('Registration failed: ' + (e?.message || e));
    } finally {
      this.loading = false;
    }
  }

  deleteCredential(id: number) {
    this.apiService.delete('/webauthn', '/credential/del', { id }).subscribe(() => {
      this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
      this.loadCredentials();
    });
  }

  private base64urlToBuffer(base64url: string): ArrayBuffer {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
    const binary = atob(base64 + pad);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  }

  private bufferToBase64url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
}
