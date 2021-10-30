# [LT Space](https://lt-space.abelab.dev/)

![build](https://github.com/jphacks/C_2101/workflows/build/badge.svg)
![test](https://github.com/jphacks/C_2101/workflows/test/badge.svg)
![lint](https://github.com/jphacks/C_2101/workflows/lint/badge.svg)
![deploy](https://github.com/jphacks/C_2101/workflows/deploy/badge.svg)
![prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
![version 1.0](https://img.shields.io/badge/version-1.0-yellow.svg)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

[![IMAGE ALT TEXT HERE](https://jphacks.com/wp-content/uploads/2021/07/JPHACKS2021_ogp.jpg)](https://www.youtube.com/watch?v=LUPQFB4QyVo)

## 製品概要

### オンライン発表 × Tech

オンライン発表をもっと快適に、企画から開催までをシームレスに行えるビデオチャットプラットフォーム。

### 背景(製品開発のきっかけ、課題等）

コロナ禍になってから、LT 会などのオンライン発表をする機会が増えた。
しかし、オンライン発表では持ち時間やリアクションを確認しづらいだけでなく、タイムテーブルの共有も曖昧で、逐一オーナーがアナウンスするなどの煩わしさがある。

そこで、オンライン発表会の企画から開催までをシームレスに行える、クラウドベースなビデオチャットプラットフォームを開発した。

### 製品説明（具体的な製品の説明）

#### ルームの作成・参加登録

- 企画者がタイトル・説明文・開催日を設定しルームを作成する
- ユーザはルーム一覧から、気に行ったルームへ参加登録する
- 開催日にはルームへの入室が許可され、Zoom ライクな UI へ遷移できる

#### オンライン発表会の実施

- 事前に登録された登壇者情報からタイムテーブルが生成される
- タイムテーブル通りに進行され、発表が始まると持ち時間が表示される
- 視聴者はチャットやスタンプ機能を使ってリアクションできる

### 特長

#### 1. 企画から開催までをシームレスに行える

LT Space はルームの作成、参加登録について compass ライクなサービスを提供する。
ルームオーナーは事前に発表テーマ、開催日時、持ち時間などを設定し、興味を引いたユーザは参加登録をすることができる。
開催時は事前に設定した制限時間や登壇者を元にタイムテーブルが生成されるため、オーナーの手間を省けるだけでなく、視聴者にとっても当日の流れを把握しやすくなる。

#### 2. 発表をもっと快適に

既存のビデオチャットプラットフォームはオンライン発表のみを前提としているわけではないため、持ち時間やタイムテーブル表示機能を設けていない。
本サービスはオンライン発表に特化し、快適に発表・視聴できるプラットフォームを提供する。

#### 3. 気になったルームをすぐにチェック

タイムラインには直近のルーム一覧が表示され、興味を引くルームがあれば、開催中でも視聴可能。

### 解決出来ること

昨今のオンライン発表は持ち時間やタイムテーブルの共有に煩わしさがあった。LT Space はこのような当日運営や参加者の募集をサービスが受け持つため、オンライン発表をより快適にできる。また、発表時間を超過した場合のシステムによる強制的な打ち切りと延長依頼により、オーナーが言い出しにくいという心情をケアしている。

### 今後の展望

絵文字によるリアクション機能やカメラのオンオフ機能など、部分的にしか実装できていない点がある。
現在ゲスト機能は設けておらず、視聴にもサインアップを求めている。サービスに登録したくはないが、試しに覗いてみたいというライトユーザを考慮できていない。
また、本サービスで企画したルームは全て一般公開されてしまう。特定の組織のみに公開するといったオプションを実装することで、クローズドなオンライン発表イベントにも対応していきたい。

### 注力したこと（こだわり等）

- 既存のオンライン発表における煩わしさを徹底的に排除した
- 想定されるシナリオを網羅した質の高いテスト

## 開発技術

### 活用した技術

#### フロントエンド

- TypeScript
- Next.js
- SkyWay
- ChakraUI

#### バックエンド

- Java OpenJDK 11
- Spring boot
- MySQL 8.0

#### インフラ

- ConoHa VPS
- Google Cloud Storage

#### CI/CD

- Jenkins
- GitHub Actions

### ハッカソンで開発した独自機能・技術

- SkyWay Peer 認証サーバ
- ユーザ・ルーム情報を管理する API（[Swagger UI](https://api.abelab.dev/jphacks/swagger-ui/)）
- Skywayでの複数画面共有
- フロント間でのタイマーやタイムテーブル等の同期
