import { safeStorage } from 'electron';
import Store from 'electron-store';
import { LoginRequest } from '../models/users/loginRequest';

const PASSWORD_KEY = 'passwordEncrypted';
const USERNAME_KEY = 'username';

const store = new Store<Record<string, string>>({
  name: 'launcher-encrypted',
  watch: true,
  encryptionKey: 'only-for-obfuscation',
});

export function storeCredentials(credentials: LoginRequest) {
  if (!safeStorage.isEncryptionAvailable()) {
    console.warn('Encryption unavailable. Credentials would not be stored!');
  }

  const buffer = safeStorage.encryptString(credentials.password);
  store.set(PASSWORD_KEY, buffer.toString('base64'));
  store.set(USERNAME_KEY, credentials.username);
}

export function getCredentials(): LoginRequest {
  if (!store.has(PASSWORD_KEY)) {
    return undefined;
  }

  const encryptedPassword = store.get(PASSWORD_KEY);
  const rawPassword = safeStorage.decryptString(
    Buffer.from(encryptedPassword, 'base64'),
  );

  const rawUsername = store.get(USERNAME_KEY);

  return {
    username: rawUsername,
    password: rawPassword,
  };
}

export function clearCredentials() {
  if (store.has(PASSWORD_KEY)) {
    store.delete(PASSWORD_KEY);
  }

  if (store.has(USERNAME_KEY)) {
    store.delete(USERNAME_KEY);
  }
}
