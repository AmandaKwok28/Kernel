import { runCell } from "@/components/kernels";

export const useRunCell = (fileId: string) => {
    return async (code: string) => {
        return await runCell(fileId, code);
    };
}