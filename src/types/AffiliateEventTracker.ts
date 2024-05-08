import API from "../apis/Api";


export enum AffiliateEvent {
  VIEW_APP = 'view_app',
  VIEW_ITEM = 'view_item',
  ADD_TO_CART = 'add_to_cart',
  BUY_NOW_ITEM = 'buy_now_item',
  FAVORITE_ITEM = 'favorite_item',
  PURCHASE = 'purchase',
  END_SESSION = 'end_session',
}

export enum WalletEvent {
  COLLAB = 'sharedByCollab',
}

export type AffiliateTrackingEventActionDetails = {
  event: string;
  itemId?: string;
  orderId?: string;
};

class AffiliateEventTracker {
  public async captureEvent({ actionDetails, affSharedId }: { actionDetails: AffiliateTrackingEventActionDetails; affSharedId: string }) {
    return await API.createAffiliateTrackingEvent({ actionDetails, affSharedId });
  }
}

export default new AffiliateEventTracker();
