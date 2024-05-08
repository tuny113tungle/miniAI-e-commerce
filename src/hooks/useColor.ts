
import Color from 'color';
import { useEffect } from 'react';
import { useShopSetting } from './useShopSetting';

export const useColor = () => {
  const {data: shopSetting} = useShopSetting()
  console.log("🚀 ~ useColor ~ shopSetting:", shopSetting?.primaryColor)
  useEffect(() => {
    console.log("color---------------");
    
    const primary100Color = shopSetting?.primaryColor ?? '#F48B0C';
    const secondary100Color = shopSetting?.secondaryColor;
    const _primaryColor = new Color(primary100Color);
    const _secondaryColor = new Color(secondary100Color);

    document.documentElement.style.setProperty('--color-primary-100', primary100Color);
    document.documentElement.style.setProperty('--color-primary-950', _primaryColor.lighten(0.95).hex());
    document.documentElement.style.setProperty('--color-primary-900', _primaryColor.lighten(0.9).hex());
    document.documentElement.style.setProperty('--color-primary-800', _primaryColor.lighten(0.8).hex());
    document.documentElement.style.setProperty('--color-primary-700', _primaryColor.lighten(0.7).hex());
    document.documentElement.style.setProperty('--color-primary-650', _primaryColor.lighten(0.65).hex());
    document.documentElement.style.setProperty('--color-primary-600', _primaryColor.lighten(0.6).hex());
    document.documentElement.style.setProperty('--color-primary-500', _primaryColor.lighten(0.5).hex());
    document.documentElement.style.setProperty('--color-primary-400', _primaryColor.lighten(0.4).hex());
    document.documentElement.style.setProperty('--color-primary-300', _primaryColor.lighten(0.3).hex());
    document.documentElement.style.setProperty('--color-primary-200', _primaryColor.lighten(0.2).hex());
    document.documentElement.style.setProperty('--color-primary-1000', _primaryColor.lighten(0.1).hex());

    document.documentElement.style.setProperty('--color-secondary-1000', secondary100Color);
    document.documentElement.style.setProperty('--color-secondary-900', _secondaryColor.lighten(0.9).hex());
    document.documentElement.style.setProperty('--color-secondary-800', _secondaryColor.lighten(0.8).hex());
    document.documentElement.style.setProperty('--color-secondary-700', _secondaryColor.lighten(0.7).hex());
    document.documentElement.style.setProperty('--color-secondary-600', _secondaryColor.lighten(0.6).hex());
    document.documentElement.style.setProperty('--color-secondary-500', _secondaryColor.lighten(0.5).hex());
    document.documentElement.style.setProperty('--color-secondary-400', _secondaryColor.lighten(0.4).hex());
    document.documentElement.style.setProperty('--color-secondary-300', _secondaryColor.lighten(0.3).hex());
    document.documentElement.style.setProperty('--color-secondary-200', _secondaryColor.lighten(0.2).hex());
    document.documentElement.style.setProperty('--color-secondary-100', _secondaryColor.lighten(0.1).hex());

    // document.documentElement.style.setProperty(
    //   "--color-secondary-100",
    //   _secondaryColor.lighten(0.1).hex()
    // );
  }, [shopSetting]);

  return {};
};
