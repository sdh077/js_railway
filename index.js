const tr = {};
const curry = (f) => (a, ..._) =>
  _.length ? f(a, ..._) : (..._) => f(a, ..._);

function success(value) {
  return {
    status: true,
    value,
  };
}
tr.success = success;
tr.fail = { status: false };

tr.flatMap = function flatMap(fn) {
  return (input) => {
    if (input.status === false) return tr.fail;
    else return fn(input.value);
  };
};
tr.pass = function pass(fn) {
  return (input) => {
    if (input.status === false) return tr.fail;
    else return success(fn(input.value));
  };
};
tr.final = curry(function final(rejectvalue, input) {
  return input.status ? input.value : rejectvalue;
});
tr.pipe = function pipe(...fns) {
  return (...args) => {
    return fns.reverse().reduceRight(
      // 입력 받은 fns의 순서를 뒤집는다
      (res, fn) => [fn.call(null, ...res)], // 순서가 뒤집어진 fns 를 오른쪽부터 실행
      args // 초기값으로 받은 파라미터
    )[0];
  };
};
module.exports = tr;
