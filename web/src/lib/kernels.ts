import type { Kernel } from "@/components/kernels/types";
import { atom } from "nanostores";

export const $kernels = atom<Record<string, Kernel>>({});

export function addKernel(fileId: number, kernel: Kernel) {
    $kernels.set({
        ...$kernels.get(),
        [fileId]: kernel
    });
}

export function deleteKernel(fileId: number) {
  const kernels = { ...$kernels.get() };
  delete kernels[fileId];
  $kernels.set(kernels);
}
