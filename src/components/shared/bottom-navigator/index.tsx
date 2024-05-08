/* eslint-disable prettier/prettier */
import classNames from 'classnames';
import { endsWith, size } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
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
import CookiesService from '@/src/apis/CookiesService';
import { useShopSetting } from '@/src/hooks/useShopSetting';
import { useNavigateBlockPath } from '../navigator-block-path';
export declare interface BottomNavigatorProps {
  children?: JSX.Element | JSX.Element[] | React.ReactNode;
  className?: string;
  [x: string]: any;
}

const menuMainItems2 = [
  {
    path: '/',
    icon: ({ className }: any) => {
      return <TbSmartHome className={className} />;
    },
    title: 'Trang chủ',
    condition: { isLogin: true },
  },
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
    path: '/',
    icon: ({ className }: any) => {
      return <BiHomeHeart className={className} />;
    },
    title: 'Trang chủ',
    condition: { isLogin: true },
  },
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

export default function BottomNavigator(props: BottomNavigatorProps): JSX.Element {
  const { className } = props;
  const loacation = useLocation();
  const {data: shopSetting, refetch} = useShopSetting();
  const token = CookiesService.getClientCookies('token');

  const { navigate, renderPhoneModal } = useNavigateBlockPath();
  // const { refetch } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number>();
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
      refetch()
    }
  }, [token]);

  // if (isLoading) {
  //   return <></>;
  // }
  return (
    <>
      <div
        className={classNames(
          `fixed bottom-[14px] left-1/2 rounded-[25px] overflow-hidden transform -translate-x-1/2  z-10  w-[91%]  h-[54px] bg-primary-100 transition-transform duration-500`,
          { 'transform translate-y-0 ': isVisible, 'transform translate-y-full bottom-[-34px] ': !isVisible },
        )}
      >
        {renderPhoneModal()}
        <div className="flex justify-around items-center flex-row grow z-[999999999999999999999] h-full mx-auto gap-2 rounded-[22px] ">
          {size(items) > 0 &&
            items.map((item: any, index: number) => {
              const isActive = endsWith(location.pathname, item?.path);
              return (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedIndex(index);
                    navigate({
                      path: item?.path,
                      condition: item.condition,
                    });
                    // dispatch(hideProductModal({}));
                  }}
                >
                  <div
                    className={classNames(
                      `flex items-center justify-between ${isActive ? `bg-white rounded-[20px] px-[14px] py-[8px] space-x-[6px]` : ''} `,
                    )}
                  >
                    <div>
                      {item?.icon({
                        className: `w-[20px] h-[20px]  group-hover:text-blue-600 mr-[1px] ${
                          isActive ? 'w-[16px] h-[16px] bg-white text-primary-100 ' : 'text-white'
                        }`,
                      })}
                    </div>
                    <div>
                      {item?.title && (
                        <span className={`w-full ${isActive ? 'text-primary-100 font-medium' : 'hidden'} text-[12px] text-center`}>
                          {item?.title}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
