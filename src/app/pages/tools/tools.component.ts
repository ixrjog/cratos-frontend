import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface ToolCard {
  key: string;
  name: string;
  desc: string;
  icon: string;
  route?: string[]; // 已实现的工具带路由；未实现的为占位
}

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: [ './tools.component.less' ],
})
export class ToolsComponent {
  constructor(private router: Router) {}

  // 小工具清单：后续在这里追加即可，模板会自动渲染卡片
  tools: ToolCard[] = [
    { key: 'json', name: 'JSON 格式化', desc: '美化 / 压缩 / 校验 / 转义 JSON', icon: 'icon-code', route: [ '/pages', 'tools', 'json' ] },
    { key: 'base64', name: 'Base64 编解码', desc: '文本 / 文件 Base64 编解码', icon: 'icon-file', route: [ '/pages', 'tools', 'base64' ] },
    { key: 'ssh-keygen', name: 'SSH 密钥生成', desc: 'RSA / Ed25519 OpenSSH 密钥对', icon: 'icon-locked-key', route: [ '/pages', 'tools', 'ssh-keygen' ] },
    { key: 'password', name: '随机密码生成', desc: '加密安全随机密码，多种字符集', icon: 'icon-hotkey', route: [ '/pages', 'tools', 'password' ] },
    { key: 'hash', name: 'Hash 值计算', desc: 'MD5 / SHA-1 / SHA-256/384/512', icon: 'icon-scan-focus', route: [ '/pages', 'tools', 'hash' ] },
    { key: 'world-clock', name: '世界时间', desc: '多国家/城市实时时间，可增删', icon: 'icon-global-guide', route: [ '/pages', 'tools', 'world-clock' ] },
    // 以下为占位，后续实现后补上 route 即可
    { key: 'timestamp', name: '时间戳转换', desc: 'Unix 时间戳 <-> 日期互转', icon: 'icon-time' },
  ];

  onOpen(tool: ToolCard): void {
    if (tool.route) {
      this.router.navigate(tool.route);
    }
  }
}
