import React from 'react';
import classNames from 'classnames';
import { useShopSetting } from '@/src/hooks/useShopSetting';

export declare interface PrimaryButtonProps {
  id?: string;
  children?: JSX.Element | JSX.Element[] | React.ReactNode;
  className?: string;
  onClick?: () => void;
  [x: string]: any;
  disabled?: boolean;
}

export default function PrimaryButton(props: PrimaryButtonProps): JSX.Element {
  const { className, children, onClick, disabled, id } = props;
  const {data: shopSetting} = useShopSetting()
  return (
    <>
      <button
        id={id}
        onClick={onClick}
        className={classNames(
          `py-2 pt-2 ${shopSetting?.industry === 'pharmacy' ? 'bg-primary-1000 border-none' : 'bg-primary-1000 border-none'} text-white flex-grow`,
          className,
          {
            'opacity-50 cursor-not-allowed': disabled,
          },
        )}
        disabled={disabled}
      >
        <span className="text-xs text-white">{children}</span>
      </button>
    </>
  );
}
