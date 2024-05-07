import { isNil, map } from 'lodash';
import { setStorage, getStorage } from 'zmp-sdk/apis';

let storage: any = {};

class CookiesServiceClass {
  private listeners: Array<() => void> = [];
  private isInitialDone: boolean = false;
  constructor() {
    getStorage({
      success: (data: any) => {
        storage = data;
        map(this.listeners, (listener) => {
          listener?.();
        });
        this.isInitialDone = true;
      },
      fail: (err: any) => {
        console.log(err);
        this.isInitialDone = true;
        map(this.listeners, (listener) => {
          listener?.();
        });
      },
      keys: ['token', 'refCode', 'introduction', 'affSharedSession', 'orderData'],
    });

    setTimeout(() => {
      if (!this.isInitialDone) {
        map(this.listeners, (listener) => {
          listener?.();
        });
      }
    }, 3000);
  }

  checkInitialDone = () => {
    return this.isInitialDone;
  };

  addInitialDoneListener = (listener: () => void) => {
    this.listeners.push(listener);
    if (this.isInitialDone) {
      listener?.();
    }
  };

  // set cookie cho cliet, truyền key, value, thời hạn
  customClientCookies = (key: string, value: any, age: number) => {
    storage[key] = value;
    setStorage({
      data: {
        ...storage,
        [key]: value,
      },
      success: (data) => {
        // xử lý khi gọi api thành công
        const { errorKeys } = data;
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
      },
    });
  };

  // Phía client
  setClientCookies = (key: string, value: any) => {
    storage[key] = value;
    setStorage({
      data: {
        ...storage,
        [key]: value,
      },
      success: (data) => {
        // xử lý khi gọi api thành công
        const { errorKeys } = data;
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
      },
    });
  };

  getClientCookies = (key: string, defaultValue?: string) => {
    if (isNil(storage[key])) {
      return defaultValue ?? undefined;
    }
    return storage[key];
  };

  // Xoá cookies phía client
  destroyClientCookies = (key: string) => {
    delete storage[key];
    setStorage({
      data: {
        ...storage,
        [key]: null,
      },
    });
  };

  hasClientKey = (key: string) => {
    return !isNil(storage[key]);
  };

  getAll = () => {
    return storage;
  };
}

const CookiesService = new CookiesServiceClass();
export default CookiesService;
