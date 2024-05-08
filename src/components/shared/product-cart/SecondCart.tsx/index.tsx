
import React, { useMemo } from 'react';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { useNavigateBlockPath } from '../../navigator-block-path';
import { useShopSetting } from '@/src/hooks/useShopSetting';
import { useCart } from '@/src/hooks/useCart';

export declare interface CartProps {
  children?: JSX.Element | JSX.Element[] | React.ReactNode;
  className?: string;
  [x: string]: any;
  sizeIconCart?: string;
}

export default function SecondCart(props: CartProps): JSX.Element {
  const { className, children, sizeIconCart } = props;

  const { navigate, renderPhoneModal } = useNavigateBlockPath();
  const { data: shopSetting } = useShopSetting();
  const onCart = () => {
    navigate({
      path: '/cart',
      condition: { isLogin: false, isHasPhone: false },
    });
  };
  const { data: carts } = useCart();
  console.log("🚀 ~ SecondMobileCart ~ cart:", carts)

  const cartItemsCnt = useMemo(() => carts?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) ?? 0, [carts?.items]);

  return (
    <>
      {renderPhoneModal()}
      {shopSetting?.UICategoryHome === 'categories_home3' ? (
        <div id="cart" className="cursor-pointer w-full h-full relative rounded-[10px] border-[1.5px] border-primary-100  bg-white p-[7px]" onClick={onCart}>
          <div className={`w-full h-full `}>
            <AiOutlineShoppingCart className={`text-black ${sizeIconCart ? `text-${sizeIconCart}` : `text-[25px]`}`} />
          </div>
          {carts?.items?.length > 0 && (
            <div className={`absolute flex justify-center items-center text-center bottom-[-8px] right-[-10px] rounded-full bg-primary-100 ${cartItemsCnt >= 10 ? 'w-[20px] h-[20px] ' : 'w-[10px] h-[10px]'}`}>
              <span
                className={`text-white text-xs `}
              >
                {cartItemsCnt}
              </span>
            </div>
          )}
        </div>
      ) : (
        <div id="cart" className="cursor-pointer" onClick={onCart}>
          <div className={`w-full h-full rounded-full ${className ? `${className}` : `p-[6px]`}`}>
            <AiOutlineShoppingCart className={`text-black ${sizeIconCart ? `text-${sizeIconCart}` : `text-xl`}`} />
          </div>
          {carts?.items?.length > 0 && (
            <span
              className={`indicator-item text-black ${cartItemsCnt >= 10 ? 'px-1 py-1 mt-2' : 'px-2 py-1 mt-2'} text-xs rounded-full bg-primary-100 `}
            >
              {cartItemsCnt}
            </span>
          )}
        </div>
      )}
    </>
  );
}
