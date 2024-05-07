import React from 'react';

export declare interface MobileLayoutProps {
    children?: JSX.Element | JSX.Element[] | React.ReactNode;

    [x: string]: any;
}

export default function MobileLayout(props: MobileLayoutProps): JSX.Element {
    const { children } = props;

    return (
        <>
            <div className="relative w-screen h-screen">{children}</div>
        </>
    );
}
