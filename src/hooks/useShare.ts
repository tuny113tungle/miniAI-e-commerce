import CryptoJS from 'crypto-js';
import { isEmpty, isNil } from 'lodash';
import { useState } from 'react';
import { useInterval } from 'react-use';
import { openShareSheet } from 'zmp-sdk/apis';
import { useNavigate } from 'zmp-ui';
import useQuery from './useQuery';
import { useShopSetting } from './useShopSetting';
import { useProfile } from './useProfile';
import CookiesService from '../apis/CookiesService';
import API from '../apis/Api';
import { ensureMediaPath } from '../components/utils/ensureMediaPaths';
import AffiliateEventTracker, { AffiliateEvent } from '../types/AffiliateEventTracker';

const ENCRYPT_TOKEN = 'olchx1pvvjle69zyh';

const linkZalo = 'https://zalo.me/s';

type PrivateAffShareParam = {
  sharedCommission: number;
};

export interface ShareSession {
  affSharedId: string;
  referral?: string;
  affCode?: string;
  env?: string;
  version?: string;
  data?: any;
  navigation?: string;
  customSharedCommissions?: { itemId: string; sharedCommission: number }[];
  expiredAt?: Date;
}

const convertURLSearchParamsToObject = (search: string) => {
  try {
    const params = new URLSearchParams(search);
    const obj = Object.fromEntries(params.entries());
    return obj;
  } catch (error) {
    return {};
  }
};

const _encryptPrivateAffSharedParams = (params: PrivateAffShareParam) => {
  const paramsString = JSON.stringify(params);

  return CryptoJS.AES.encrypt(paramsString, ENCRYPT_TOKEN).toString();
};

const decryptPrivateAffSharedParams = (encryptedParams: string): PrivateAffShareParam | undefined => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedParams, ENCRYPT_TOKEN);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    return JSON.parse(originalText);
  } catch (_err) {
    return;
  }
};

const extractCustomSharedCommision = ({ affToken, navigation }: { affToken?: string; navigation?: string }) => {
  if (!affToken || !navigation) {
    return;
  }

  const itemId = navigation?.split('/')?.pop();

  const isProductSharing = navigation?.includes('product') && itemId;

  const decryptedParams = decryptPrivateAffSharedParams(affToken);

  if (isProductSharing && decryptedParams && decryptedParams.sharedCommission && itemId) {
    return [{ itemId, sharedCommission: decryptedParams.sharedCommission }];
  }

  return;
};

export function useShare() {
  const query = useQuery();
  const navigate = useNavigate();
  const {data: shopSetting} = useShopSetting()
  const {data: profile, isFetching} = useProfile();
  const [referral, setReferral] = useState<string>();
  const [affCode, setAffCode] = useState<string>();
  const [data, setData] = useState<any>();

  const getAffiliateSharedCommissions = (itemIds: string[]) => {
    const currentAffShareSession = getCurrentAffShareSession();

    const affSharedCommissions = currentAffShareSession?.customSharedCommissions;

    if (itemIds && itemIds.length && affSharedCommissions && affSharedCommissions.length) {
      return affSharedCommissions.filter((item) => itemIds.includes(item.itemId));
    }

    return [];
  };

  const removeAffiliateSharedCommissions = (itemIds: string[]) => {
    const currentAffShareSession = getCurrentAffShareSession();

    const affSharedCommissions = currentAffShareSession?.customSharedCommissions;

    if (itemIds && itemIds.length && affSharedCommissions && affSharedCommissions.length) {
      const newAffSharedCommissions = affSharedCommissions.filter((item) => !itemIds.includes(item.itemId));

      CookiesService.setClientCookies('affSharedSession', {
        ...currentAffShareSession,
        customSharedCommissions: newAffSharedCommissions,
      });
    }

    return;
  };

  const getAffiliateActionDetails = (session: ShareSession) => {
    if (session.navigation?.includes('product')) {
      return {
        event: AffiliateEvent.VIEW_ITEM,
        itemId: session.navigation.split('/').pop(),
      };
    }

    return {
      event: AffiliateEvent.VIEW_APP,
    };
  };

  const getCurrentAffShareSession = () => {
    const currentShareSession = CookiesService.getClientCookies('affSharedSession') as ShareSession;

    if (!currentShareSession) {
      return null;
    }

    const { expiredAt } = currentShareSession;

    if (currentShareSession && expiredAt && new Date() > expiredAt) {
      //TODO: create end session expired event
      CookiesService.setClientCookies('affSharedSession', null);
      return null;
    }

    return currentShareSession;
  };

  const setCurrentAffShareSession = async (session: Partial<ShareSession>) => {
    const currentShareSession = getCurrentAffShareSession();

    const isExistSession = currentShareSession && currentShareSession.referral === session.referral;

    const isOtherSession = currentShareSession && currentShareSession.referral !== session.referral;

    const currentCustomSharedCommissions = currentShareSession?.customSharedCommissions;

    if (isExistSession) {
      const newCustomSharedCommissions = session?.customSharedCommissions
        ? [
            ...session.customSharedCommissions,
            ...(currentCustomSharedCommissions && currentCustomSharedCommissions.length ? currentCustomSharedCommissions : []),
          ]?.reduce(
            (acc, item) => {
              if (!acc.some((i) => i.itemId === item.itemId)) {
                acc.push(item);
              }

              return acc;
            },
            [] as { itemId: string; sharedCommission: number }[],
          )
        : undefined;

      CookiesService.setClientCookies('affSharedSession', { ...currentShareSession, customSharedCommissions: newCustomSharedCommissions });

      return currentShareSession;
    } else {
      const res = await API.createAffiliateSharedHistory({ affCode: session.affCode as string });

      const affSharedId = res?.data?.data?.id;

      const newSession = {
        ...session,
        affSharedId,
      } as ShareSession;
      CookiesService.setClientCookies('affSharedSession', newSession);

      if (!currentShareSession) {
        AffiliateEventTracker.captureEvent({
          affSharedId: newSession.affSharedId,
          actionDetails: getAffiliateActionDetails(newSession),
        });
      } else if (isOtherSession) {
        AffiliateEventTracker.captureEvent({
          affSharedId: newSession.affSharedId,
          actionDetails: getAffiliateActionDetails(newSession),
        });
        AffiliateEventTracker.captureEvent({
          affSharedId: currentShareSession.affSharedId,
          actionDetails: { event: AffiliateEvent.END_SESSION },
        });
      }

      return newSession;
    }
  };

  const init = async () => {
    setupEnvirontment();
    const referral = query['referral'];
    const affCode = query['affCode'];
    const navigation = query['navigation'] ? decodeURIComponent(query['navigation'] as string) : undefined;
    const data = query['data'];
    const affToken = query['affToken'] ? decodeURIComponent(query['affToken'] as string) : undefined;

    if (affCode) {
      CookiesService.setClientCookies('refCode', affCode);
    }
    if (referral) {
      CookiesService.setClientCookies('referral', referral);
    }

    if (data) {
      CookiesService.setClientCookies('data', convertURLSearchParamsToObject(data as string));
    }

    const newSession: Partial<ShareSession> = {
      referral: CookiesService.getClientCookies('referral'),
      affCode: CookiesService.getClientCookies('refCode'),
      env: CookiesService.getClientCookies('env'),
      version: CookiesService.getClientCookies('version'),
      data: CookiesService.getClientCookies('data'),
      navigation: navigation as string,
      customSharedCommissions: extractCustomSharedCommision({ affToken, navigation }),
    };

    if (!isNil(affCode) && affCode !== 'undefined') {
      await setCurrentAffShareSession(newSession);
    }
    if (navigation && !isEmpty(navigation)) {
      navigate(navigation as string);
    }
  };

  const setupEnvirontment = () => {
    const env = new URLSearchParams(location.search).get('env') ?? '';
    const version = new URLSearchParams(location.search).get('version') ?? '';

    setReferral(CookiesService.getClientCookies('referral'));
    setAffCode(CookiesService.getClientCookies('refCode'));
    setData(CookiesService.getClientCookies('data'));
    if (env) {
      CookiesService.setClientCookies('env', env);
    }
    if (version) {
      CookiesService.setClientCookies('version', version);
    }
  };

  useInterval(() => {
    setupEnvirontment();
  }, 2000);

  // Chia sẻ trang chủ
  const shareHome = () => {
    openShareSheet({
      type: 'zmp_deep_link',
      data: {
        title: shopSetting?.name ?? '',
        description: shopSetting?.description ?? '',
        thumbnail: `${ensureMediaPath(shopSetting?.logo)}`,
        path: `/?${new URLSearchParams({
          referral: profile?.id, // profileId
          env: CookiesService.getClientCookies('env') ?? '',
          version: CookiesService.getClientCookies('version') ?? '',
          affCode: profile?.refCode,
        }).toString()}`,
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      success: (res) => {},
      fail: (err) => {
        // eslint-disable-next-line no-console
        console.log('useShare', 'error', err);
      },
    });
  };

  // Chia sẻ sản phẩm
  const shareProduct = (product: { name: string; description: string; thumbnail: string; id: string; shareCommission?: number }) => {
    const queryParams = {
      navigation: `/product/${product?.id}`,
      referral: profile?.id, // profileId
      affCode: profile?.refCode, // affiliate code
      env: CookiesService.getClientCookies('env') ?? '',
      version: CookiesService.getClientCookies('version') ?? '',
    };

    if (product.shareCommission && product.shareCommission > 0) {
      queryParams['affToken'] = _encryptPrivateAffSharedParams({ sharedCommission: product.shareCommission });
    }
    openShareSheet({
      type: 'zmp_deep_link',
      data: {
        title: product?.name ?? '',
        description: product?.description ?? '',
        thumbnail: `${ensureMediaPath(product?.thumbnail)}`,
        path: `/?${new URLSearchParams(queryParams).toString()}`,
      },

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      success: (res) => {},
      fail: (err) => {
        // eslint-disable-next-line no-console
        console.log('useShare', 'error', err);
      },
    });
  };

  const shareFavorite = (payload: { listFavoriteId: string; name: string }) => {
    const { listFavoriteId, name } = payload;
    openShareSheet({
      type: 'zmp_deep_link',
      data: {
        title: name ?? '',
        description: '',
        thumbnail: `${ensureMediaPath(shopSetting?.logo)}`,
        path: `/?${new URLSearchParams({
          navigation: `/favorited-list-shared`,
          data: new URLSearchParams({
            listFavoriteId: listFavoriteId,
          }).toString(),
          referral: profile?.id,
          affCode: profile?.refCode,
          env: CookiesService.getClientCookies('env') ?? '',
          version: CookiesService.getClientCookies('version') ?? '',
        }).toString()}`,
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      success: (res) => {},
      fail: (err) => {
        // eslint-disable-next-line no-console
        console.log('useShare', 'error', err);
      },
    });
  };
  const shareSurvey = (survey: { name: string; description: string; thumbnail: string; id: string }) => {
    const queryParams = {
      navigation: `/survey-detail/${survey?.id}`,
      referral: profile?.id, // profileId
      affCode: profile?.refCode, // affiliate code
      env: CookiesService.getClientCookies('env') ?? '',
      version: CookiesService.getClientCookies('version') ?? '',
    };

    openShareSheet({
      type: 'zmp_deep_link',
      data: {
        title: survey?.name ?? '',
        description: survey?.description ?? '',
        thumbnail: `${ensureMediaPath(survey?.thumbnail)}`,
        path: `/?${new URLSearchParams(queryParams).toString()}`,
      },

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      success: (res) => {},
      fail: (err) => {
        // eslint-disable-next-line no-console
        console.log('useShare', 'error', err);
      },
    });
  };

  const getReferral = () => {
    return CookiesService.getClientCookies('referral');
  };
  console.log('🚀 ~ getReferral ~ getReferral:', CookiesService.getClientCookies('referral'));

  const getPathHome = () => {
    return `${linkZalo}/${shopSetting?.zaloMiniAppId}//?${new URLSearchParams({
      referral: profile?.id,
      env: CookiesService.getClientCookies('env') ?? '',
      version: CookiesService.getClientCookies('version') ?? '',
      affCode: profile?.refCode,
    }).toString()}`;
  };

  const getPathFavorite = (payload: { listFavoriteId: string }) => {
    const { listFavoriteId } = payload;
    return `${linkZalo}/${shopSetting?.zaloMiniAppId}//?${new URLSearchParams({
      navigation: `/favorited-list-shared`,
      data: new URLSearchParams({
        listFavoriteId: listFavoriteId,
      }).toString(),
      referral: profile?.id,
      affCode: profile?.refCode,
      env: CookiesService.getClientCookies('env') ?? '',
      version: CookiesService.getClientCookies('version') ?? '',
    }).toString()}`;
  };
  const getPathSurvey = (survey: { id: string }) => {
    const { id } = survey;
    const queryParams = {
      navigation: `/survey-detail/${survey?.id}`,
      referral: profile?.id,
      affCode: profile?.refCode,
      env: CookiesService.getClientCookies('env') ?? '',
      version: CookiesService.getClientCookies('version') ?? '',
    };

    return `${linkZalo}/${shopSetting?.zaloMiniAppId}//?${new URLSearchParams(queryParams).toString()}`;
  };

  const getPathProduct = (product: { id: string; shareCommission?: number }) => {
    const { id } = product;
    const queryParams = {
      navigation: `/product/${id}`,
      referral: profile?.id,
      affCode: profile?.refCode,
      env: CookiesService.getClientCookies('env') ?? '',
      version: CookiesService.getClientCookies('version') ?? '',
    };

    if (product.shareCommission && product.shareCommission > 0) {
      queryParams['affToken'] = _encryptPrivateAffSharedParams({ sharedCommission: product.shareCommission });
    }

    return `${linkZalo}/${shopSetting?.zaloMiniAppId}//?${new URLSearchParams(queryParams).toString()}`;
  };

  const getAffCode = () => {
    return CookiesService.getClientCookies('refCode');
  };

  return {
    init,
    shareHome,
    shareProduct,
    shareFavorite,
    shareSurvey,
    data: data ?? {},
    referral, // Mã người giới thiệu
    affCode, // Mã affiliate người giới thiệu
    getReferral,
    getAffCode,
    getPathHome,
    getPathFavorite,
    getPathProduct,
    getPathSurvey,
    getAffiliateSharedCommissions,
    removeAffiliateSharedCommissions,
  };
}
