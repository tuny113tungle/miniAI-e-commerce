import axios from 'axios';
import {} from 'lodash';
import CookiesService from './CookiesService';
import { SHOP_ID } from './Api';
const MEDIA_URL = 'https://media.miniap.vn/api';

export const uploadImage = async (formData: FormData) => {
  if (formData) {
    const res = await axios.post(`${MEDIA_URL}/images/upload`, formData, {
      headers: {
        Authorization: `Bearer ${CookiesService.getClientCookies('token')}`,
        'Content-type': 'multipart/form-data',
        'shop-id': SHOP_ID,
      },
    });

    return (res?.data?.data?.imageUrl as string) || '';
  }

  return '';
};

export const deleteImage = async (fileKey: string) => {
  if (!fileKey) return;
  //if image url: https://media.vn/shop_id/abcd.png => fileKey will be: abcd.png

  await axios.post(
    `${MEDIA_URL}/images/delete`,
    {
      fileKey,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'shop-id': SHOP_ID,
      },
    },
  );
};
