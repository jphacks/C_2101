# LT Space

![build](https://github.com/jphacks/C_2101/workflows/build/badge.svg)
![test](https://github.com/jphacks/C_2101/workflows/test/badge.svg)
![lint](https://github.com/jphacks/C_2101/workflows/lint/badge.svg)
![deploy](https://github.com/jphacks/C_2101/workflows/deploy/badge.svg)
![prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
![version 1.0](https://img.shields.io/badge/version-1.0-yellow.svg)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

[![IMAGE ALT TEXT HERE](https://jphacks.com/wp-content/uploads/2021/07/JPHACKS2021_ogp.jpg)](https://www.youtube.com/watch?v=LUPQFB4QyVo)

## 製品概要

### 背景(製品開発のきっかけ、課題等）

コロナ禍になってから、LT 会などのオンライン発表をする機会が増えた。
しかし、オンライン発表では持ち時間やリアクションを確認しづらいだけでなく、タイムテーブルの共有も曖昧で、逐一オーナーがアナウンスするなどの煩わしさがある。

そこで、オンライン発表会の企画から開催までをシームレスに行える、クラウドベースなビデオチャットプラットフォームを開発した。

### 製品説明（具体的な製品の説明）

本サービスはルームという単位でイベントを開催することができる。
企画者は新規ルームを作成でき、登壇者と視聴者を募集する。開催日にはルームへの入室が許可され、Zoom ライクな UI で発表を始める。

事前に定められたタイムテーブル通りに進行され、制限時間を超過する場合にはオーナーの許可が必要である。
視聴者はチャットやスタンプ機能を使って反応を伝えることができ、既存のサービスと比べてオンライン発表に特化したプラットフォームを提供する。

### 特長

#### 1. 特長 1

#### 2. 企画から開催までをシームレスに行える

LT Space はルームの作成、参加登録について compass ライクなサービスを提供する。
ルームオーナーは事前に発表テーマ、開催日時、持ち時間などを設定し、興味を引いたユーザは参加登録をすることができる。

開催時は事前に設定したプロパティ通りに進行されるため、オーナーの手間を省けるだけでなく、視聴者にとっても当日の流れを把握しやすくなる。

#### 3. 発表者の体験を向上する

既存のビデオチャットプラットフォームはオンライン発表以外も想定しているため、持ち時間やタイムテーブルを表示する機能を設けていない。
本サービスはオンライン発表に特化し、これらの課題を解決した。

### 解決出来ること

### 今後の展望

### 注力したこと（こだわり等）

- 既存のオンライン発表における煩わしさを徹底的に排除した
- 想定されるシナリオを網羅した質の高いテスト

## 開発技術

### 活用した技術

#### フロントエンド

- TypeScript
- Next.js

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
