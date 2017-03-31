import { takeEvery } from 'redux-saga';
import { take, put, fork, race } from 'redux-saga/effects';

export const SUBMIT_FORM = '@@react-forml/SUBMIT_FORM';

export function submitForm(values, { sourceCreator, successAction, failureAction, resolve, reject }) {
  return { type: SUBMIT_FORM, payload: values, meta: { sourceCreator, successAction, failureAction, resolve, reject } };
}

export function bindSubmitFormToPromise(...params) {
  let [sourceCreator, successAction, failureAction, dispatch] = params;

  if (typeof successAction === 'function') {
    [sourceCreator, dispatch] = params;
    successAction = undefined;
    failureAction = undefined;
  }

  return (...values) => new Promise((resolve, reject) => {
    dispatch(submitForm(values, { sourceCreator, successAction, failureAction, resolve, reject }));
  });
}

function* dispatchSourceAction({ payload, meta }) {
  const sourceAction = meta.sourceCreator(...payload);

  yield put(sourceAction);

  const { success, failure } = yield race({
    success: take(meta.successAction || sourceAction.meta.successAction),
    failure: take(meta.failureAction || sourceAction.meta.failureAction),
  });

  if (success) {
    meta.resolve(success.payload);
  } else {
    meta.reject(failure.reason);
  }
}

function* watchFormSubmit() {
  yield takeEvery(SUBMIT_FORM, dispatchSourceAction);
}

export function* saga() {
  yield fork(watchFormSubmit);
}
