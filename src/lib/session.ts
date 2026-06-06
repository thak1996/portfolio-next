const encoder = new TextEncoder();

async function getCryptoKey(secret: string) {
  const keyData = encoder.encode(secret);
  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function signSession(payload: { email: string; expiresAt: number }, secret: string) {
  const dataStr = JSON.stringify(payload);
  const key = await getCryptoKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(dataStr));
  const signatureHex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return btoa(dataStr) + '.' + signatureHex;
}

export async function verifySession(token: string, secret: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const dataStr = atob(parts[0]);
    const signatureHex = parts[1];
    const payload = JSON.parse(dataStr);

    if (payload.expiresAt < Date.now()) return null;

    const key = await getCryptoKey(secret);
    const signatureBytes = new Uint8Array(
      signatureHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
    );
    const dataBytes = encoder.encode(dataStr);
    const isValid = await crypto.subtle.verify('HMAC', key, signatureBytes, dataBytes);
    return isValid ? payload : null;
  } catch (e) {
    return null;
  }
}

export async function requireAuth() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  
  if (!token) {
    throw new Error('Acesso negado: Sessão não encontrada.');
  }

  const secret = process.env.JWT_SECRET || 'super-secret-key-change-this-in-production-12345678';
  const session = await verifySession(token, secret);
  
  if (!session || !session.email) {
    throw new Error('Acesso negado: Sessão inválida.');
  }

  return session;
}
