/**
 * Cloudflare Worker - 解密请求体并回源
 * 用于解密前端加密的请求，然后转发到源站
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
    return new Response('Private key not configured', { status: 500 });
  }
  // 只处理 POST/PUT/PATCH 请求
  if (!['POST', 'PUT', 'PATCH'].includes(request.method)) {
    return fetch(request);
  }

  try {
    const contentType = request.headers.get('content-type') || '';

    // 检查是否是加密的请求
    if (!contentType.includes('application/json')) {
      return fetch(request);
    }

    const body = await request.json();

    // 检查是否包含加密字段
    if (!body.encryptedBody || !body.encryptedKey) {
      // 没有加密，直接转发
      return fetch(request);
    }

    // 解密请求体
    const decryptedBody = await decryptBody(body.encryptedBody, body.encryptedKey, PRIVATE_KEY_PEM);

    // 创建新的请求，使用解密后的 body
    const newRequest = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: decryptedBody
    });

    // 转发到源站
    return fetch(newRequest);

  } catch (error) {
    console.error('Decryption error:', error);
    return new Response(JSON.stringify({ error: 'Decryption failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * 解密 Body
 */
async function decryptBody(encryptedBody, encryptedKey, privateKeyPem) {
  // 1. 用 RSA 私钥解密 AES 密钥
  const aesKey = await decryptWithRSA(encryptedKey, privateKeyPem);

  // 2. 用 AES 密钥解密 Body
  const decryptedText = await decryptWithAES(encryptedBody, aesKey);

  return decryptedText;
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
    { name: 'AES-GCM', iv: iv },
    aesKey,
    ciphertext
  );

  // 转换为字符串
  return new TextDecoder().decode(decrypted);
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
