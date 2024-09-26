import { WxtStorageItem } from "wxt/storage";

export const localDofollowEnabled = storage.defineItem<boolean>(
  "local:DofollowEnabled",
  {
    fallback: true,
  }
);

export const localNofollowEnabled = storage.defineItem<boolean>(
  "local:NofollowEnabled",
  {
    fallback: true,
  }
);

export const localIgnoredHostnames = storage.defineItem<string[]>(
  "local:IgnoredHostnames",
  {
    fallback: ["www.google.com"],
  }
);

export function useStorageValue<T>(
  item: WxtStorageItem<T, {}>,
  defaultValue: T
) {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    item.getValue().then(setValue);
    return item.watch(setValue);
  }, [item]);

  const set = (value: T) => item.setValue(value);

  return [value, set] as const;
}
