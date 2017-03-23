import { takeEvery } from 'redux-saga';
import { take, put, fork, call, race } from 'redux-saga/effects';

export const SUBMIT_FORM = '@@react-forml/SUBMIT_FORM';

export function submitForm(values, { sourceCreater, successAction, failureAction, resolve, reject }) {
  return { type: SUBMIT_FORM, payload: values, meta: { sourceCreater, successAction, failureAction, resolve, reject } };
}

export function bindSubmitFormToPromise(sourceCreater, successAction, failureAction, dispatch) {
  return (...values) => new Promise((resolve, reject) => {
    dispatch(submitForm(values, { sourceCreater, successAction, failureAction, resolve, reject }));
  });
}

function* dispatchSourceAction({ payload, meta }) {
  yield put(meta.sourceCreater(...payload));

  const { success, failure } = yield race({
    success: take(meta.successAction),
    failure: take(meta.failureAction),
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
