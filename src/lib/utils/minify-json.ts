export function minifyJson(content: string): string {
  // 住所には半角スペースが含まれないため、ダブルクオーテーション内のスペースを考慮せずにすべて消す
  return content.replace(/[ \n]/g, '');
}
