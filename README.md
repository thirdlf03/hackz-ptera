# hackz-ptera

## 技術スタック

- モノレポ管理: pnpm v10.26.0 + Turborepo v2.6.3
- 言語: TypeScript v5.9.3
- フロントエンド: React 19.2.0 + Vite + TanStack React Query
- API: Cloudflare Workers + Hono v4.11.1
- バリデーション: Zod v4.2.1
- コード品質: oxlint + oxfmt

## プロジェクトの特徴

このプロジェクトは Hono RPC パターンを使用することで、以下の利点があります。

- **コード生成不要** - tRPC のようなコード生成ステップなしで型安全性を実現
- **シンプルな設定** - 複雑なビルド設定やプラグインが不要
- **自動補完** - IDE での完全な型サポートとコード補完
- **ランタイムバリデーション** - Zod による実行時の型チェック
- **モノレポ最適化** - Turborepo によるインクリメンタルビルドとキャッシング

## ファイル構成

```
hackz-ptera/
├── apps/
│   ├── frontend/          # React フロントエンドアプリケーション
│   │   ├── src/
│   │   │   ├── features/         # 機能ベースのディレクトリ構成
│   │   │   │   └── users/       # ユーザー管理機能
│   │   │   │       ├── components/
│   │   │   │       │   └── UserExample.tsx
│   │   │   │       ├── hooks/
│   │   │   │       │   └── useUsers.ts
│   │   │   │       ├── api/
│   │   │   │       │   └── users.ts
│   │   │   │       └── index.ts  # エクスポート用
│   │   │   ├── lib/             # 共通ユーティリティ
│   │   │   │   ├── api-client.ts
│   │   │   │   ├── query-client.ts
│   │   │   │   └── errors.ts
│   │   │   ├── assets/          # 静的アセット
│   │   │   ├── App.tsx          # メインアプリコンポーネント
│   │   │   ├── main.tsx         # エントリーポイント
│   │   │   └── client.ts        # Hono RPC クライアント設定
│   │   ├── vite.config.ts       # Vite 設定 (API プロキシ、パスエイリアス)
│   │   ├── tsconfig.app.json    # アプリ用 TS 設定 (パスエイリアス含む)
│   │   └── package.json
│   │
│   └── api/               # Cloudflare Workers API
│       ├── src/
│       │   └── index.ts   # Hono アプリとルート定義
│       ├── wrangler.jsonc # Cloudflare Workers 設定
│       └── package.json
│
├── packages/
│   └── schema/            # 共有 Zod スキーマ
│       ├── src/
│       │   └── index.ts   # スキーマと型のエクスポート
│       └── package.json
│
├── package.json           # ルートワークスペース設定
├── pnpm-workspace.yaml    # pnpm ワークスペース定義
├── turbo.json             # Turborepo 設定
├── oxlint.json            # リンター設定
└── oxfmtrc.json           # フォーマッター設定
```

### 主要ファイル

- `apps/api/src/index.ts` - Hono アプリのルート定義、`AppType` エクスポート
- `apps/frontend/src/client.ts` - 型安全な Hono RPC クライアント
- `apps/frontend/src/features/users/` - ユーザー管理機能（feature-based 構成の例）
- `packages/schema/src/index.ts` - フロントエンドと API で共有する Zod スキーマ

### フロントエンドのアーキテクチャ

#### Feature-Based 構成

フロントエンドは **Feature-Based（機能ベース）** のディレクトリ構成を採用しています。各機能は独立したディレクトリにまとめられており、関連するコンポーネント、フック、API 関数が同じ場所に配置されています。

```
features/
└── users/                # 機能ごとのディレクトリ
    ├── components/       # その機能専用のコンポーネント
    ├── hooks/            # その機能専用のフック
    ├── api/              # その機能の API 呼び出し
    └── index.ts          # 公開する要素のエクスポート
```

**メリット:**
- 機能ごとにコードが整理されており、理解しやすい
- 新機能の追加が容易（新しいディレクトリを追加するだけ）
- 各機能が独立しているため、テストやメンテナンスがしやすい
- チーム開発時に担当機能ごとに作業を分担できる

#### パスエイリアス

TypeScript と Vite で `@` プレフィックスを使ったパスエイリアスを設定しています。これにより、相対パスではなく絶対パスでインポートできます。

```typescript
// 相対パスの代わりに
import { UserExample } from '../../../features/users';

// @ プレフィックスを使用
import { UserExample } from '@/features/users';
```

**設定場所:**
- `tsconfig.app.json`: TypeScript のパスマッピング設定
- `vite.config.ts`: Vite のエイリアス設定

## クイックスタート

### 必要な環境

- Node.js v18 以上
- pnpm v10.26.0 以上

### セットアップ手順

1. **リポジトリのクローン**
   ```bash
   git clone <repository-url>
   cd hackz-ptera
   ```

2. **依存関係のインストール**
   ```bash
   pnpm install
   ```

3. **初回ビルド（初回起動時のみ必要）**
   ```bash
   # @repo/schema パッケージを事前にビルド
   pnpm --filter @repo/schema build
   ```

   > **注意**: 初回起動時は必ず`@repo/schema`のビルドが必要です。APIサーバーがこのパッケージのビルド成果物に依存しているためです。

4. **開発サーバーの起動**
   ```bash
   # すべての開発サーバーを並行起動（フロントエンド + API）
   pnpm dev
   ```

   または個別に起動:
   ```bash
   # フロントエンド（http://localhost:5173）
   pnpm --filter frontend dev

   # API（http://localhost:8787）
   pnpm --filter api dev

   # スキーマ（watch モード）
   pnpm --filter @repo/schema dev
   ```

5. **ブラウザでアクセス**
   - フロントエンド: http://localhost:5173
   - API は Vite のプロキシ経由で `/api` にアクセス可能

## 重要：Hono RPC を使う際の注意点

このプロジェクトでは、バックエンドAPIとの通信にHonoのRPC機能を使用しています。**型安全性を維持するため、以下の点に必ず注意してください。**

### 1. APIルートは必ずメソッドチェイン形式で定義する

バックエンド（`apps/api/src/index.ts`）でルートを定義する際は、必ず**メソッドチェイン形式**で記述してください。個別に定義すると型推論が失われます。

```typescript
// 推奨: メソッドチェイン形式
const app = new Hono()
  .get("/users", (c) => { ... })
  .post("/users", (c) => { ... });

// 非推奨: 個別定義形式
const app = new Hono();
app.get("/users", (c) => { ... });
app.post("/users", (c) => { ... });
```

### 2. POSTリクエストは `json` パラメータを使用する

Honoクライアントでは、`body`パラメータではなく`json`パラメータを使用します。

```typescript
// 推奨:
const response = await client.users.$post({ json: userData });

// 非推奨:
const response = await client.users.$post({ body: userData });
```

### 3. TypeScript設定

`@repo/api`へのパスマッピングが`tsconfig.app.json`に設定されており、型安全なAPI呼び出しが可能です。

## 開発コマンド

### ビルド

```bash
# すべてのパッケージをビルド
pnpm build

# 特定のパッケージをビルド
pnpm --filter frontend build
pnpm --filter api build
pnpm --filter @repo/schema build
```

### テスト

```bash
# すべてのテストを実行
pnpm test

# Watch モードでテストを実行（開発時）
pnpm test:watch

# カバレッジレポートを生成
pnpm test:coverage

# 特定のパッケージのテストを実行
pnpm --filter frontend test
pnpm --filter @repo/api test
pnpm --filter @repo/schema test
```

### コード品質チェック

```bash
# リント
pnpm lint

# フォーマット（書き込みモード）
pnpm format

# フォーマットチェック（書き込みなし）
pnpm format:check

# 型チェック
pnpm check-types
```

### パッケージ管理

```bash
# 特定のパッケージに依存関係を追加
pnpm --filter frontend add <package-name>
pnpm --filter api add <package-name>
pnpm --filter @repo/schema add <package-name>

# 開発用依存関係を追加
pnpm --filter frontend add -D <package-name>
```

## 開発ガイド

### 型安全性の維持

#### スキーマの変更

- `packages/schema` でスキーマを変更した場合、自動的にフロントエンドと API の両方に反映されます
- スキーマ変更後は `pnpm dev` で watch モードが自動的にビルドを実行します

#### API ルートの追加・変更

- `apps/api/src/index.ts` でルートを変更すると、`AppType` が更新されます
- フロントエンドの RPC クライアントは自動的に新しい型を取得します
- コード補完とエラーチェックが自動で機能します

#### 型の一貫性

- フロントエンドとバックエンド間で型の不一致がある場合、TypeScript コンパイラがエラーを出します
- ビルド前に必ず `pnpm check-types` で型チェックを実行してください

### コードスタイル

- コミット前に必ず `pnpm lint` と `pnpm format` を実行
- oxlint/oxfmt は Rust ベースの高速なツールで、大規模なコードベースでも素早くチェックできます
- TypeScript の strict モードが有効です（`noUnusedLocals`, `noUnusedParameters` を含む）

### 開発ワークフロー

#### 機能開発の流れ

```bash
# 1. 新しいブランチを作成
git checkout -b feature/your-feature

# 2. スキーマを定義（必要な場合）
# packages/schema/src/index.ts を編集

# 3. API エンドポイントを実装
# apps/api/src/index.ts にルートを追加

# 4. フロントエンドで API を利用
# apps/frontend/src 内で型安全な client を使用

# 5. コード品質チェック
pnpm lint
pnpm format
pnpm check-types

# 6. ビルド確認
pnpm build
```

#### Turborepo キャッシュ

- Turborepo はビルド結果をキャッシュするため、変更していないパッケージは再ビルドされません
- キャッシュをクリアする場合: `pnpm turbo clean`
- 強制的に再ビルド: `pnpm turbo run build --force`

### ベストプラクティス

- 新機能を追加する際は、まず `packages/schema` でデータ構造を定義する（スキーマファースト）
- Zod スキーマから `z.infer<>` で TypeScript 型を生成し、一貫性を保つ
- クライアント／サーバー両方で同じ Zod スキーマを使用してバリデーションを行う
- API レスポンスは常に具体的なステータスコード（200、400、404、500など）とエラーメッセージを返す
- React Query のキャッシュを活用し、不要な API リクエストを削減する

## トラブルシューティング

- 型エラーが解消されない場合は、`node_modules` と `.turbo` を削除して `pnpm install` を再実行
- ポート競合が発生した場合は、フロントエンドまたは API のポートが使用中でないか確認し、プロセスを終了するか設定ファイルでポートを変更
- Cloudflare Workers のデプロイエラーが発生した場合は、`wrangler.jsonc` の設定を確認し、Cloudflare アカウントの認証状態を確認

## CI/CD

GitHub Actionsによる継続的インテグレーションを設定しています。

### 自動実行されるチェック

PR作成・更新時およびmainブランチへのプッシュ時に以下が自動実行されます。

1. **フォーマットチェック** (`pnpm format:check`)
2. **リント** (`pnpm lint`)
3. **型チェック** (`pnpm check-types`)
4. **ビルド** (`pnpm build`)

### 手動実行

GitHub UIから「Actions」タブ → 「CI」ワークフロー → 「Run workflow」で手動実行も可能です。

### キャッシュ戦略

- pnpm: `node_modules` を自動キャッシュ
- Turborepo: `.turbo` ディレクトリをキャッシュし、変更されていないパッケージのビルドをスキップ
