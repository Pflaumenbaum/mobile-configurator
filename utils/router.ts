import { Href, router } from "expo-router";

export function goBack(path?: Href) {
  const canGoBack = router.canGoBack();
  if (canGoBack) {
    router.back();
  } else {
    router.replace(path || "/");
  }
}
