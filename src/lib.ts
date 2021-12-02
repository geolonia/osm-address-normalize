import { NormalizeResult } from '@geolonia/normalize-japanese-addresses';

export interface OsmAddress {
  /** 日本の場合は `JP` に固定 */
  'addr:country'?: string
  /** 都道府県 */
  'addr:province'?: string  
  /** 〇〇郡 */
  'addr:county'?: string
  /** 〇〇市町村 */
  'addr:city'?: string
  /** 〇〇区(政令指定都市の区以外の区も含む) */
  'addr:suburb'?: string
  /** 〇〇大字 / (市町村配下の)町 */
  'addr:quarter'?: string
  /** 〇〇小字 / 字 / 丁 / 丁目 / 島嶼部 */
  'addr:neighbourhood'?: string
  /** 〇〇街区符号 / 番 / 番地 / 地番 (無番地の場合はこの部分に"無番地"と記載) */
  'addr:block_number'?: string
  /** 〇〇住居番号 / 号 / 支号 / 枝番号 */
  'addr:housenumber'?: string
  /** 〇〇複合住宅 / 施設の名称 */
  'addr:flats'?: string
  /** 〇〇複合住宅 / 施設の部屋番号 */
  'addr:room'?: string
  /** 〇〇複合住宅 / 施設の階層 */
  'addr:floor'?: string
}

export const nja2osm: (input: NormalizeResult) => OsmAddress = (input) => {
  const output: OsmAddress = {
    'addr:country': 'JP',
  };

  if (input.pref) output['addr:province'] = input.pref;
  if (input.city) {
    const countyMatch = input.city.match(/^([^郡]*郡)(.*)$/);
    const suburbMatch = input.city.match(/^([^市]+市)?([^区]+区)$/);
    if (countyMatch) {
      output['addr:county'] = countyMatch[1];
      output['addr:quarter'] = countyMatch[2];
    } else if (suburbMatch) {
      if (suburbMatch[1]) {
        // 政令指定都市の区の場合はcityも指定しなければならない
        output['addr:city'] = suburbMatch[1];
      }
      output['addr:suburb'] = suburbMatch[2];
    } else {
      output['addr:city'] = input.city;
    }
  }
  if (input.town) {
    const chomeMatch = input.town.match(/^(.*?)([一二三四五六七八九十]+丁目)$/);
    if (chomeMatch) {
      output['addr:quarter'] = chomeMatch[1];
      output['addr:neighbourhood'] = chomeMatch[2];
    } else {
      output['addr:quarter'] = input.town;
    }
  }
  if (input.addr) {
    let addr = input.addr;
    const koazaMatch = addr.match(/^([^\d]+)(.*)$/);
    if (koazaMatch) {
      addr = koazaMatch[2];
      output['addr:neighbourhood'] = koazaMatch[1];
    }
    const banchiGoMatch = addr.match(/^^([\d]+)(?:-([\d]+))?(.*)$/);
    if (banchiGoMatch) {
      output['addr:block_number'] = banchiGoMatch[1];
      if (banchiGoMatch[2]) {
        output['addr:housenumber'] = banchiGoMatch[2];
      }
      if (banchiGoMatch[3]) {
        const other = banchiGoMatch[3];
        const bldgMatch = other.match(/^([^\d]+)(?:([\d]+)?|(?:([\d]+)(?:F|階|カイ)))$/);
        if (bldgMatch) {
          output['addr:flats'] = bldgMatch[1];
          if (bldgMatch[2]) {
            output['addr:room'] = bldgMatch[2];
          }
          if (bldgMatch[3]) {
            output['addr:floor'] = bldgMatch[3];
          }
        }
      }
    }
  }

  return output;
};