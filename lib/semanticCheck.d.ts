declare type TChart = ISection[];
interface ISection {
    title: string;
    content: IItem[];
}
interface IItem {
    key: string;
    value: IAtom[];
}
interface IAtom {
    type: "number" | "string" | "id";
    value: string | number;
}
export default function semanticCheck([chart]: [TChart], location: number, reject: Object): Object;
export {};
