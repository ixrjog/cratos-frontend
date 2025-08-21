# Web Terminal "已打开" 标记功能

## 功能概述

在Web Terminal的资产选择抽屉中，新增了"已打开"标记功能。当用户点击打开终端后，该资产会显示一个绿色的"已打开"标签，方便用户识别哪些终端已经被打开。

## 功能特性

### 1. 视觉标记
- 在资产名称旁边显示绿色的"已打开"标签
- 使用DevUI的tag组件，样式为`green-w98`
- 支持中英文国际化显示

### 2. 状态跟踪
- 使用Set数据结构跟踪已打开的终端
- 支持单个资产点击和批量选择
- 基于资产的唯一标识符（ID、assetKey或name）进行跟踪

### 3. 持久化
- 在当前会话中保持状态
- 支持手动清除所有已打开标记

## 实现细节

### 前端组件修改

#### HTML模板 (`web-terminal-drawer.component.html`)
```html
<d-column field="name" header="Name" [width]="'180px'">
  <d-cell>
    <ng-template let-rowItem="rowItem" let-cellItem="cellItem">
      <div class="asset-name-container">
        <span
          class="asset-name-link"
          (click)="onAssetClick(rowItem)"
          [title]="cellItem">
          {{ cellItem }}
        </span>
        <d-tag
          *ngIf="isTerminalOpened(rowItem)"
          class="opened-tag"
          [labelStyle]="'green-w98'"
          [tag]="{ name: 'webTerminal.opened' | translate }">
        </d-tag>
      </div>
    </ng-template>
  </d-cell>
</d-column>
```

#### TypeScript组件 (`web-terminal-drawer.component.ts`)
```typescript
// 跟踪已打开的终端
private openedTerminals = new Set<string>();

/**
 * 标记终端为已打开状态
 */
private markTerminalAsOpened(asset: EdsAssetVO): void {
  const terminalKey = String(asset.id || asset.assetKey || asset.name);
  this.openedTerminals.add(terminalKey);
}

/**
 * 检查终端是否已打开
 */
public isTerminalOpened(asset: EdsAssetVO): boolean {
  const terminalKey = String(asset.id || asset.assetKey || asset.name);
  return this.openedTerminals.has(terminalKey);
}

/**
 * 清除已打开终端的标记
 */
public clearOpenedTerminals(): void {
  this.openedTerminals.clear();
}
```

#### 样式文件 (`web-terminal-drawer.component.less`)
```less
.asset-name-container {
  display: flex;
  align-items: center;
  gap: 8px;

  .asset-name-link {
    flex: 1;
  }

  .opened-tag {
    flex-shrink: 0;
    font-size: 11px;
    
    :deep(.devui-tag) {
      padding: 2px 6px;
      font-size: 11px;
      line-height: 1.2;
      border-radius: 10px;
    }
  }
}
```

### 国际化支持

#### 中文 (`zh-CN/web-terminal.ts`)
```typescript
opened: '已打开',
```

#### 英文 (`en-US/web-terminal.ts`)
```typescript
opened: 'Opened',
```

## 使用方式

1. **打开Web Terminal资产选择抽屉**
2. **点击任意资产名称打开终端**
   - 该资产旁边会立即显示绿色的"已打开"标签
3. **批量选择资产**
   - 选中多个资产后点击"打开"按钮
   - 所有选中的资产都会显示"已打开"标签
4. **状态持久化**
   - 在当前会话中，已打开的标记会一直保持
   - 刷新页面或重新打开抽屉后状态会重置

## 技术优势

1. **性能优化**: 使用Set数据结构，查找和添加操作时间复杂度为O(1)
2. **类型安全**: 完整的TypeScript类型定义和错误处理
3. **可扩展性**: 支持不同类型的资产标识符
4. **用户体验**: 直观的视觉反馈，避免重复打开相同终端
5. **国际化**: 完整的中英文支持

## 测试覆盖

- 单元测试覆盖所有核心功能
- 测试不同资产标识符的跟踪
- 测试批量操作的状态管理
- 测试状态清除功能

## 未来扩展

1. **持久化存储**: 可以考虑将状态保存到localStorage
2. **终端关闭检测**: 监听终端关闭事件，自动移除标记
3. **更多状态**: 可以扩展为显示连接状态（连接中、已连接、断开等）
4. **自定义样式**: 允许用户自定义标签颜色和样式
