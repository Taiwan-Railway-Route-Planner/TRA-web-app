const HOME_IP = 'taiwan-railway-route-planner.github.io';
const BASE_URL: string = 'https://' + HOME_IP + '/TRATimetableData/';

const EXTERNAL_IP = 'taiwanrailwayapp.com';
const BACKEND: string = 'https://www.' + EXTERNAL_IP + '/api/';

export const Url = {
  station: BASE_URL + 'stationInfo.json',
  easyToSearchStationInfo: BASE_URL + 'easyToSearchStationInfo.json',
  schedulesDay: BACKEND + 'route'
};
