/* eslint-disable @typescript-eslint/no-unused-vars */
import { find } from 'lodash';
import ShopList from './shops.json';
type Shop =
  | 'dev_default'
  | 'dev_pharmacy'
  | 'dev_education'
  | 'dev_fnb'
  | 'pro_risens_miniApp'
  | 'pro_beauty_zone'
  | 'pro_pekah'
  | 'pro_litafa'
  | 'pro_bbespoke'
  | 'pro_binh_an'
  | 'pro_tairmart'
  | 'pro_top_smile'
  | 'pro_tmark'
  | 'pro_anh_sao'
  | 'pro_dib_agency'
  | 'pro_upgo'
  | 'pro_bizlive'
  | 'pro_annie_house'
  | 'pro_horme_flooring'
  | 'pro_hannah_foods'
  | 'pro_tong_kho_si'
  | 'pro_eco_academy'
  | 'pro_mini_ap'
  | 'pro_you_are_nuts'
  | 'pro_neta_link'
  | 'pro_minh_chau'
  | 'pro_bi_house'
  | 'pro_your_closet'
  | 'pro_yeu_cong_nghe'
  | 'pro_care_by_gemnie'
  | 'pro_bebibu'
  | 'pro_tt_0901'
  | 'pro_hp_house'
  | 'pro_prosing'
  | 'pro_ty_house'
  | 'pro_huynh_bao'
  | 'pro_bich_thu'
  | 'pro_quang_danh'
  | 'pro_beli_shop'
  | 'pro_lam_moc'
  | 'pro_hi_beauty'
  | 'pro_hm_studio'
  | 'pro_gymwhey'
  | 'pro_micofi'
  | 'pro_automatik'
  | 'pro_in_gia_tot'
  | 'pro_bau_may'
  | 'pro_eco_care'
  | 'pro_tiem_banh_3T';
const shop: Shop = 'dev_default';

const enableAppCenter = true;
console.log(enableAppCenter);

// Lưu ý khi đổi shop mà muốn build lên trên store:
// 1. Xoá .env
// 2. Chạy lệnh: zmp login nhập MiniApp
// 3. Xong chạy lệng zmp deploy và chọn chế độ Testing

const SHOP_LISTS = ShopList;

const SHOW_INTRODUCTION = shop === ('pro_tmark' as Shop);

const shopDetails = find(SHOP_LISTS, {
  shopKey: shop,
});

// export { Shop, shop, SHOP_LISTS, SHOW_INTRODUCTION, enableAppCenter, changeShop };
export { shopDetails, Shop, shop, SHOP_LISTS, SHOW_INTRODUCTION };
