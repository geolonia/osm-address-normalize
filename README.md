# OSM Address Normalize

@geolonia/normalize-japanese-addresses を使って OSM の `addr:*` 住所表記に変換するツール

[デモを見る](https://geolonia.github.io/osm-address-normalize/)

## OpenStreetMap の住所表記に関してのリソース

* [OpenStreetMap Wiki 日本の住所表記について](https://wiki.openstreetmap.org/wiki/JA:Key:addr#.E6.97.A5.E6.9C.AC.E3.81.AE.E4.BD.8F.E6.89.80.E8.A1.A8.E8.A8.98.E3.81.AB.E3.81.A4.E3.81.84.E3.81.A6)
* [OSMの地名・行政単位・郵便住所の対応](https://docs.google.com/spreadsheets/d/1eAE72mjCLoJVGZo5qRhCYK22UxVQ8bpbQSU9ZLHq40o/edit#gid=0) (Google Spreadseets)

## 例

入力「神奈川県川崎市宮前区神木本町1-2-3おはようビル101」に対して、下記の出力を生成する

```
addr:country=JP
addr:province=神奈川県
addr:city=川崎市
addr:suburb=宮前区
addr:quarter=神木本町
addr:neighbourhood=一丁目
addr:block_number=2
addr:housenumber=3
addr:flats=おはようビル
addr:room=101
```
