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
      <form onSubmit={onSubmit} className="mb-3 mt-5">
        <div className="mb-3">
          <input type="text" name="input" className="form-control" placeholder="住所を入力してください。" />
        </div>
        <button type="submit" className="btn btn-primary">正規化</button>
      </form>
      { typeof result !== 'undefined' && <dl className="row">
        <dt className="col-sm-2 text-end">入力</dt>
        <dd className="col-sm-10">
          <p>{result.input}</p>
          <p>正規化レベル: [{result.normalized.level}] {levels[result.normalized.level]}</p>
        </dd>

        <dt className="col-sm-2 text-end">NJA正規化</dt>
        <dd className="col-sm-10"><pre>{JSON.stringify(result.normalized, undefined, 2)}</pre></dd>

        <dt className="col-sm-2 text-end">OSM正規化</dt>
        <dd className="col-sm-10"><pre>{formatOsmAddr(result.osmNormalized)}</pre></dd>
      </dl> }
    </div>
  );
}

export default App;
