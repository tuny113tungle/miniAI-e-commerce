import axios from 'axios';
import qs from 'querystringify';
import CookiesService from './CookiesService';
import { SHOP_LISTS, Shop, shop } from './configs';
import { CreateAffiliateSharedHistory } from '@/types/affiliate';
const getBaseUrl = (shopKey: Shop) => {
  const shop = SHOP_LISTS.find((item) => item.shopKey === shopKey);
  switch (shop?.env) {
    case 'dev':
      return 'https://api.risensgroup.com/api';
    case 'pro':
      return 'https://api.miniap.vn/api';
    default:
      return 'https://api.miniap.vn/api';
  }
};

const getShopId = (shopKey: Shop) => {
  const shop = SHOP_LISTS.find((item) => item.shopKey === shopKey);
  return shop?.shopId;
};

export const BASE_URL = getBaseUrl(shop);

export const SOCKET_URL = getBaseUrl(shop);
export const SHOP_ID = getShopId(shop);

export const Create = (baseURL = BASE_URL) => {

  const api = axios.create({
    baseURL,
    headers: {
      'Cache-Control': 'no-cache',
    },
    timeout: 50000,
  });

  const GET = (payload: any) =>
    api.get(`${payload?.path}/${payload?.params?._id}?${qs.stringify(payload?.params)}`, {
      headers: {
        ...(CookiesService.hasClientKey('token')
          ? {
            Authorization: 'JWT ' + CookiesService.getClientCookies('token'),
          }
          : {}),
        'Shop-Id': SHOP_ID,
      },
    });

  const POST = (payload: any) =>
    api.post(`${payload?.path}`, payload?.params, {
      headers: {
        ...(CookiesService.hasClientKey('token')
          ? {
            Authorization: 'JWT ' + CookiesService.getClientCookies('token'),
          }
          : {}),
        'Shop-Id': SHOP_ID,
      },
    });

  const PUT = (payload: any) =>
    api.put(payload?.path, payload?.params, {
      headers: {
        ...(CookiesService.hasClientKey('token')
          ? {
            Authorization: 'JWT ' + CookiesService.getClientCookies('token'),
          }
          : {}),
        'Shop-Id': SHOP_ID,
      },
    });

  const DELETE = (payload: any) =>
    api.delete(`${payload?.path}?${qs.stringify(payload?.params)}`, {
      headers: {
        ...(CookiesService.hasClientKey('token')
          ? {
            Authorization: 'JWT ' + CookiesService.getClientCookies('token'),
          }
          : {}),
        'Shop-Id': SHOP_ID,
      },
    });

  // Your api down here - Never deleting this line
  const getShopSetting = () =>
    api.get(`/shopSetting`, {
      headers: {
        Authorization: 'Bearer ' + CookiesService.getClientCookies('token'),
        'Shop-Id': SHOP_ID,
      },
    });

  const getUserPoint = () =>
    api.get(`/user-point`, {
      headers: {
        Authorization: 'Bearer ' + CookiesService.getClientCookies('token'),
        'Shop-Id': SHOP_ID,
      },
    });

  const getPointAccumulationHistory = (payload: { page?: number; limit?: number }) =>
    api.get(`/user-point-accmulation-histories?${qs.stringify(payload)}`, {
      headers: {
        Authorization: 'Bearer ' + CookiesService.getClientCookies('token'),
        'Shop-Id': SHOP_ID,
      },
    });

  const getUserRefferalHistory = (payload: { startDate?: Date; endDate?: Date }) =>
    api.get(`/user-refferal-histories?${qs.stringify(payload)}`, {
      headers: {
        Authorization: 'Bearer ' + CookiesService.getClientCookies('token'),
        'Shop-Id': SHOP_ID,
      },
    });

  const getProfile = () =>
    api.get(`/user-info`, {
      headers: {
        Authorization: 'Bearer ' + CookiesService.getClientCookies('token'),
        'Shop-Id': SHOP_ID,
      },
    });

  const createAffiliateSharedHistory = (payload: CreateAffiliateSharedHistory) =>
    api.post(`/affiliate/affiliate-shared-history`, payload, {
      headers: {
        Authorization: 'Bearer ' + CookiesService.getClientCookies('token'),
        'Shop-Id': SHOP_ID,
      },
    });

  const createAffiliateTrackingEvent = (payload: {
    affSharedId: string;
    actionDetails: {
      event: string;
      itemId?: string;
      orderId?: string;
    };
  }) =>
    api.post(
      `/affiliate-tracking/create`,
      {
        ...payload,
      },
      {
        headers: {
          Authorization: 'Bearer ' + CookiesService.getClientCookies('token'),
          'Shop-Id': SHOP_ID,
        },
      },
    );

  const checkLoginZalo = (payload: any) =>
    api.post(`/zmp-login`, payload, {
      headers: {
        Authorization: 'Bearer ' + CookiesService.getClientCookies('token'),
        'Shop-Id': SHOP_ID,
      },
    });

    const updateZaloInfo = (payload: any) =>
    api.put(`/zalo-info`, payload, {
      headers: {
        Authorization: 'Bearer ' + CookiesService.getClientCookies('token'),
        'Shop-Id': SHOP_ID,
      },
    });

    const updateFollowOa = (payload: any) =>
    api.put(`/follow-oa`, payload, {
      headers: {
        Authorization: 'Bearer ' + CookiesService.getClientCookies('token'),
        'Shop-Id': SHOP_ID,
      },
    });
  return {
    GET,
    POST,
    PUT,
    DELETE,
    // exports - Never deleting this line
    getShopSetting,
    getUserPoint,
    getPointAccumulationHistory,
    getUserRefferalHistory,
    getProfile,
    createAffiliateSharedHistory,
    createAffiliateTrackingEvent,
    checkLoginZalo,
    updateZaloInfo,
    updateFollowOa
  };
};

const API = Create();
export default API;
