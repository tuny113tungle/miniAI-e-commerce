import React from 'react';
import classNames from 'classnames';

export declare interface MobileDividerProps {
  children?: JSX.Element | JSX.Element[] | React.ReactNode;
  dashed?: boolean;
  className?: string;
  [x: string]: any;
}

export default function MobileDivider(props: MobileDividerProps): JSX.Element {
  const { className, children, dashed } = props;

  return (
    <>
      <div className={classNames(dashed ? 'border-dashed' : '', 'w-full border-t-[1px] border-[#D0D1CD]', className)}>{children}</div>
    </>
  );
}
