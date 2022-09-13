import { apiAction } from '@/lib/actions/generate/api-action';
import { createApiCommand } from '@/lib/commands/generate/create-api-command';
import { KEN_ALL_CSV_FILENAME } from '@/lib/constants';
import { makeTempDir } from '@/lib/utils/make-temp-dir';
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals';
import { rmSync } from 'fs';
import { IncomingMessage } from 'http';
import https from 'https';
import { encode } from 'iconv-lite';
import JSZip from 'jszip';

let workDir: string;

beforeEach(async () => {
  workDir = await makeTempDir();
});

afterEach(() => {
  rmSync(workDir, { force: true, recursive: true });
  jest.restoreAllMocks();
});

test('api action', async () => {
  mockHttpsResponse();

  let logOutput = '';
  jest.spyOn(console, 'info').mockImplementation((message) => {
    logOutput += message;
  });
  jest.spyOn(console, 'log').mockImplementation((message) => {
    logOutput += message;
  });

  await apiAction(workDir, { pretty: true }, createApiCommand());

  expect(logOutput).toMatch('[SUCCESS] Write addresses json');
}, 60000);

/**
 * テストに時間がかかるので、KEN_ALL.CSVを一部抜き出してシミュレートする
 */
function mockHttpsResponse(): void {
  jest.spyOn(https, 'get').mockImplementation((async (
    url: string,
    callback: (res: IncomingMessage) => void
  ) => {
    let dataListener: ((chunk: Buffer) => void) | undefined;
    let endListener: (() => void) | undefined;

    const res = {
      statusCode: 200,
      statusMessage: 'OK',
      pause() {
        return this;
      },
      on(event, listener) {
        if (event === 'data') {
          dataListener = listener as unknown as (chunk: Buffer) => void;
        }
        if (event === 'end') {
          endListener = listener as unknown as () => void;
        }
        return this;
      },
      resume() {
        // KEN_ALL.CSV から一部だけ抜き出したZIPファイルを返す
        (async () => {
          const zip = new JSZip();
          zip.file(KEN_ALL_CSV_FILENAME, encode(kenAllCsv, 'Shift_JIS'));
          dataListener?.(await zip.generateAsync({ type: 'nodebuffer' }));
          endListener?.();
        })();

        return this;
      },
    } as IncomingMessage;

    callback(res);

    return {
      on: jest.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any);
}

const kenAllCsv = `01101,"060  ","0600000","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｲｶﾆｹｲｻｲｶﾞﾅｲﾊﾞｱｲ","北海道","札幌市中央区","以下に掲載がない場合",0,0,0,0,0,0
01101,"064  ","0640941","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｱｻﾋｶﾞｵｶ","北海道","札幌市中央区","旭ケ丘",0,0,1,0,0,0
01101,"060  ","0600041","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｵｵﾄﾞｵﾘﾋｶﾞｼ","北海道","札幌市中央区","大通東",0,0,1,0,0,0
01101,"060  ","0600042","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｵｵﾄﾞｵﾘﾆｼ(1-19ﾁｮｳﾒ)","北海道","札幌市中央区","大通西（１～１９丁目）",1,0,1,0,0,0
01101,"064  ","0640820","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｵｵﾄﾞｵﾘﾆｼ(20-28ﾁｮｳﾒ)","北海道","札幌市中央区","大通西（２０～２８丁目）",1,0,1,0,0,0
01101,"060  ","0600031","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ1ｼﾞｮｳﾋｶﾞｼ","北海道","札幌市中央区","北一条東",0,0,1,0,0,0
01101,"060  ","0600001","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ1ｼﾞｮｳﾆｼ(1-19ﾁｮｳﾒ)","北海道","札幌市中央区","北一条西（１～１９丁目）",1,0,1,0,0,0
01101,"064  ","0640821","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ1ｼﾞｮｳﾆｼ(20-28ﾁｮｳﾒ)","北海道","札幌市中央区","北一条西（２０～２８丁目）",1,0,1,0,0,0
01101,"060  ","0600032","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ2ｼﾞｮｳﾋｶﾞｼ","北海道","札幌市中央区","北二条東",0,0,1,0,0,0
01101,"060  ","0600002","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ2ｼﾞｮｳﾆｼ(1-19ﾁｮｳﾒ)","北海道","札幌市中央区","北二条西（１～１９丁目）",1,0,1,0,0,0
01101,"064  ","0640822","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ2ｼﾞｮｳﾆｼ(20-28ﾁｮｳﾒ)","北海道","札幌市中央区","北二条西（２０～２８丁目）",1,0,1,0,0,0
01101,"060  ","0600033","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ3ｼﾞｮｳﾋｶﾞｼ","北海道","札幌市中央区","北三条東",0,0,1,0,0,0
01101,"060  ","0600003","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ3ｼﾞｮｳﾆｼ(1-19ﾁｮｳﾒ)","北海道","札幌市中央区","北三条西（１～１９丁目）",1,0,1,0,0,0
01101,"064  ","0640823","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ3ｼﾞｮｳﾆｼ(20-30ﾁｮｳﾒ)","北海道","札幌市中央区","北三条西（２０～３０丁目）",1,0,1,0,0,0
01101,"060  ","0600034","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ4ｼﾞｮｳﾋｶﾞｼ(1-8ﾁｮｳﾒ)","北海道","札幌市中央区","北四条東（１～８丁目）",1,0,1,0,0,0
01101,"060  ","0600004","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ4ｼﾞｮｳﾆｼ(1-19ﾁｮｳﾒ)","北海道","札幌市中央区","北四条西（１～１９丁目）",1,0,1,0,0,0
01101,"064  ","0640824","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ4ｼﾞｮｳﾆｼ(20-30ﾁｮｳﾒ)","北海道","札幌市中央区","北四条西（２０～３０丁目）",1,0,1,0,0,0
01101,"060  ","0600035","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ5ｼﾞｮｳﾋｶﾞｼ","北海道","札幌市中央区","北五条東",0,0,1,0,0,0
01101,"060  ","0600005","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ5ｼﾞｮｳﾆｼ(1-24ﾁｮｳﾒ)","北海道","札幌市中央区","北五条西（１～２４丁目）",1,0,1,0,0,0
01101,"064  ","0640825","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ5ｼﾞｮｳﾆｼ(25-29ﾁｮｳﾒ)","北海道","札幌市中央区","北五条西（２５～２９丁目）",1,0,1,0,0,0
01101,"060  ","0600006","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ6ｼﾞｮｳﾆｼ(10-25ﾁｮｳﾒ)","北海道","札幌市中央区","北六条西（１０～２５丁目）",1,0,1,0,0,0
01101,"064  ","0640826","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ6ｼﾞｮｳﾆｼ(26-28ﾁｮｳﾒ)","北海道","札幌市中央区","北六条西（２６～２８丁目）",1,0,1,0,0,0
01101,"060  ","0600007","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ7ｼﾞｮｳﾆｼ","北海道","札幌市中央区","北七条西",0,0,1,0,0,0
01101,"060  ","0600008","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ8ｼﾞｮｳﾆｼ","北海道","札幌市中央区","北八条西",0,0,1,0,0,0
01101,"060  ","0600009","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ9ｼﾞｮｳﾆｼ","北海道","札幌市中央区","北九条西",0,0,1,0,0,0
01101,"060  ","0600010","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ10ｼﾞｮｳﾆｼ","北海道","札幌市中央区","北十条西",0,0,1,0,0,0
01101,"060  ","0600011","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ11ｼﾞｮｳﾆｼ","北海道","札幌市中央区","北十一条西",0,0,1,0,0,0
01101,"060  ","0600012","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ12ｼﾞｮｳﾆｼ","北海道","札幌市中央区","北十二条西",0,0,1,0,0,0
01101,"060  ","0600013","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ13ｼﾞｮｳﾆｼ","北海道","札幌市中央区","北十三条西",0,0,1,0,0,0
01101,"060  ","0600014","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ14ｼﾞｮｳﾆｼ","北海道","札幌市中央区","北十四条西",0,0,1,0,0,0
01101,"060  ","0600015","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ15ｼﾞｮｳﾆｼ","北海道","札幌市中央区","北十五条西",0,0,1,0,0,0
01101,"060  ","0600016","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ16ｼﾞｮｳﾆｼ","北海道","札幌市中央区","北十六条西",0,0,1,0,0,0
01101,"060  ","0600017","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ17ｼﾞｮｳﾆｼ","北海道","札幌市中央区","北十七条西",0,0,1,0,0,0
01101,"060  ","0600018","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ18ｼﾞｮｳﾆｼ","北海道","札幌市中央区","北十八条西",0,0,1,0,0,0
01101,"060  ","0600020","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ20ｼﾞｮｳﾆｼ","北海道","札幌市中央区","北二十条西",0,0,1,0,0,0
01101,"060  ","0600021","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ21ｼﾞｮｳﾆｼ","北海道","札幌市中央区","北二十一条西",0,0,1,0,0,0
01101,"060  ","0600022","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｷﾀ22ｼﾞｮｳﾆｼ","北海道","札幌市中央区","北二十二条西",0,0,1,0,0,0
01101,"064  ","0640943","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｻｶｲｶﾞﾜ","北海道","札幌市中央区","界川",0,0,1,0,0,0
01101,"064  ","0640931","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾅｶｼﾞﾏｺｳｴﾝ","北海道","札幌市中央区","中島公園",0,0,0,0,0,0
01101,"064  ","0640945","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾊﾞﾝｹｲ","北海道","札幌市中央区","盤渓",0,0,0,0,0,0
01101,"064  ","0640942","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾌｼﾐ","北海道","札幌市中央区","伏見",0,0,1,0,0,0
01101,"064  ","0640946","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾌﾀｺﾞﾔﾏ","北海道","札幌市中央区","双子山",0,0,1,0,0,0
01101,"064  ","0640944","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾏﾙﾔﾏﾆｼﾏﾁ","北海道","札幌市中央区","円山西町",0,0,1,0,0,0
01101,"060  ","0600051","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ1ｼﾞｮｳﾋｶﾞｼ","北海道","札幌市中央区","南一条東",0,0,1,0,0,0
01101,"060  ","0600061","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ1ｼﾞｮｳﾆｼ(1-19ﾁｮｳﾒ)","北海道","札幌市中央区","南一条西（１～１９丁目）",1,0,1,0,0,0
01101,"064  ","0640801","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ1ｼﾞｮｳﾆｼ(20-28ﾁｮｳﾒ)","北海道","札幌市中央区","南一条西（２０～２８丁目）",1,0,1,0,0,0
01101,"060  ","0600052","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ2ｼﾞｮｳﾋｶﾞｼ","北海道","札幌市中央区","南二条東",0,0,1,0,0,0
01101,"060  ","0600062","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ2ｼﾞｮｳﾆｼ(1-19ﾁｮｳﾒ)","北海道","札幌市中央区","南二条西（１～１９丁目）",1,0,1,0,0,0
01101,"064  ","0640802","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ2ｼﾞｮｳﾆｼ(20-28ﾁｮｳﾒ)","北海道","札幌市中央区","南二条西（２０～２８丁目）",1,0,1,0,0,0
01101,"060  ","0600053","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ3ｼﾞｮｳﾋｶﾞｼ","北海道","札幌市中央区","南三条東",0,0,1,0,0,0
01101,"060  ","0600063","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ3ｼﾞｮｳﾆｼ(1-18ﾁｮｳﾒ)","北海道","札幌市中央区","南三条西（１～１８丁目）",1,0,1,0,0,0
01101,"064  ","0640803","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ3ｼﾞｮｳﾆｼ(20-28ﾁｮｳﾒ)","北海道","札幌市中央区","南三条西（２０～２８丁目）",1,0,1,0,0,0
01101,"060  ","0600054","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ4ｼﾞｮｳﾋｶﾞｼ","北海道","札幌市中央区","南四条東",0,0,1,0,0,0
01101,"064  ","0640804","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ4ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南四条西",0,0,1,0,0,0
01101,"060  ","0600055","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ5ｼﾞｮｳﾋｶﾞｼ","北海道","札幌市中央区","南五条東",0,0,1,0,0,0
01101,"064  ","0640805","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ5ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南五条西",0,0,1,0,0,0
01101,"060  ","0600056","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ6ｼﾞｮｳﾋｶﾞｼ","北海道","札幌市中央区","南六条東",0,0,1,0,0,0
01101,"064  ","0640806","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ6ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南六条西",0,0,1,0,0,0
01101,"060  ","0600057","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ7ｼﾞｮｳﾋｶﾞｼ","北海道","札幌市中央区","南七条東",0,0,1,0,0,0
01101,"064  ","0640807","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ7ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南七条西",0,0,1,0,0,0
01101,"064  ","0640808","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ8ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南八条西",0,0,1,0,0,0
01101,"064  ","0640809","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ9ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南九条西",0,0,1,0,0,0
01101,"064  ","0640810","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ10ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南十条西",0,0,1,0,0,0
01101,"064  ","0640811","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ11ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南十一条西",0,0,1,0,0,0
01101,"064  ","0640912","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ12ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南十二条西",0,0,1,0,0,0
01101,"064  ","0640913","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ13ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南十三条西",0,0,1,0,0,0
01101,"064  ","0640914","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ14ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南十四条西",0,0,1,0,0,0
01101,"064  ","0640915","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ15ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南十五条西",0,0,1,0,0,0
01101,"064  ","0640916","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ16ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南十六条西",0,0,1,0,0,0
01101,"064  ","0640917","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ17ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南十七条西",0,0,1,0,0,0
01101,"064  ","0640918","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ18ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南十八条西",0,0,1,0,0,0
01101,"064  ","0640919","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ19ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南十九条西",0,0,1,0,0,0
01101,"064  ","0640920","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ20ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南二十条西",0,0,1,0,0,0
01101,"064  ","0640921","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ21ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南二十一条西",0,0,1,0,0,0
01101,"064  ","0640922","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ22ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南二十二条西",0,0,1,0,0,0
01101,"064  ","0640923","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ23ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南二十三条西",0,0,1,0,0,0
01101,"064  ","0640924","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ24ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南二十四条西",0,0,1,0,0,0
01101,"064  ","0640925","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ25ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南二十五条西",0,0,1,0,0,0
01101,"064  ","0640926","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ26ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南二十六条西",0,0,1,0,0,0
01101,"064  ","0640927","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ27ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南二十七条西",0,0,1,0,0,0
01101,"064  ","0640928","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ28ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南二十八条西",0,0,1,0,0,0
01101,"064  ","0640929","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ29ｼﾞｮｳﾆｼ","北海道","札幌市中央区","南二十九条西",0,0,1,0,0,0
01101,"064  ","0640930","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾅﾐ30ｼﾞｮｳﾆｼ(9-11ﾁｮｳﾒ)","北海道","札幌市中央区","南三十条西（９～１１丁目）",0,0,1,0,0,0
01101,"064  ","0640959","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾔｶﾞｵｶ","北海道","札幌市中央区","宮ケ丘",0,0,1,0,0,0
01101,"064  ","0640958","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾔﾉﾓﾘ","北海道","札幌市中央区","宮の森",0,0,0,0,0,0
01101,"064  ","0640951","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾔﾉﾓﾘ1ｼﾞｮｳ","北海道","札幌市中央区","宮の森一条",0,0,1,0,0,0
01101,"064  ","0640952","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾔﾉﾓﾘ2ｼﾞｮｳ","北海道","札幌市中央区","宮の森二条",0,0,1,0,0,0
01101,"064  ","0640953","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾔﾉﾓﾘ3ｼﾞｮｳ","北海道","札幌市中央区","宮の森三条",0,0,1,0,0,0
01101,"064  ","0640954","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ﾐﾔﾉﾓﾘ4ｼﾞｮｳ","北海道","札幌市中央区","宮の森四条",0,0,1,0,0,0
01102,"001  ","0010000","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼｷﾀｸ","ｲｶﾆｹｲｻｲｶﾞﾅｲﾊﾞｱｲ","北海道","札幌市北区","以下に掲載がない場合",0,0,0,0,0,0
01102,"002  ","0028071","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼｷﾀｸ","ｱｲﾉｻﾄ1ｼﾞｮｳ","北海道","札幌市北区","あいの里一条",0,0,1,0,0,0
01102,"002  ","0028072","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼｷﾀｸ","ｱｲﾉｻﾄ2ｼﾞｮｳ","北海道","札幌市北区","あいの里二条",0,0,1,0,0,0
01102,"002  ","0028073","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼｷﾀｸ","ｱｲﾉｻﾄ3ｼﾞｮｳ","北海道","札幌市北区","あいの里三条",0,0,1,0,0,0
01102,"002  ","0028074","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼｷﾀｸ","ｱｲﾉｻﾄ4ｼﾞｮｳ","北海道","札幌市北区","あいの里四条",0,0,1,0,0,0
01102,"002  ","0028075","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼｷﾀｸ","ｱｲﾉｻﾄ5ｼﾞｮｳ","北海道","札幌市北区","あいの里五条",0,0,1,0,0,0
01102,"001  ","0010045","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼｷﾀｸ","ｱｻﾌﾞﾁｮｳ","北海道","札幌市北区","麻生町",0,0,1,0,0,0
01102,"060  ","0600806","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼｷﾀｸ","ｷﾀ6ｼﾞｮｳﾆｼ","北海道","札幌市北区","北六条西",0,0,1,0,0,0
01102,"060  ","0600807","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼｷﾀｸ","ｷﾀ7ｼﾞｮｳﾆｼ","北海道","札幌市北区","北七条西",0,0,1,0,0,0
01102,"060  ","0600808","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼｷﾀｸ","ｷﾀ8ｼﾞｮｳﾆｼ","北海道","札幌市北区","北八条西",0,0,1,0,0,0
01102,"060  ","0600809","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼｷﾀｸ","ｷﾀ9ｼﾞｮｳﾆｼ","北海道","札幌市北区","北九条西",0,0,1,0,0,0`;