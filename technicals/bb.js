function bb(tradePrices) {
  const period = 20;
  const multiplier = 2;

  const movingAverages = [];
  for (let i = 0; i <= tradePrices.length - period; i++) {
    const average =
      tradePrices.slice(i, i + period).reduce((sum, price) => sum + price, 0) /
      period;
    movingAverages.push(average);
  }

  // 표준편차 계산
  const standardDeviation = Math.sqrt(
    movingAverages.reduce(
      (sum, avg) => sum + Math.pow(avg - movingAverages[0], 2),
      0
    ) / period
  );

  // 볼린저 밴드 계산
  const upperBand = movingAverages[0] + multiplier * standardDeviation;
  const middleBand = movingAverages[0];
  const lowerBand = movingAverages[0] - multiplier * standardDeviation;

  // 객체로 결과 저장
  const bollingerBands = {
    "Upper Band": upperBand,
    "Middle Band": middleBand,
    "Lower Band": lowerBand,
  };

  return bollingerBands;
}

module.exports = {
  bb,
};
