import { useState, useEffect } from 'react';

function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 東京(130000)のデータ。末尾を書き換えれば他県もいけます
    fetch('https://www.jma.go.jp/bosai/forecast/data/forecast/130000.json')
      .then(res => res.json())
      .then(data => {
        const forecast = data[0];

        // 1. 天気 (今日・明日)
        const weathers = forecast.timeSeries[0].areas[0].weathers;
        // 2. 降水確率 (時間帯ごとに細かいため、代表して最初の方を取得)
        const pops = forecast.timeSeries[1].areas[0].pops;
        // 3. 気温 (エリアによって取得位置が異なるため注意)
        const temps = forecast.timeSeries[2].areas[0].temps;

        setWeatherData({
          areaName: forecast.timeSeries[0].areas[0].area.name,
          today: {
            weather: weathers[0],
            pop: pops[0], // 直近の降水確率
            minTemp: temps[0],
            maxTemp: temps[1]
          },
          tomorrow: {
            weather: weathers[1],
            pop: pops[4] || pops[pops.length - 1], // 明日の代表的な降水確率
            minTemp: temps[2],
            maxTemp: temps[3]
          }
        });
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>エラー発生: {error.message}</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>{weatherData.areaName}の天気</h1>

      <div style={{ display: 'flex', gap: '15px' }}>
        {/* 今日 */}
        <div style={cardStyle}>
          <h3>今日</h3>
          <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{weatherData.today.weather}</p>
          <p>降水確率: {weatherData.today.pop}%</p>
          <p>気温: <span style={{ color: 'blue' }}>{weatherData.today.minTemp}℃</span> / <span style={{ color: 'red' }}>{weatherData.today.maxTemp}℃</span></p>
        </div>

        {/* 明日 */}
        <div style={cardStyle}>
          <h3>明日</h3>
          <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{weatherData.tomorrow.weather}</p>
          <p>降水確率: {weatherData.tomorrow.pop}%</p>
          <p>気温: <span style={{ color: 'blue' }}>{weatherData.tomorrow.minTemp}℃</span> / <span style={{ color: 'red' }}>{weatherData.tomorrow.maxTemp}℃</span></p>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  border: '1px solid #ddd',
  padding: '15px',
  borderRadius: '12px',
  flex: 1,
  backgroundColor: '#f9f9f9',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
};

export default Weather;