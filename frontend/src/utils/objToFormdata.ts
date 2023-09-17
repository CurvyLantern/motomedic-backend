/* eslint-disable @typescript-eslint/no-explicit-any */
export default function objToFormdata(fd: FormData, obj: Record<string, any>) {
  Object.entries(obj).forEach(([k, v]) => {
    if (v) {
      fd.append(k, v);
    }
  });
}
