export class Station {
  '時刻表編號': number;
  'traWebsiteCode': string;
  '站名': string;
  'eng站名': string;
  'routeCode': number[];
  'gradeStation': {
    'status': boolean;
    'value': number;
  };
  'stops': number;
  '縣市': string;
  'eng縣市': string;
}
