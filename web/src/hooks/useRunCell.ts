// import { runCell } from "@/components/kernels";

// export const useRunCell = (fileId: string) => {
//     return async (code: string) => {
//         return await runCell(Number(fileId), code);
//     };
// }


export const useRunCell = () => {
    return async (code: string) => {
        return await window.kernel.run(code);
    }
}