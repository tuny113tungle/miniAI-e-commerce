
import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { useNavigate } from 'zmp-ui';
import MobileDivider from '../../elements/divider';
import SecondCart from '../product-cart/SecondCart.tsx';


export declare interface MobileHeaderProps {
  children?: JSX.Element | JSX.Element[] | React.ReactNode;
  className?: string;
  [x: string]: any;
  justLogo?: boolean;
}

export default function HeaderSearch(props: MobileHeaderProps): JSX.Element {
  const { className, children, justLogo } = props;

  const navigate = useNavigate();

  const [queryString, setQueryString] = useState<string>('');

  const handleSearch = () => navigate('/search-suggest');

//   const handleEnter = useCallback(
//     (e: any) => {
//       const checkValue = e.target.value.trim();
//       if (checkValue !== '') {
//         if (e.key === 'Enter') {
//           navigate(`/search-product?q=${queryString}`);
//           if (queryString !== '') {
//             dispatch(
//               getAction('searchProduct')({
//                 q: queryString,
//               }),
//             );
//           }
//         }
//       }
//     },
//     [queryString],
//   );

  return (
    <>
    <div className={classNames('h-[5vh] w-full' , classNames())}>
      <div
        className='w-full flex items-center justify-center mt-[1vh]'
      >
        <div className="w-11/12">
          {!justLogo && (
            <div className="flex w-full items-center space-x-[4px]">
              <div className="w-[74%] flex flex-row items-center rounded-[10px] border-[1.5px] border-primary-100 overflow-hidden bg-white relative">
                <BiSearch className="text-lg text-black absolute left-3" />
                <input
                  value={queryString}
                  onChange={(e: any) => {
                    setQueryString(e.target.value);
                  }}
                  onClick={handleSearch}
                  // onKeyDown={(e) => {
                  //   handleEnter(e);
                  // }}
                  className=" flex items-center py-3 w-full px-10 text-xs text-black bg-white placeholder:text-black"
                  placeholder="Nhập để tìm kiếm..."
                />
                <div className="absolute text-white rounded-[8px] w-[55px] h-5/6  flex justify-center items-center right-[4px] bg-primary-100 opacity-90">
                  <div className="text-[13px]">Tìm</div>
                </div>
              </div>
              <div className="flex items-center">
                <SecondCart />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <MobileDivider /> */}
      </div>
    </>
  );
}
