import { KEN_ALL_CSV_FILENAME } from '@/lib/constants';
import { readKenAllRecord } from '@/lib/generate/read-ken-all-record';
import { afterEach, beforeEach, expect, test } from '@jest/globals';
import { mkdtempSync, rmSync } from 'fs';
import { writeFile } from 'fs/promises';
import { encode } from 'iconv-lite';
import { join } from 'path';

let workDir: string;

beforeEach(() => {
  workDir = mkdtempSync('adg-test');
});

afterEach(() => {
  rmSync(workDir, { force: true, recursive: true });
});

test('parse csv', async () => {
  await writeFile(
    join(workDir, KEN_ALL_CSV_FILENAME),
    encode(
      `01101,"060  ","0600000","ﾎｯｶｲﾄﾞｳ","ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ","ｲｶﾆｹｲｻｲｶﾞﾅｲﾊﾞｱｲ","北海道","札幌市中央区","以下に掲載がない場合",0,0,0,0,0,0
02405,"033  ","0330071","ｱｵﾓﾘｹﾝ","ｶﾐｷﾀｸﾞﾝﾛｸﾉﾍﾏﾁ","ｲﾇｵﾄｾ(ｳﾁｶﾅﾔ､ｳﾁﾔﾏ､ｵｶﾇﾏ､ｶﾅｻﾞﾜ､ｶﾅﾔ､ｶﾐｻﾋﾞｼﾛ､ｷｺｼ､ｺﾞﾝｹﾞﾝｻﾜ､","青森県","上北郡六戸町","犬落瀬（内金矢、内山、岡沼、金沢、金矢、上淋代、木越、権現沢、",1,1,0,0,0,0
02405,"033  ","0330071","ｱｵﾓﾘｹﾝ","ｶﾐｷﾀｸﾞﾝﾛｸﾉﾍﾏﾁ","ｼｷ､ｼﾁﾋｬｸ､ｼﾓｸﾎﾞ<174ｦﾉｿﾞｸ>､ｼﾓｻﾋﾞｼﾛ､ﾀｶﾓﾘ､ﾂﾞﾒｷ､ﾂﾎﾞｹｻﾞﾜ<2","青森県","上北郡六戸町","四木、七百、下久保「１７４を除く」、下淋代、高森、通目木、坪毛沢「２",1,1,0,0,0,0
02405,"033  ","0330071","ｱｵﾓﾘｹﾝ","ｶﾐｷﾀｸﾞﾝﾛｸﾉﾍﾏﾁ","5､637､641､643､647ｦﾉｿﾞｸ>､ﾅｶﾔｼｷ､ﾇﾏｸﾎﾞ､ﾈｺﾊｼ､ﾎﾘｷﾘ","青森県","上北郡六戸町","５、６３７、６４１、６４３、６４７を除く」、中屋敷、沼久保、根古橋、堀切",1,1,0,0,0,0
02405,"033  ","0330071","ｱｵﾓﾘｹﾝ","ｶﾐｷﾀｸﾞﾝﾛｸﾉﾍﾏﾁ","ｻﾜ､ﾐﾅﾐﾀｲ､ﾔﾅｷﾞｻﾜ､ｵｵﾏｶﾞﾘ)","青森県","上北郡六戸町","沢、南平、柳沢、大曲）",1,1,0,0,0,0`,
      'Shift_JIS'
    )
  );

  const generator = readKenAllRecord(join(workDir, KEN_ALL_CSV_FILENAME));

  await expect(generator.next()).resolves.toEqual({
    done: false,
    value: [
      '01101',
      '060  ',
      '0600000',
      'ﾎｯｶｲﾄﾞｳ',
      'ｻｯﾎﾟﾛｼﾁｭｳｵｳｸ',
      'ｲｶﾆｹｲｻｲｶﾞﾅｲﾊﾞｱｲ',
      '北海道',
      '札幌市中央区',
      '以下に掲載がない場合',
      '0',
      '0',
      '0',
      '0',
      '0',
      '0',
    ],
  });

  await expect(generator.next()).resolves.toEqual({
    done: false,
    value: [
      '02405',
      '033  ',
      '0330071',
      'ｱｵﾓﾘｹﾝ',
      'ｶﾐｷﾀｸﾞﾝﾛｸﾉﾍﾏﾁ',
      'ｲﾇｵﾄｾ(ｳﾁｶﾅﾔ､ｳﾁﾔﾏ､ｵｶﾇﾏ､ｶﾅｻﾞﾜ､ｶﾅﾔ､ｶﾐｻﾋﾞｼﾛ､ｷｺｼ､ｺﾞﾝｹﾞﾝｻﾜ､ｼｷ､ｼﾁﾋｬｸ､ｼﾓｸﾎﾞ<174ｦﾉｿﾞｸ>､ｼﾓｻﾋﾞｼﾛ､ﾀｶﾓﾘ､ﾂﾞﾒｷ､ﾂﾎﾞｹｻﾞﾜ<25､637､641､643､647ｦﾉｿﾞｸ>､ﾅｶﾔｼｷ､ﾇﾏｸﾎﾞ､ﾈｺﾊｼ､ﾎﾘｷﾘｻﾜ､ﾐﾅﾐﾀｲ､ﾔﾅｷﾞｻﾜ､ｵｵﾏｶﾞﾘ)',
      '青森県',
      '上北郡六戸町',
      '犬落瀬（内金矢、内山、岡沼、金沢、金矢、上淋代、木越、権現沢、四木、七百、下久保「１７４を除く」、下淋代、高森、通目木、坪毛沢「２５、６３７、６４１、６４３、６４７を除く」、中屋敷、沼久保、根古橋、堀切沢、南平、柳沢、大曲）',
      '1',
      '1',
      '0',
      '0',
      '0',
      '0',
    ],
  });
  await expect(generator.next()).resolves.toEqual({
    done: true,
  });
});
