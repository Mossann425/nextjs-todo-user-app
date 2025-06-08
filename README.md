# Next.js + Supabase Todoアプリケーション (旧バージョン)

このプロジェクトは、Next.js と Supabase を使用したシンプルなTodoアプリケーションです。

## 必要要件

-   **Node.js**: 18.x 以上
-   **Supabaseアカウント**: データベースと認証機能を使用するために必要です。

## セットアップ手順

1.  **リポジトリのクローン**
    ```bash
    git clone [リポジトリのURL] next-user-todo-app-old
    cd next-user-todo-app-old
    ```
2.  **依存関係のインストール**
    ```bash
    npm install
    # または
    yarn install
    ```
3.  **環境変数の設定**
    プロジェクトルートに `.env.local` ファイルを作成し、以下の内容を設定してください。Supabaseプロジェクトの設定ページからこれらの値を取得できます。
    ```
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    NEXT_PUBLIC_SITE_URL=http://localhost:3000 # 開発環境の場合
    ```
4.  **Supabaseのデータベース設定**
    Supabaseダッシュボードで以下のテーブルとRLS (Row Level Security) ポリシーを作成してください。
    ```sql
    create table todos (
      id uuid default uuid_generate_v4() primary key,
      user_id uuid references auth.users(id),
      title text not null,
      completed boolean default false,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null
    );

    -- RLSポリシーの設定
    alter table todos enable row level security;

    create policy "ユーザーは自分のtodosのみ参照可能" on todos
      for select using (auth.uid() = user_id);

    create policy "ユーザーは自分のtodosのみ作成可能" on todos
      for insert with check (auth.uid() = user_id);

    create policy "ユーザーは自分のtodosのみ更新可能" on todos
      for update using (auth.uid() = user_id);

    create policy "ユーザーは自分のtodosのみ削除可能" on todos
      for delete using (auth.uid() = user_id);
    ```
5.  **開発サーバーの起動**
    ```bash
    npm run dev
    # または
    yarn dev
    ```
    アプリケーションは通常 `http://localhost:3000` で利用できます。

## 使い方

1.  **アカウント作成/ログイン**:
    *   アプリケーションの最初の画面（またはログアウト後の画面）で、メールアドレスとパスワードを使用して新しいアカウントを登録するか、既存のアカウントでログインします。
2.  **タスク管理**:
    *   ログイン後、Todoリストが表示されます。
    *   「新しいタスクを入力...」フィールドにタスクを入力し、「+」ボタンまたはEnterキーでタスクを追加します。
    *   タスクの横にあるチェックボックスをクリックして、完了/未完了を切り替えます。
    *   ゴミ箱アイコンをクリックして、タスクを削除します。
3.  **ログアウト**:
    *   Todoリスト画面の右上にある「ログアウト」ボタンをクリックすると、セッションが終了し、ログイン画面に戻ります。

## `utils` ディレクトリの使い方

`utils` ディレクトリには、Supabaseクライアントの初期化を行うユーティリティ関数が含まれています。これにより、アプリケーションの様々な場所でSupabaseとのやり取りを簡単に行うことができます。

-   `utils/supabase/client.ts`:
    *   クライアントコンポーネント（ブラウザで動作するReactコンポーネント）からSupabaseクライアントを作成するために使用します。
    *   例: `import { createClient } from '@/utils/supabase/client'; const supabase = createClient();`
-   `utils/supabase/server.ts`:
    *   サーバーコンポーネントまたはサーバーアクション（Next.jsのサーバーサイドで実行されるコード）からSupabaseクライアントを作成するために使用します。
    *   サーバーサイドの環境で安全にSupabaseにアクセスするために、Next.jsの`cookies`ヘッダーを使用します。
    *   例: `import { createClient } from '@/utils/supabase/server'; const supabase = await createClient();`

## ディレクトリ構成

プロジェクトの主なディレクトリとファイルは以下のようになっています。
├── app/ # Next.jsのApp Routerによるルーティングとページ
│ ├── (auth)/ # 認証関連のルートグループ
│ │ └── signin/
│ │ └── page.tsx
│ ├── components/ # 共有コンポーネント
│ │ ├── Auth.tsx # 認証フォーム
│ │ └── TodoList.tsx # Todoリスト表示
│ ├── auth/
│ │ └── signout/
│ │ └── route.ts # ログアウト処理のAPIルート
│ ├── globals.css # グローバルスタイル
│ ├── layout.tsx # 全ページ共通のレイアウト
│ └── page.tsx # トップページ（ログイン/Todoリストの表示制御）
├── public/ # 静的ファイル
├── utils/ # ユーティリティ関数
│ └── supabase/ # Supabaseクライアントの初期化関数
│ ├── client.ts # クライアントサイド用Supabaseクライアント
│ └── server.ts # サーバーサイド用Supabaseクライアント
├── package.json # プロジェクトのメタデータと依存関係
├── postcss.config.js # PostCSSの設定
├── tailwind.config.js # Tailwind CSSの設定
├── tsconfig.json # TypeScriptの設定
└── README.md # このファイル
