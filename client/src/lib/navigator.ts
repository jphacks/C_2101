/**
 * ビルド時のSSGとかでnavigatorはundefinedになり得るので
 */
export const getNavigator = (): Navigator | undefined => {
  if (typeof navigator !== "undefined") {
    return navigator;
  } else {
    return undefined;
  }
};
