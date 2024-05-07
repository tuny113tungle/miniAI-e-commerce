
import { useState } from 'react';
import { followOA, getAccessToken, getPhoneNumber, getUserInfo } from 'zmp-sdk/apis';
import { useShare } from './useShare';
import { useShopSetting } from './useShopSetting';
import API from '../apis/Api';
import CookiesService from '../apis/CookiesService';


interface IZaloInfo {
  zaloId: string;
  name: string;
  avatar: string;
  idByOA?: string;
  isSensitive?: boolean;
}

export const ERROR_CODES = {
  NOT_ALLOW: 'NOT_ALLOW',
  GET_ZALO_INFO_FAIL: 'GET_ZALO_INFO_FAIL',
  CHECK_LOGIN_ZALO_FAIL: 'CHECK_LOGIN_ZALO_FAIL',
  GET_ZALO_PHONE_FAIL: 'GET_ZALO_PHONE_FAIL',
  UPDATE_PHONE_FAIL: 'UPDATE_PHONE_FAIL',
  FOLLOW_OFFICIAL_ACCOUNT_FAIL: 'FOLLOW_OFFICIAL_ACCOUNT_FAIL',
  NOT_ALLOW_FOLLOW_OFFICIAL_ACCOUNT: 'NOT_ALLOW_FOLLOW_OFFICIAL_ACCOUNT',
  NOT_FOUNT_OFFICIAL_ACCOUNT: 'NOT_FOUNT_OFFICIAL_ACCOUNT',
};

export function useZaloAuth() {
  const [token, setToken] = useState<string | undefined>(undefined);
  console.log("🚀 ~ useZaloAuth ~ token:", token)
  const [zaloInfo, setZaloInfo] = useState<IZaloInfo | undefined>(undefined);
  const { getReferral } = useShare();
  const {data: shopSetting} = useShopSetting()

  // Lấy thông tin zalo info
  const getZaloInfo = async (): Promise<{
    info: IZaloInfo | undefined;
    allowed: boolean;
  }> => {
    try {
      const { userInfo } = await getUserInfo({});
      const formData = {
        zaloId: userInfo.id,
        name: userInfo.name,
        avatar: userInfo.avatar,
      };
      setZaloInfo(formData);
      return { info: formData, allowed: true };
    } catch (error) {
      return {
        info: undefined,
        allowed: false,
      };
    }
  };

  // Đăng nhập
  const checkLoginZalo = async (
    zaloInfo: IZaloInfo,
  ): Promise<{
    token: string | undefined;
    ok: boolean;
  }> => {
    try {
      const response = await API.checkLoginZalo({
        ...zaloInfo,
        referral: getReferral(),
      });
      const token = response.data?.data?.token;
      setToken(token);
      return { token, ok: true };
    } catch (error) {
      return { token: undefined, ok: false };
    }
  };
  // Cập nhật số điện thoại của người dùng
  const updatePhone = async (payload: { zalo_access_token: string; zalo_token: string }): Promise<boolean> => {
    try {
      const response = await API.updateZaloInfo(payload);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  };

  // Lấy số điện thoại zalo
  const getZaloPhone = async (): Promise<{
    ok: boolean;
  }> => {
    try {
      return await new Promise((resolve, reject) => {
        getPhoneNumber({
          success: (res) => {
            const { token } = res;
            getAccessToken({
              success: (accessToken) => {
                // Sau khi lấy số điện thoại zalo thành công
                // Tiến hành cập nhập số điện thoại zalo cho người dùng
                updatePhone({
                  zalo_access_token: accessToken,
                  zalo_token: token ?? '',
                }).then((ok) => {
                  if (ok) {
                    resolve({ ok: true });
                  } else {
                    resolve({ ok: false });
                  }
                });
              },
              fail: (err) => {
                console.log('err log', err);
                resolve({ ok: false });
              },
            });
          },
          fail: (err) => {
            resolve({ ok: false });
          },
        });
      });
    } catch (error) {
      return { ok: false };
    }
  };

  // Follow official account
  const followOfficialAccount = async (): Promise<{
    ok: boolean;
    errorCode?: string;
  }> => {
    if (!shopSetting?.oaId) {
      return {
        ok: false,
        errorCode: ERROR_CODES.NOT_FOUNT_OFFICIAL_ACCOUNT,
      };
    }

    return new Promise((resolve, reject) => {
      followOA({
        id: shopSetting?.oaId,
        success: () => {
          resolve({ ok: true });
        },
        fail: () => {
          resolve({
            ok: false,
            errorCode: ERROR_CODES.FOLLOW_OFFICIAL_ACCOUNT_FAIL,
          });
        },
      });
    });
  };

  const login = async (): Promise<{
    ok: boolean;
    message: string;
    errorCode?: string;
  }> => {
    const { allowed, info } = await getZaloInfo();
    if (!allowed)
      return {
        ok: false,
        message: 'Không thể lấy thông tin zalo',
        errorCode: ERROR_CODES.GET_ZALO_INFO_FAIL,
      };
    if (!info)
      return {
        ok: false,
        message: 'Không thể lấy thông tin zalo',
        errorCode: ERROR_CODES.GET_ZALO_INFO_FAIL,
      };

    // Bước 2: Tiến hàng đăng nhập
    const { token, ok: checkLoginZaloOk } = await checkLoginZalo(info);

    if (!token)
      return {
        ok: false,
        message: 'Không thể đăng nhập',
        errorCode: ERROR_CODES.CHECK_LOGIN_ZALO_FAIL,
      };
    // Lưu token vào cookie
    CookiesService.setClientCookies('token', token);
    // Nếu đăng nhập thất bại
    if (!checkLoginZaloOk) {
      return {
        ok: false,
        message: 'Không thể đăng nhập',
        errorCode: ERROR_CODES.CHECK_LOGIN_ZALO_FAIL,
      };
    }
    return {
      ok: true,
      message: 'Đăng nhập thành công',
    };
  };

  const start = async (configs: {
    enableFollowOfficialAccount?: boolean;
    enableUpdatePhone?: boolean;
    enableSignIn?: boolean;
  }): Promise<{
    ok: boolean;
    message: string;
    errorCode?: string;
  }> => {
    const { enableFollowOfficialAccount = true, enableUpdatePhone = true, enableSignIn = true } = configs;
    if (enableSignIn) {
      login();
    }

    if (enableUpdatePhone) {
      // Bước 3: Lấy số điện thoại và cập nhật số điện thoại cho người dùng
      const { ok: checkZaloPhoneOk } = await getZaloPhone();
      if (!checkZaloPhoneOk) {
        return {
          ok: false,
          message: 'Không thể lấy số điện thoại',
          errorCode: ERROR_CODES.GET_ZALO_PHONE_FAIL,
        };
      }
    }

    if (!enableFollowOfficialAccount) {
      const { ok: followedOK, errorCode } = await followOfficialAccount();
      if (!followedOK) {
        return {
          ok: false,
          message: 'Không thể follow official account',
          errorCode: errorCode,
        };
      }

      if (followedOK) {
        await API.updateFollowOa({
          isFollowOa: true,
        });
      }
    }
    
    return { ok: true, message: 'Hoàn thành' };
  };

  return {
    start,
    login,
    getZaloInfo,
    getZaloPhone,
    followOfficialAccount,
    token,
    zaloInfo,
  };
}
