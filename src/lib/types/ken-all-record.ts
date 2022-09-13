export type KenAllRecord = [
  jis: string,
  oldZipCode: string,
  zipCode: string,
  prefectureKana: string,
  cityKana: string,
  townAreaKana: string,
  prefecture: string,
  city: string,
  townArea: string,
  isOneTownByMultiZipCode: '0' | '1',
  isNumberedForEachSubDivision: '0' | '1',
  hasStreetAddress: '0' | '1',
  isMultiTownAreaByZipCode: '0' | '1',
  updated: '0' | '1',
  updateReason: '0' | '1' | '2' | '3' | '4' | '5' | '6'
];
