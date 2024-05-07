import { useUserPoint } from '@/hooks/useUser';
import React from 'react';
import { RiVipCrown2Line } from 'react-icons/ri';
import { SlWallet } from 'react-icons/sl';
import { useNavigate } from 'react-router-dom';

const BannerBtnOptions = () => {
  const navigate = useNavigate();
  const { userPoint } = useUserPoint();
  return (
    <div className="flex flex-row items-center  px-6 bg-white h-[70px] rounded-xl shadow-xs ">
      <div className="w-1/2 flex items-center flex-row space-x-3 ">
        <div className="p-2 flex items-center justify-center  rounded-lg bg-primary-100">
          <SlWallet className={`text-white text-lg`} />
        </div>
        <div className={'flex flex-col '} onClick={() => navigate('/transactionHistory')}>
          <span className="text-sm font-medium text-black">Điểm của tôi</span>
          <p className="text-black text-xs font-base ">{userPoint}</p>
        </div>
      </div>
      <div className="w-1/2 flex items-center flex-row space-x-3 text-black">
        <div className="flex items-center justify-center p-2 rounded-lg bg-primary-100">
          <RiVipCrown2Line className={`text-white text-lg`} />
        </div>
        <div className={'flex flex-col  items-center'} onClick={() => navigate('/loyalty-membership')}>
          <span className="text-sm font-medium">Ưu đãi của tôi</span>
          {/* <p className="text-black text-xs font-base ">hạng thành viên</p> */}
        </div>
      </div>
    </div>
  );
};

export default BannerBtnOptions;
