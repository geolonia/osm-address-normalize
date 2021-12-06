import React from "react";
import { normalize, NormalizeResult } from '@geolonia/normalize-japanese-addresses';
import { nja2osm, OsmAddress } from "./lib";

interface Result {
  input: string
  normalized: NormalizeResult
  osmNormalized: OsmAddress
}

const levels = [
  '正規化ができませんでした。',
  '都道府県名までの正規化ができました。',
  '市区町村名までの正規化ができました。',
  '町丁目までの正規化ができました。',
];

const formatOsmAddr = (input: OsmAddress) => {
  let out = "";
  for (const [ key, value ] of Object.entries(input)) {
    out += `${key}=${value}\n`;
  }
  return out;
}

const App: React.FC = () => {
  const [ result, setResult ] = React.useState<Result | undefined>(undefined)

  const onSubmit = React.useCallback(async (ev: React.FormEvent) => {
    ev.preventDefault();
    const inputText = (ev.currentTarget as any)['input']?.value;
    if (!inputText) return;
    const normalized = await normalize(inputText);

    setResult({
      input: inputText,
      normalized,
      osmNormalized: nja2osm(normalized),
    });
  }, []);

  return (
    <div className="container">
      <h1 className="my-4"><code>@geolonia/osm-address-normalize</code></h1>
      <p>
        <a href="https://github.com/geolonia/normalize-japanese-addresses" target="_blank" rel="noreferrer noopener"><code>@geolonia/normalize-japanese-addresses</code></a>を使って住所を正規化し、OpenStreetMap用のタグに分離させるためのツールです。<a href="https://github.com/geolonia/osm-address-normalize/" target="_blank" rel="noreferrer noopener">詳細は GitHub をご覧ください。</a>
      </p>
      <p>
        正規化が失敗したり、出力に問題があったりする場合は<a href="https://github.com/geolonia/osm-address-normalize/issues/new" target="_blank" rel="noreferrer noopener">こちらで報告</a>していただけると助かります。
      </p>
      <form onSubmit={onSubmit} className="mb-3 mt-5">
        <div className="mb-3">
          <input type="text" name="input" className="form-control" placeholder="住所を入力してください。" />
        </div>
        <button type="submit" className="btn btn-primary">正規化</button>
      </form>
      { typeof result !== 'undefined' && <dl className="row">
        <dt className="col-sm-2 text-end">入力</dt>
        <dd className="col-sm-10">
          {result.input}
        </dd>

        <dt className="col-sm-2 text-end">
          NJA出力
        </dt>
        <dd className="col-sm-10">
          <p>[{result.normalized.level}] {levels[result.normalized.level]}</p>
          <pre>{JSON.stringify(result.normalized, undefined, 2)}</pre>
        </dd>

        <dt className="col-sm-2 text-end">OSMタグ形式</dt>
        <dd className="col-sm-10"><pre>{formatOsmAddr(result.osmNormalized)}</pre></dd>
      </dl> }
    </div>
  );
}

export default App;
