import { computed, extendObservable } from 'mobx';
import { formatSatoshis } from '../helpers';

const ComputedPayments = store => {
  extendObservable(store, {
    computedPayment: computed(() => {
      const { paymentInfo, paymentRequestResponse } = store;
      let returnData;
      if (paymentRequestResponse.numSatoshis) {
        returnData = {
          numSatoshis: paymentRequestResponse.numSatoshis,
          description: paymentRequestResponse.description || null,
          isPaymentRequest: true,
        };
      } else {
        returnData = {
          numSatoshis: paymentInfo.numSatoshis ? String(paymentInfo.numSatoshis.replace(/\D/g, '')) : '',
          isPaymentRequest: false,
        };
      }
      returnData.payment = paymentInfo.payment;
      return returnData;
    }),
  });
};

export default ComputedPayments;
