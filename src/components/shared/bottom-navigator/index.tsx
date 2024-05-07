
import classNames from 'classnames';
import { size } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { BiHomeHeart } from 'react-icons/bi';
import { GiMedicines } from 'react-icons/gi';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { PiNewspaper, PiNewspaperClipping } from 'react-icons/pi';
import { TbSmartHome } from 'react-icons/tb';
import { useLocation } from 'react-router-dom';
import { CgMenuLeft } from 'react-icons/cg';
import { LiaUser } from 'react-icons/lia';
import { LuPartyPopper } from 'react-icons/lu';
import { VscGift } from 'react-icons/vsc';
import CookiesService from '@/apis/CookiesService';
import { useShopSetting } from '@/hooks/useShopSetting';
import { useNavigateBlockPath } from '@/components/organisms/navigator-block-path';
import { useColor } from '@/hooks/useColor';

export declare interface MobileBottomNavigatorProps {
  children?: JSX.Element | JSX.Element[] | React.ReactNode;
  className?: string;
  [x: string]: any;
}

/**
 * Author: Nguyễn Thanh Sơn
 * Created At: April 14, 2023
 * Description:
 * @param props
 * @returns JSX.Element
 */
const menuMainItems2 = [
  {
    path: '/categories',
    icon: ({ className }: any) => {
      return <CgMenuLeft className={className} />;
    },
    title: 'Danh mục',
    condition: { isNotLogin: true },
  },
  {
    path: '/loyalty-membership',
    icon: ({ className }: any) => {
      return <VscGift className={className} />;
    },
    title: 'Ưu đãi',
    condition: { isLogin: true, isHasPhone: true },
  },
  {
    path: '/',
    icon: ({ className }: any) => {
      return <TbSmartHome className={className} />;
    },
    title: 'Trang chủ',
    condition: { isLogin: true },
  },
  {
    path: '/notifications',
    icon: ({ className }: any) => {
      return <PiNewspaper className={className} />;
    },
    title: 'Tin tức',
    condition: { isNotLogin: true },
  },
  {
    path: '/profile',
    icon: ({ className }: any) => {
      return <LiaUser className={className} />;
    },
    title: 'Cá nhân',
    condition: { isLogin: true, isHasPhone: true },
  },
];

const menuPharmacityItems = [
  {
    path: '/categories',
    icon: ({ className }: any) => {
      return <GiMedicines className={className} />;
    },
    title: 'Danh mục',
    condition: { isNotLogin: true },
  },
  {
    path: '/loyalty-membership',
    icon: ({ className }: any) => {
      return <LuPartyPopper className={className} />;
    },
    title: 'Ưu đãi',
    accessPhone: true,
    condition: { isLogin: true, isHasPhone: true },
  },

  {
    path: '/',
    icon: ({ className }: any) => {
      return <BiHomeHeart className={className} />;
    },
    title: 'Trang chủ',
    condition: { isLogin: true },
  },
  {
    path: '/notifications',
    icon: ({ className }: any) => {
      return <PiNewspaperClipping className={className} />;
    },
    title: 'Tin tức',
    condition: { isNotLogin: true },
  },

  {
    path: '/profile',
    icon: ({ className }: any) => {
      return <HiOutlineUserCircle className={className} />;
    },
    title: 'Cá nhân',
    condition: { isLogin: true, isHasPhone: true },
  },
];

export default function MobileBottomNavigator(props: MobileBottomNavigatorProps): JSX.Element {
  const { className } = props;
  const loacation = useLocation();
  const token = CookiesService.getClientCookies('token');

  const { navigate, renderPhoneModal } = useNavigateBlockPath();
  const {data: shopSetting, isFetching, refetch} = useShopSetting();
//   const { isFetching } = useAuth();

  const items = useMemo(() => {
    switch (shopSetting?.industry) {
      case 'pharmacy':
        return menuPharmacityItems;
      default:
        return menuMainItems2;
    }
  }, [shopSetting?.industry]);

  useEffect(() => {
    if (token) {
        refetch();
    }
  }, [token]);

  if (isFetching) {
    return <></>;
  }

  return (
    <>
      <div className={classNames(' ', className)}>
        <div className="fixed bottom-[14px] left-1/2 rounded-[25px] overflow-hidden  z-10  w-[91%]  transform -translate-x-1/2 h-[54px] bg-primary-100 ">
          {renderPhoneModal()}
          <div className="flex justify-around items-center flex-row grow z-[999999999999999999999] h-full mx-auto gap-2 rounded-[22px] ">
            {size(items) > 0 &&
              items.map((item: any, index: number) => {
                return (
                  <div
                    onClick={() => {
                    //   dispatch(hideProductModal({}));
                      navigate({
                        path: item?.path,
                        condition: item.condition,
                      });
                    }}
                    className="flex flex-col items-center justify-center grow"
                    key={index}
                  >
                    {item?.icon({
                      className: `w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500 ${
                        item?.path === loacation.pathname ? 'text-primary-100' : 'text-gray-500'
                      }`,
                    })}
                    {item?.title && (
                      <span
                        className={`w-full ${
                          item?.path === loacation.pathname ? 'text-primary-100 font-medium' : 'text-gray-600 font-light'
                        } text-[9px] text-center`}
                      >
                        {item?.title}
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <span className="opacity-0">-</span>
    </>
  );
}
