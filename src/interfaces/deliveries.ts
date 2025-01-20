export interface NewDelivery {
  id?: number;
  country?: string;
  deliveryName?: string;
}
export interface newDeliveryErrors {
  country?: string | null;
  deliveryName?: string | null;
}
