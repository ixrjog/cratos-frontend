import { IDisposable, Terminal } from '@xterm/xterm';

/**
 * 输入法影响窗口(毫秒)。由 composition 事件或输入法切换键(CapsLock/Shift)武装,
 * 窗口内才会启用重复投递去重, 窗口外完全不干预正常输入。
 */
const IME_WINDOW_MS = 250;

/** 判定"同一段文本被投递两次"的时间间隔上限(毫秒) */
const DEDUPE_MS = 250;

/** 开启调试: localStorage.setItem('cratos.debug.ime', '1') 后刷新, 控制台会打印真实事件序列 */
const DEBUG_KEY = 'cratos.debug.ime';

/** 输入法切换/提交相关按键: macOS 用 CapsLock 切中英, 部分输入法用 Shift */
const IME_SWITCH_KEYS = new Set([ 'CapsLock', 'Shift', 'Process' ]);

/**
 * 是否为纯文本(不含控制字符/转义序列)。
 * 方向键(\x1b[A)、回车(\r)等控制序列会因按键重复而合法地连续出现相同值, 必须排除在去重之外。
 */
function isPlainText(data: string): boolean {
  return !/[\x00-\x1f\x7f]/.test(data);
}

function isDebugEnabled(): boolean {
  try {
    return localStorage.getItem(DEBUG_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * 注册终端输入监听, 并修复 xterm.js 5.x 的输入法重复输入问题。
 *
 * 现象: 中文输入法下键入 ping, 按 macOS 的 CapsLock 切换英文, 终端收到 pingping。
 * 原因: xterm 的 CompositionHelper 在组合结束时通过 triggerDataEvent 发送一次结果, 并抑制随后的
 *      input 事件; 但由输入法切换键提交的组合会绕过该抑制(compositionend 往往不带 data, 甚至不触发),
 *      随后的 input 事件携带同样文本再发一次, 两次都从 onData 出来。
 * 处理: 不依赖 compositionend 的 data。由 composition 事件与输入法切换键共同武装一个 250ms 窗口,
 *      窗口内丢弃"与上一次完全相同、且间隔在 250ms 内"的多字符纯文本投递。控制/转义序列不参与去重,
 *      窗口外不做任何干预, 因此不影响正常输入与按键重复。
 *
 * @param terminal 已经 open() 过的 Terminal(需要 textarea 才能监听 composition 事件)
 * @param handler  真实的输入处理回调
 */
export function onTerminalDataWithImeFix(terminal: Terminal, handler: (data: string) => void): IDisposable {
  const debug = isDebugEnabled();

  let imeWindowUntil = 0;
  let lastData = '';
  let lastDataAt = 0;

  const armWindow = (reason: string): void => {
    imeWindowUntil = Date.now() + IME_WINDOW_MS;
    if (debug) {
      console.log('[ime] arm window by', reason);
    }
  };

  const onCompositionStart = (): void => armWindow('compositionstart');
  const onCompositionUpdate = (): void => armWindow('compositionupdate');
  const onCompositionEnd = (event: CompositionEvent): void => {
    armWindow(`compositionend data=${JSON.stringify(event.data)}`);
  };
  const onKeyDown = (event: KeyboardEvent): void => {
    if (IME_SWITCH_KEYS.has(event.key)) {
      armWindow(`keydown ${event.key}`);
    }
  };
  const onBeforeInput = (event: Event): void => {
    if (debug) {
      const ie = event as InputEvent;
      console.log('[ime] beforeinput', JSON.stringify(ie.data), ie.inputType, 'isComposing=', ie.isComposing);
    }
  };

  // textarea 在 terminal.open() 之后才存在; 缺失时退化为不去重, 不影响正常输入
  const textarea: HTMLTextAreaElement | undefined = terminal.textarea;
  textarea?.addEventListener('compositionstart', onCompositionStart);
  textarea?.addEventListener('compositionupdate', onCompositionUpdate);
  textarea?.addEventListener('compositionend', onCompositionEnd);
  textarea?.addEventListener('keydown', onKeyDown);
  if (debug) {
    textarea?.addEventListener('beforeinput', onBeforeInput);
    console.log('[ime] debug enabled, textarea =', textarea);
  }

  const dataDisposable = terminal.onData((data: string) => {
    const now = Date.now();
    const inImeWindow = now <= imeWindowUntil;
    if (debug) {
      console.log('[ime] onData', JSON.stringify(data), 'inWindow=', inImeWindow);
    }

    if (inImeWindow && data.length >= 2 && isPlainText(data) && data === lastData && now - lastDataAt <= DEDUPE_MS) {
      if (debug) {
        console.log('[ime] dropped duplicate', JSON.stringify(data));
      }
      // 丢弃后清空基准, 避免连续三次相同投递时把第三次也误判为重复
      lastData = '';
      return;
    }

    lastData = data;
    lastDataAt = now;
    handler(data);
  });

  return {
    dispose: (): void => {
      textarea?.removeEventListener('compositionstart', onCompositionStart);
      textarea?.removeEventListener('compositionupdate', onCompositionUpdate);
      textarea?.removeEventListener('compositionend', onCompositionEnd);
      textarea?.removeEventListener('keydown', onKeyDown);
      textarea?.removeEventListener('beforeinput', onBeforeInput);
      dataDisposable.dispose();
    },
  };
}
