/**
 * Ver: 1.0.4
 * Cloudflare Worker - 解密请求体并回源
 * 用于解密前端加密的请求，然后转发到源站
 * 
 * Changelog:
 * - 1.0.4: 添加详细的解密错误信息（区分 encryptedKey 和 encryptedBody 解密失败）
 * - 1.0.3: 之前版本
 */
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env);
  }
};

async function handleRequest(request, env) {
  // 从环境变量读取私钥
  const PRIVATE_KEY_PEM = env.PRIVATE_KEY_PEM;

  if (!PRIVATE_KEY_PEM) {
    console.error('Private key not configured');
    return new Response('Private key not configured', { status: 500 });
  }
  
  // 只处理 POST/PUT/PATCH/DELETE 请求
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
    console.log('Non-modifying request, passing through');
    return fetch(request);
  }

  try {
    const contentType = request.headers.get('content-type') || '';

    // 检查是否是加密的请求
    if (!contentType.includes('application/json')) {
      console.log('Non-JSON request, passing through');
      return fetch(request);
    }

    // 克隆请求以便读取 body
    const clonedRequest = request.clone();
    let body;
    
    try {
      const text = await clonedRequest.text();
      // 如果 body 为空，直接转发
      if (!text || text.trim() === '') {
        console.log('Empty body, passing through');
        return fetch(request);
      }
      body = JSON.parse(text);
    } catch (e) {
      // JSON 解析失败，直接转发
      console.log('Invalid JSON, passing through');
      return fetch(request);
    }

    // 检查是否包含加密字段
    if (!body.encryptedBody || !body.encryptedKey) {
      // 没有加密，直接转发原始请求
      console.log('Non-encrypted request, passing through');
      return fetch(request);
    }

    console.log('Encrypted request detected, decrypting...');

    // 检查是否需要加密响应
    const needEncryptResponse = request.headers.get('X-Response-Encryption-Required') === 'true';

    // 1. 用 RSA 私钥解密 AES 密钥
    const aesKeyBytes = await decryptWithRSA(body.encryptedKey, PRIVATE_KEY_PEM);

    // 2. 用 AES 密钥解密请求体
    const decryptedBody = await decryptWithAES(body.encryptedBody, aesKeyBytes);

    console.log('Request decrypted successfully');

    // 3. 创建新的 Headers，移除加密相关的 Header
    const newHeaders = new Headers(request.headers);
    newHeaders.delete('X-Body-Encrypted');
    newHeaders.delete('X-Encryption-Key-Version');
    newHeaders.delete('X-Response-Encryption-Required');

    // 创建新的请求，使用解密后的 body
    const newRequest = new Request(request.url, {
      method: request.method,
      headers: newHeaders,
      body: decryptedBody
    });

    // 转发到源站
    console.log('Forwarding decrypted request to origin');
    const response = await fetch(newRequest);

    // 如果需要加密响应且响应成功
    if (needEncryptResponse && response.ok) {
      console.log('Encrypting response...');
      const responseData = await response.json();
      const encryptedResponse = await encryptResponse(responseData, aesKeyBytes);
      
      console.log('Response encrypted successfully');
      return new Response(JSON.stringify({ encryptedData: encryptedResponse }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          ...Object.fromEntries(response.headers)
        }
      });
    }

    console.log('Returning response as-is');
    return response;

  } catch (error) {
    console.error('Worker error:', error.message, error.stack);
    
    // 判断错误类型
    let errorMsg = 'E2EE: ';
    if (error.message && error.message.includes('decrypt')) {
      if (error.stack && error.stack.includes('decryptWithRSA')) {
        errorMsg += 'decrypt encryptedKey fail';
      } else if (error.stack && error.stack.includes('decryptWithAES')) {
        errorMsg += 'decrypt encryptedBody fail';
      } else {
        errorMsg += error.message;
      }
    } else {
      errorMsg += error.message || 'unknown error';
    }
    
    return new Response(JSON.stringify({
      code: 400,
      msg: errorMsg
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * RSA 解密 AES 密钥
 */
async function decryptWithRSA(encryptedKeyBase64, privateKeyPem) {
  // 导入 RSA 私钥
  const privateKey = await importPrivateKey(privateKeyPem);

  // Base64 解码
  const encryptedKey = base64ToArrayBuffer(encryptedKeyBase64);

  // RSA 解密
  const aesKeyBytes = await crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    encryptedKey
  );

  return aesKeyBytes;
}

/**
 * AES-GCM 解密
 */
async function decryptWithAES(encryptedText, aesKeyBytes) {
  // 分割 IV 和密文: Base64(IV).Base64(Ciphertext)
  const [ivBase64, ciphertextBase64] = encryptedText.split('.');

  const iv = base64ToArrayBuffer(ivBase64);
  const ciphertext = base64ToArrayBuffer(ciphertextBase64);

  // 导入 AES 密钥
  const aesKey = await crypto.subtle.importKey(
    'raw',
    aesKeyBytes,
    { name: 'AES-GCM' },
    false,
    ['decrypt']
  );

  // AES-GCM 解密
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(iv) },
    aesKey,
    ciphertext
  );

  // 转换为字符串
  return new TextDecoder().decode(decrypted);
}

/**
 * 加密响应数据
 */
async function encryptResponse(data, aesKeyBytes) {
  // 导入 AES 密钥（用于加密）
  const aesKey = await crypto.subtle.importKey(
    'raw',
    aesKeyBytes,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  // 生成随机 IV
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // 将数据转换为字符串
  const jsonString = JSON.stringify(data);
  const encoder = new TextEncoder();
  const plaintext = encoder.encode(jsonString);

  // AES-GCM 加密
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    aesKey,
    plaintext
  );

  // 格式: Base64(IV).Base64(Ciphertext)
  const ivBase64 = arrayBufferToBase64(iv);
  const ciphertextBase64 = arrayBufferToBase64(ciphertext);

  return `${ivBase64}.${ciphertextBase64}`;
}

/**
 * 导入 RSA 私钥
 */
async function importPrivateKey(pem) {
  // 移除 PEM 头尾
  const pemContents = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');

  // Base64 解码
  const binaryDer = base64ToArrayBuffer(pemContents);

  // 导入私钥
  return crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    false,
    ['decrypt']
  );
}

/**
 * Base64 转 ArrayBuffer
 */
function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * ArrayBuffer 转 Base64
 */
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
