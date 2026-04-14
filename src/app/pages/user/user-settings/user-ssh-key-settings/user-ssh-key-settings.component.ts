import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { UserService } from '../../../../@core/services/user.service';
import { CredentialVO } from '../../../../@core/data/credential';
import { getRowColor } from '../../../../@shared/utils/data-table.utli';
import { CredentialService } from '../../../../@core/services/credential.service';
import { TOAST_CONTENT, ToastUtil } from '../../../../@shared/utils/toast.util';
import { DIALOG_DATA, DialogUtil } from '../../../../@shared/utils/dialog.util';
import { RELATIVE_TIME_LIMIT } from '../../../../@shared/constant/date.constant';
import { AddSshKey, UserVO } from '../../../../@core/data/user';

@Component({
  selector: 'app-user-ssh-key-settings',
  templateUrl: './user-ssh-key-settings.component.html',
  styleUrls: [ './user-ssh-key-settings.component.less' ],
})
export class UserSshKeySettingsComponent implements OnInit {

  sshKeyList: CredentialVO[];
  now: Date = new Date();

  isKeyValid(key: CredentialVO): boolean {
    return key.expiredTime && new Date(key.expiredTime).getTime() > this.now.getTime();
  }
  sshKeyExample: string = '';
  sshExample: string = '';
  sshCommand: string = '';
  ed25519Command: string = '';
  rsaCommand: string = '';
  demoLines: string[] = [];
  demoRunning = false;
  demoCursorVisible = true;
  @ViewChild('terminalDemo') terminalDemo: ElementRef;
  dialogDate = {
    warningOperateData: {
      ...DIALOG_DATA.warningOperateData,
    },
    content: {
      ...DIALOG_DATA.content,
    },
  };

  constructor(private userService: UserService,
              private credentialService: CredentialService,
              private dialogUtil: DialogUtil,
              private toastUtil: ToastUtil) {
  }

  @Input() username: string;
  @Input() user: UserVO;

  verticalLayout: FormLayout = FormLayout.Vertical;
  sshKey: string;

  ngOnInit(): void {
    const lab = this.user.email;
    this.ed25519Command = `ssh-keygen -t ed25519 -C "${lab}"`;
    this.rsaCommand = `ssh-keygen -t rsa -b 2048 -C "${lab}"`;
    this.sshKeyExample = `
    #### For ED25519
    \`\`\`bash
    $ ssh-keygen -t ed25519 -C "${lab}"
    \`\`\`

    #### For 2048-bit RSA
    \`\`\`bash
    $ ssh-keygen -t rsa -b 2048 -C "${lab}"
    \`\`\`
    `;
    const hostUrl = window.location.hostname;
    const username = this.username;
    this.sshCommand = `ssh ${username}@${hostUrl}`;
    this.sshExample = `
    \`\`\`bash
    $ ssh ${username}@${hostUrl}
    \`\`\`
    `;
    this.fetchData();
    setTimeout(() => this.runDemo(), 500);
  }

  fetchData() {
    this.userService.queryMySshKey()
      .subscribe(({ body }) => this.sshKeyList = body);
  }

  submitForm({ valid, directive }) {
    if (valid) {
      const param: AddSshKey = {
        pubKey: this.sshKey,
      };
      this.userService.addMySshKey(param)
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.ADD);
          this.fetchData();
        });
    } else {
      console.log(directive);
    }
  }

  onRowDelete(rowItem: CredentialVO) {
    const dialogDate = {
      ...this.dialogDate.warningOperateData,
      content: this.dialogDate.content.delete,
    };
    this.dialogUtil.onDialog(dialogDate, () => {
      this.credentialService.deleteMyCredentialById({ id: rowItem.id })
        .subscribe(() => {
          this.toastUtil.onSuccessToast(TOAST_CONTENT.DELETE);
          this.fetchData();
        });
    });
  }

  protected readonly getRowColor = getRowColor;
  protected readonly limit = RELATIVE_TIME_LIMIT;

  private demoScript: { type: 'type' | 'print' | 'pause', text?: string, delay?: number }[] = [];

  private initDemoScript() {
    const hostname = window.location.hostname;
    const username = this.username;
    this.demoScript = [
      { type: 'type', text: `ssh ${username}@${hostname}`, delay: 60 },
      { type: 'pause', delay: 800 },
      { type: 'print', text: '<span style="color:#fa9841;">** WARNING: connection is not using a post-quantum key exchange algorithm.</span>' },
      { type: 'print', text: '<span style="color:#fa9841;">** This session may be vulnerable to "store now, decrypt later" attacks.</span>' },
      { type: 'print', text: '<span style="color:#fa9841;">** The server may need to be upgraded. See https://openssh.com/pq.html</span>' },
      { type: 'print', text: '<span style="color:#3ac295;">                     __</span>' },
      { type: 'print', text: '<span style="color:#3ac295;">  ________________ _/  |_  ____  ______</span>' },
      { type: 'print', text: '<span style="color:#3ac295;">_/ ___\\_  __ \\__  \\\\   __\\/  _ \\/  ___/</span>' },
      { type: 'print', text: '<span style="color:#3ac295;">\\  \\___|  | \\// __ \\|  | (  &lt;_&gt; )___ \\</span>' },
      { type: 'print', text: '<span style="color:#3ac295;"> \\___  &gt;__|  (____  /__|  \\____/____  &gt;</span>' },
      { type: 'print', text: '<span style="color:#3ac295;">     \\/           \\/                \\/   version:1.1.0</span>' },
      { type: 'print', text: '' },
      { type: 'print', text: 'Please type `<span style="color:#5e7ce0;">help</span>` to see available commands' },
      { type: 'type', text: 'help', delay: 100 },
      { type: 'pause', delay: 300 },
      { type: 'print', text: '<span style="color:#5e7ce0;font-weight:bold;">AVAILABLE COMMANDS</span>' },
      { type: 'print', text: '' },
      { type: 'print', text: '<span style="color:#fa9841;">Application Commands</span>' },
      { type: 'print', text: '       <span style="color:#5e7ce0;">app-grouping</span>: Grouping Application' },
      { type: 'print', text: '       <span style="color:#5e7ce0;">app-group-list</span>: List Application Group' },
      { type: 'print', text: '' },
      { type: 'print', text: '<span style="color:#fa9841;">Automatic Certificate Management Environment</span>' },
      { type: 'print', text: '       <span style="color:#5e7ce0;">acme-cert-issue</span>: Show ACME order certificate' },
      { type: 'print', text: '       <span style="color:#5e7ce0;">acme-domain-list</span>: List ACME domain' },
      { type: 'print', text: '       <span style="color:#5e7ce0;">acme-order-list</span>: List ACME domain orders' },
      { type: 'print', text: '' },
      { type: 'print', text: '<span style="color:#fa9841;">Built-In Commands</span>' },
      { type: 'print', text: '       <span style="color:#5e7ce0;">help</span>: Display help about available commands' },
      { type: 'print', text: '       <span style="color:#5e7ce0;">clear</span>: Clear the shell screen.' },
      { type: 'print', text: '       <span style="color:#5e7ce0;">quit, exit</span>: Exit the shell.' },
      { type: 'print', text: '       <span style="color:#5e7ce0;">version</span>: Show version info' },
      { type: 'print', text: '' },
      { type: 'print', text: '<span style="color:#fa9841;">Eds CloudComputer Commands</span>' },
      { type: 'print', text: '       <span style="color:#5e7ce0;">computer-login, cl, login</span>: Open to the computer.' },
      { type: 'print', text: '       <span style="color:#5e7ce0;">computer-list, ls</span>: List computer asset' },
      { type: 'print', text: '' },
      { type: 'print', text: '<span style="color:#fa9841;">Eds Kubernetes Commands</span>' },
      { type: 'print', text: '       <span style="color:#5e7ce0;">kubernetes-pod-login, pl</span>: Open to the pod(container).' },
      { type: 'print', text: '       <span style="color:#5e7ce0;">kubernetes-deployment-list</span>: List deployment' },
      { type: 'print', text: '       <span style="color:#5e7ce0;">kubernetes-pod-list</span>: List pod' },
      { type: 'print', text: '' },
      { type: 'print', text: '<span style="color:#fa9841;">SSH Key Commands</span>' },
      { type: 'print', text: '       <span style="color:#5e7ce0;">sshkey-add</span>: Add my sshkey' },
      { type: 'print', text: '       <span style="color:#5e7ce0;">sshkey-list</span>: List my sshkey' },
      { type: 'print', text: '' },
    ];
  }

  async runDemo() {
    this.initDemoScript();
    this.demoRunning = true;
    this.demoLines = [];
    this.demoCursorVisible = true;
    let currentPrompt = 'MacBook-Pro$ ';

    for (const step of this.demoScript) {
      if (step.type === 'type') {
        // Simulate typing character by character
        let typed = '';
        this.demoLines.push(currentPrompt);
        const lineIdx = this.demoLines.length - 1;
        for (const ch of step.text) {
          typed += ch;
          this.demoLines[lineIdx] = `<span style="color:#3ac295;">${currentPrompt}</span>${typed}`;
          this.scrollDemo();
          await this.delay(step.delay || 60);
        }
        await this.delay(200);
        // "Enter"
        currentPrompt = 'cratos&gt;';
      } else if (step.type === 'print') {
        this.demoLines.push(step.text);
        this.scrollDemo();
        await this.delay(20);
      } else if (step.type === 'pause') {
        await this.delay(step.delay || 500);
      }
    }
    // Final prompt
    this.demoLines.push(`<span style="color:#3ac295;">cratos&gt;</span>`);
    this.scrollDemo();
    this.demoRunning = false;
    // Loop: restart after pause
    await this.delay(5000);
    if (!this.demoRunning) {
      this.runDemo();
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private scrollDemo() {
    setTimeout(() => {
      if (this.terminalDemo?.nativeElement) {
        this.terminalDemo.nativeElement.scrollTop = this.terminalDemo.nativeElement.scrollHeight;
      }
    });
  }
}
