import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserScriptVO } from '../../../../@core/data/user-script';

/**
 * 终端内脚本选择器(内联面板): 先按功能(function)分类, 再按系统类型(osType), 最后选具体脚本名称。
 * 以内联面板形式嵌入终端, 不使用全屏遮罩弹窗, 避免背景变色。
 */
@Component({
  selector: 'app-user-script-picker',
  templateUrl: './user-script-picker.component.html',
  styleUrls: [ './user-script-picker.component.less' ],
})
export class UserScriptPickerComponent implements OnInit {

  @Input() scripts: UserScriptVO[] = [];
  @Output() pick = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  functions: string[] = [];
  osTypes: string[] = [];
  scriptOptions: UserScriptVO[] = [];

  selectedFunction: string = null;
  selectedOsType: string = null;
  selectedScript: UserScriptVO = null;
  /** 在线可编辑内容(临时, 不保存回脚本库; 执行时以此内容为准) */
  editableContent = '';
  copied = false;

  private readonly UNCATEGORIZED = '-';
  /** 选择持久化 key */
  private readonly STORAGE_KEY = 'user-script-picker-selection';

  ngOnInit(): void {
    this.functions = this.distinct((this.scripts || []).map(s => s.function));
    this.restoreSelection();
  }

  /** 从 localStorage 恢复上次选择(逐级校验当前仍存在) */
  private restoreSelection(): void {
    let saved: { function?: string; osType?: string; scriptId?: number };
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) {
        return;
      }
      saved = JSON.parse(raw);
    } catch (e) {
      return;
    }
    if (!saved || !this.functions.includes(saved.function)) {
      return;
    }
    // 恢复功能 + 重建系统类型选项
    this.selectedFunction = saved.function;
    this.osTypes = this.distinct((this.scripts || []).filter(s => this.matchFunction(s)).map(s => s.osType));
    if (!this.osTypes.includes(saved.osType)) {
      return;
    }
    // 恢复系统类型 + 重建脚本选项
    this.selectedOsType = saved.osType;
    this.scriptOptions = (this.scripts || []).filter(s => this.matchFunction(s) && this.matchOsType(s));
    // 恢复脚本(按 id 匹配)
    const script = this.scriptOptions.find(s => s.id === saved.scriptId);
    if (script) {
      this.selectedScript = script;
      this.editableContent = script.scriptContent || '';
    }
  }

  /** 保存当前选择 */
  private persistSelection(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        function: this.selectedFunction,
        osType: this.selectedOsType,
        scriptId: this.selectedScript ? this.selectedScript.id : null,
      }));
    } catch (e) {
      // 忽略 localStorage 异常
    }
  }

  private distinct(list: string[]): string[] {
    const set = new Set<string>();
    list.forEach(v => set.add(v && v.trim() ? v : this.UNCATEGORIZED));
    return Array.from(set).sort();
  }

  private matchFunction(s: UserScriptVO): boolean {
    const f = s.function && s.function.trim() ? s.function : this.UNCATEGORIZED;
    return f === this.selectedFunction;
  }

  private matchOsType(s: UserScriptVO): boolean {
    const o = s.osType && s.osType.trim() ? s.osType : this.UNCATEGORIZED;
    return o === this.selectedOsType;
  }

  onSelectFunction(fn: string): void {
    this.selectedFunction = fn;
    this.selectedOsType = null;
    this.selectedScript = null;
    this.scriptOptions = [];
    this.osTypes = this.distinct((this.scripts || []).filter(s => this.matchFunction(s)).map(s => s.osType));
    this.persistSelection();
  }

  onSelectOsType(os: string): void {
    this.selectedOsType = os;
    this.selectedScript = null;
    this.scriptOptions = (this.scripts || []).filter(s => this.matchFunction(s) && this.matchOsType(s));
    this.persistSelection();
  }

  onSelectScript(script: UserScriptVO): void {
    this.selectedScript = script;
    this.editableContent = script ? (script.scriptContent || '') : '';
    this.copied = false;
    this.persistSelection();
  }

  onRun(): void {
    if (!this.selectedScript) {
      return;
    }
    // 以在线编辑后的内容为准执行(不保存回脚本库)
    this.pick.emit(this.editableContent);
  }

  /** 复制当前(可编辑)脚本内容到剪贴板 */
  onCopy(): void {
    const text = this.editableContent || '';
    const done = () => {
      this.copied = true;
      setTimeout(() => this.copied = false, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => this.fallbackCopy(text, done));
    } else {
      this.fallbackCopy(text, done);
    }
  }

  private fallbackCopy(text: string, done: () => void): void {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    } catch (e) {
      // 忽略复制失败
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
