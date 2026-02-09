import { persistentAtom } from "@nanostores/persistent";
import { atom } from "nanostores";

export const $theme = persistentAtom<"dark" | "light">(
  "theme",
  "dark"
);
export function setTheme(theme: "dark" | "light") {
    $theme.set(theme);
}

// text style
export const $fontSize = atom<string>("9px");
export const $titleSize = atom<string>("10px");
export const $fontFamily = atom<string>("monospace");

// set the themes based on light dark mode
$theme.subscribe((theme) => {
    const root = document.documentElement;
    if (theme === "dark") {
        root.style.setProperty("--bg-main", "#1d1d1d");             //  bg behind notes
        root.style.setProperty("--bg-header", "#494c4a");           //  header bg
        root.style.setProperty("--bg-sidebar", "#323532");          //  sidebar bg
        root.style.setProperty("--bg-open-sidebar", "#242424");
        root.style.setProperty("--icon-color", "#9CA3AF");          //  gray-400
        root.style.setProperty("--bg-hover-note", "#3b3e3c");
        root.style.setProperty("--bg-select-note", "#3b3e3c");
        root.style.setProperty("--note-icon-color", "#058ff9");
        root.style.setProperty("--font-color", "#9CA3AF");           
        root.style.setProperty("--bg-font-color", "#8c948f");       // font color of "no notes selected"
        root.style.setProperty("--file-plus-color", "#0b0b0b");              // file plus icon in bg
        root.style.setProperty("--bg-note-title", "#1d1d1d");
        root.style.setProperty("--note-title-color", "#dedddd");
        root.style.setProperty("--bg-note-icon", "#333433");
        root.style.setProperty("--hover-note-icon", "#ffffff");
        root.style.setProperty("--note-text-color", "#D1D5DB");
        root.style.setProperty("--code-highlight", "#2c2f2d");
        root.style.setProperty("--code-text-highlight", "#4ed4f9");
        root.style.setProperty("--number-highlight", "#68a7ef");
        root.style.setProperty("--dash-highlight", "#247afc");
        root.style.setProperty("--bg-code", "#151417");
        root.style.setProperty("--controls-select-color", "#ffffff");
        root.style.setProperty("--dirty-color", "#5fa2ee");
        root.style.setProperty("--caret-color", "#E5E7EB");
    } else {
        root.style.setProperty("--bg-main", "#ffffff");   
        root.style.setProperty("--bg-header", "#f4f0f0");      
        root.style.setProperty("--bg-sidebar", "#f4f0f0");
        root.style.setProperty("--border", "#d7d6d6");              //  header/sidebar border
        root.style.setProperty("--bg-open-sidebar", "#f4f0f0");
        root.style.setProperty("--icon-color", "#717070");
        root.style.setProperty("--bg-hover-note", "#75757510");
        root.style.setProperty("--bg-select-note", "#7575752f");
        root.style.setProperty("--note-icon-color", "#3e3e3e57");
        root.style.setProperty("--font-color", "#303131");   
        root.style.setProperty("--bg-font-color", "#b7bbb8");
        root.style.setProperty("--file-plus-color", "#e1dddd");
        root.style.setProperty("--bg-note-title", "#ffffff");
        root.style.setProperty("--note-title-color", "#232222");
        root.style.setProperty("--bg-note-icon", "#ffffff");
        root.style.setProperty("--hover-note-icon", "#f0b6e4");
        root.style.setProperty("--note-text-color", "#535353");
        root.style.setProperty("--code-highlight", "#fdedff");
        root.style.setProperty("--code-text-highlight", "#b760bd");
        root.style.setProperty("--number-highlight", "#d37fe6");
        root.style.setProperty("--dash-highlight", "#b969cb");
        root.style.setProperty("--bg-code", "#1e1e1e");
        root.style.setProperty("--controls-select-color", "#bb9df7");
        root.style.setProperty("--dirty-color", "#cc8ad3");
        root.style.setProperty("--caret-color", "#3c1c3b");
    };
})