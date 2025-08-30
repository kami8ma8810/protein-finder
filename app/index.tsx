import { Redirect } from 'expo-router';

export default function Index() {
  // ルートにアクセスしたら検索画面（タブ）にリダイレクト
  return <Redirect href="/(tabs)/search" />;
}
