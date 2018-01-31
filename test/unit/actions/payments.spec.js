import { observable, useStrict } from 'mobx';
import ActionsGrpc from '../../../src/actions/grpc';
import ActionsPayments from '../../../src/actions/payments';

describe('Actions Payments Unit Tests', () => {
  let store;
  let actionsGrpc;
  let actionsPayments;
  const response = {
    destination:
      '035b55e3e08538afeef6ff9804e3830293eec1c4a6a9570f1e96a478dad1c86fed',
    payment_hash:
      'f99a06c85c12fe00bdd39cc852bf0c606bec23560d81dddbe887dd12f3783c95',
    num_satoshis: '1700',
    timestamp: '1516991998',
    expiry: '3600',
    description: '1 Espresso Coin Panna',
    description_hash: '',
    fallback_addr: '',
    cltv_expiry: '9',
  };

  beforeEach(() => {
    useStrict(false);
    store = observable({
      lndReady: false,
      paymentInfo: {
        payment: '',
        amount: '',
      },
    });
    require('../../../src/config').RETRY_DELAY = 1;
    actionsGrpc = sinon.createStubInstance(ActionsGrpc);
    actionsGrpc.sendCommand.resolves();
    store.lndReady = true;
    actionsPayments = new ActionsPayments(store, actionsGrpc);
  });

  describe('decodePaymentRequest()', () => {
    it('should decode successfully', async () => {
      actionsGrpc.sendCommand.withArgs('decodePayReq').resolves(response);
      await actionsPayments.decodePaymentRequest('goodPaymentRequest');
      expect(
        store.paymentRequestResponse.numSatoshis,
        'to be',
        response.num_satoshis
      );
      expect(
        store.paymentRequestResponse.description,
        'to be',
        response.description
      );
    });
  });

  describe('setPaymentInfo()', () => {
    it('should set paymentInfo property', () => {
      actionsPayments.setPaymentInfo('amount', 123);
      actionsPayments.setPaymentInfo(
        'payment',
        '2N1uP9hbSs75AmAYBFWW1p9qs72qFn7vuFX'
      );
      expect(store.paymentInfo.amount, 'to be', 123);
      expect(
        store.paymentInfo.payment,
        'to be',
        '2N1uP9hbSs75AmAYBFWW1p9qs72qFn7vuFX'
      );
    });

    it('should clear paymentInfo and paymentRequestResponse', async () => {
      // Set paymentRequestResponse
      actionsGrpc.sendCommand.withArgs('decodePayReq').resolves(response);
      await actionsPayments.decodePaymentRequest('goodPaymentRequest');
      // Set paymentInfo
      actionsPayments.setPaymentInfo('amount', 123);
      actionsPayments.setPaymentInfo(
        'payment',
        '2N1uP9hbSs75AmAYBFWW1p9qs72qFn7vuFX'
      );
      // Clear
      actionsPayments.clearPaymentInfo();

      expect(store.paymentInfo.amount, 'to be', '');
      expect(store.paymentInfo.payment, 'to be', '');
      expect(store.paymentRequestResponse.numSatoshis, 'to be', undefined);
      expect(store.paymentRequestResponse.description, 'to be', undefined);
    });
  });
});
