import PrimaryButton from '@/components/atoms/primary-button';
import { ensureMediaPath } from '@/components/utils/ensureMediaPaths';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigate';
import { useShopSetting } from '@/hooks/useShopSetting';
import { useZaloAuth } from '@/hooks/useZaloAuth';
import React, { useRef, useState } from 'react';
import { Sheet } from 'zmp-ui';
interface NavigateCondition {
  isLogin?: boolean;
  isNotLogin?: boolean;
  isHasPhone?: boolean;
  isNotHasPhone?: boolean;
}

export const useNavigateBlockPath = () => {
  const { isLoggedIn, profile, isFetching } = useAuth();
  const { login, getZaloPhone } = useZaloAuth();
  const { navigate } = useNavigation();
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const pathRef = useRef<string>();
  const {data: shopSetting, refetch} = useShopSetting()

  const checkBlock = (condition: NavigateCondition) => {
    if (!isFetching) {
      if (condition.isLogin && !isLoggedIn) return true;
      if (condition.isHasPhone && (!profile?.phone || profile?.phone === '')) return true;
      if (condition.isHasPhone && !isLoggedIn) return true;
      if (condition.isLogin && isLoggedIn && profile?.phone) return false;
      if (condition.isHasPhone && profile?.phone && profile?.phone !== '') return false;
      return false;
    } else {
      return true;
    }
  };

  // mở modal đăng nhập
  const openLoginModal = async (): Promise<{
    ok: boolean;
    message: string;
  }> => {
    try {
      await login();
    //   dispatch(getAction('getProfile')({}));
      return { ok: true, message: 'login thành công' };
    } catch (error) {
      return { ok: false, message: 'login thất bại' };
    }
  };

  // mở modal xin quyền
  const openPhoneModal = async (): Promise<{
    ok: boolean;
  }> => {
    try {
      setIsOpenModal(true);
      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  };

  const renderPhoneModal = () => {
    return (
      <>
        <>
          <div className="modal-get-access-phone z-50">
            <Sheet
              visible={isOpenModal}
              onClose={() => {
                setIsOpenModal(false);
              }}
              autoHeight
              mask
              handler
              swipeToClose
            >
              <div className="flex flex-col items-center px-8 space-y-1">
                <img src={ensureMediaPath(shopSetting?.logo)} className="w-16 h-auto" />
                <span className="font-bold text-sm">Kích hoạt tài khoản của bạn</span>
                <span className="text-xs max-w-xs text-center text-gray-600">
                  {pathRef.current === '/profile'
                    ? 'Vui lòng cho phép số điện thoại để kích hoạt tài khoản và sử dụng tính năng này!'
                    : pathRef.current === '/loyalty-membership'
                      ? 'Vui lòng cho phép số điện thoại để để được hưởng những ưu đãi độc quyền nhé!'
                      : 'Vui lòng cho phép số điện thoại để được hỗ trợ giao hàng và chăm sóc tốt hơn nhé!'}
                </span>

                <div className="py-6 w-full">
                  <PrimaryButton
                    className="w-full rounded-full"
                    onClick={async () => {
                      setIsOpenModal(false);
                      await getZaloPhone();
                    //   await dispatch(getAction('getProfile')({}));
                    refetch();
                      return { ok: true };
                    }}
                  >
                    <span className="font-bold text-xs">Đồng ý</span>
                  </PrimaryButton>
                </div>
              </div>
            </Sheet>
          </div>
        </>
      </>
    );
  };

  const _navigate = async (
    conditions: NavigateCondition,
  ): Promise<{
    ok: boolean;
    message: string;
  }> => {
    if (conditions.isLogin && checkBlock(conditions)) {
      const { ok: login } = await openLoginModal();
      if (!login) {
        return {
          ok: false,
          message: 'Không thể đăng nhập',
        };
      }
    }
    if (!isFetching) {
      if (conditions.isHasPhone && isLoggedIn && checkBlock(conditions)) {
        const { ok: login } = await openPhoneModal();
        if (!login) {
          return {
            ok: false,
            message: 'Không thể xin quyền',
          };
        }
      }
    }

    return { ok: true, message: 'Thành công' };
  };

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate: (payload: { path?: any; condition: NavigateCondition }) => {
      pathRef.current = payload.path;
      if (checkBlock(payload.condition)) {
        _navigate(payload.condition);
      } else {
        navigate(payload.path);
      }
    },
    renderPhoneModal,
  };
};
