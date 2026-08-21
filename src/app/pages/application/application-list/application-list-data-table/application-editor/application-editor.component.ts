import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormLayout } from 'ng-devui/form';
import { DValidateRules } from 'ng-devui';
import { ApplicationEdit, ApplicationVO } from '../../../../../@core/data/application';
import { ApplicationService } from '../../../../../@core/services/application.service';
import { AceEditorComponent } from '../../../../../@shared/components/common/ace-editor/ace-editor.component';

interface BuildItem {
  project?: string;
  sshUrl?: string;
  type?: string;
  buildCmd?: string;
  buildArgs?: string;
  branch?: string;
  moduleName?: string;
  jdkVersion?: string;
}

@Component({
  selector: 'app-application-editor',
  templateUrl: './application-editor.component.html',
  styleUrls: [ './application-editor.component.less' ],
})
export class ApplicationEditorComponent implements OnInit {

  layoutDirection: FormLayout = FormLayout.Vertical;
  @Input() data: any;
  @ViewChild(AceEditorComponent) aceEditor: AceEditorComponent;
  formData: ApplicationVO;

  // builds 表单
  readonly buildTypes = [ 'maven', 'gradle', 'node' ];
  // 各构建类型的默认 buildCmd
  private readonly defaultBuildCmds: { [type: string]: string } = {
    maven: '/opt/tools/maven/bin/mvn',
    gradle: '/opt/tools/gradle-4.6/bin/gradle',
  };
  // 字段顺序（序列化时保持稳定）
  private readonly buildFieldOrder: (keyof BuildItem)[] = [
    'branch', 'buildArgs', 'buildCmd', 'jdkVersion', 'moduleName', 'project', 'sshUrl', 'type',
  ];
  builds: BuildItem[] = [];

  // Config(YAML) 默认收起
  showConfig = false;

  formRules: { [key: string]: DValidateRules } = {
    rule: { message: 'The form verification failed, please check.', messageShowType: 'text' },
    name: {
      validators: [ { required: true } ],
      message: 'name can not be null.',
    },
  };

  constructor(private applicationService: ApplicationService) {
  }

  ngOnInit(): void {
    this.formData = this.data[ 'formData' ];
    this.builds = this.parseBuilds(this.formData?.config || '');
  }

  addForm() {
    const param: ApplicationEdit = {
      ...this.formData,
    };
    return this.applicationService.addApplication(param);
  }

  updateForm() {
    const param: ApplicationEdit = {
      ...this.formData,
    };
    return this.applicationService.updateApplication(param);
  }

  onConfigChange(config: string, applicationVO: ApplicationVO) {
    applicationVO.config = config;
  }

  // ===== builds 表单操作 =====
  addBuild() {
    const type = this.buildTypes[ 0 ];
    this.builds.push({ type, buildCmd: this.defaultBuildCmd(type) });
    this.syncBuildsToConfig();
  }

  removeBuild(index: number) {
    this.builds.splice(index, 1);
    this.syncBuildsToConfig();
  }

  onBuildTypeChange(build: BuildItem, type: string) {
    const prevDefault = this.defaultBuildCmd(build.type);
    build.type = type;
    // buildCmd 为空或仍是上一类型的默认值时，自动切换为当前类型的默认命令(不覆盖自定义值)
    if (!build.buildCmd || build.buildCmd === prevDefault) {
      build.buildCmd = this.defaultBuildCmd(type);
    }
    this.syncBuildsToConfig();
  }

  /** 按构建类型返回默认 buildCmd */
  private defaultBuildCmd(type?: string): string {
    return this.defaultBuildCmds[ type || '' ] || '';
  }

  // 表单变更后，将 builds 序列化回配置字符串（保留其余内容），并刷新 YAML 编辑器展示
  syncBuildsToConfig() {
    const newConfig = this.spliceBuilds(this.formData.config || '', this.serializeBuilds(this.builds));
    this.formData.config = newConfig;
    this.aceEditor?.onWrite(newConfig);
  }

  // ===== YAML(builds 块) 解析/序列化：仅处理 builds 块，其余内容原样保留 =====
  private parseBuilds(config: string): BuildItem[] {
    if (!config) {
      return [];
    }
    const lines = config.split('\n');
    const start = this.findBuildsLine(lines);
    if (start === -1) {
      return [];
    }
    const inline = lines[ start ].replace(/^builds:\s*/, '').trim();
    if (inline === 'null' || inline === '~' || inline === '[]') {
      return [];
    }
    const builds: BuildItem[] = [];
    let current: BuildItem | null = null;
    for (let i = start + 1; i < lines.length; i++) {
      const line = lines[ i ];
      if (line.trim() === '') {
        continue;
      }
      // 顶格且非序列项 => builds 块结束
      if (/^\S/.test(line) && !/^-\s/.test(line)) {
        break;
      }
      const itemMatch = line.match(/^\s*-\s+(\S+?):\s?(.*)$/);
      if (itemMatch) {
        current = {};
        builds.push(current);
        (current as any)[ itemMatch[ 1 ] ] = this.unquote(itemMatch[ 2 ]);
        continue;
      }
      const fieldMatch = line.match(/^\s+(\S+?):\s?(.*)$/);
      if (fieldMatch && current) {
        (current as any)[ fieldMatch[ 1 ] ] = this.unquote(fieldMatch[ 2 ]);
      }
    }
    return builds;
  }

  private serializeBuilds(builds: BuildItem[]): string {
    if (!builds || builds.length === 0) {
      return 'builds: []';
    }
    const lines: string[] = [ 'builds:' ];
    for (const b of builds) {
      const keys = this.buildFieldOrder.filter(k => {
        const v = b[ k ];
        return v != null && String(v).length > 0;
      });
      if (keys.length === 0) {
        // 所有字段为空时，生成默认配置(占位)
        lines.push('- moduleName: \'\'');
        continue;
      }
      keys.forEach((k, idx) => {
        const val = this.quote(String(b[ k ]));
        lines.push(idx === 0 ? `- ${k}: ${val}` : `  ${k}: ${val}`);
      });
    }
    return lines.join('\n');
  }

  private spliceBuilds(config: string, buildsBlock: string): string {
    const lines = (config || '').split('\n');
    const block = buildsBlock.split('\n');
    const start = this.findBuildsLine(lines);
    if (start === -1) {
      // 无 builds 块：插入到文档结束标记(...) 之前，否则追加末尾
      let insertAt = lines.length;
      for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[ i ].trim() === '...') {
          insertAt = i;
          break;
        }
      }
      lines.splice(insertAt, 0, ...block);
      return lines.join('\n');
    }
    // 定位 builds 块结束位置：首个顶格且非序列项的行
    let end = lines.length;
    for (let i = start + 1; i < lines.length; i++) {
      const line = lines[ i ];
      if (line.trim() === '') {
        continue;
      }
      if (/^\S/.test(line) && !/^-\s/.test(line)) {
        end = i;
        break;
      }
    }
    lines.splice(start, end - start, ...block);
    return lines.join('\n');
  }

  private findBuildsLine(lines: string[]): number {
    for (let i = 0; i < lines.length; i++) {
      if (/^builds:/.test(lines[ i ]) && !/^\s/.test(lines[ i ])) {
        return i;
      }
    }
    return -1;
  }

  private unquote(value: string): string {
    if (value == null) {
      return '';
    }
    const s = value.trim();
    if (s.length >= 2 && s.startsWith('\'') && s.endsWith('\'')) {
      return s.slice(1, -1).replace(/''/g, '\'');
    }
    if (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) {
      return s.slice(1, -1).replace(/\\"/g, '"');
    }
    return s;
  }

  private quote(value: string): string {
    // 统一单引号包裹，内部单引号双写转义（合法 YAML，SnakeYAML 按字符串加载）
    return `'${value.replace(/'/g, '\'\'')}'`;
  }

}
