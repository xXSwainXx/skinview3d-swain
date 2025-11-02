import { Sprite } from "three";
export interface NameTagOptions {
    font?: string;
    repaintAfterLoaded?: boolean;
    margin?: [number, number, number, number];
    textStyle?: string | CanvasGradient | CanvasPattern;
    backgroundStyle?: string | CanvasGradient | CanvasPattern;
    height?: number;
    dividerStyle?: string | CanvasGradient | CanvasPattern;
    isPremiumRank?: boolean;
    rank?: string;
    isBold?: boolean;
}
export declare class NameTagObject extends Sprite {
    readonly painted: Promise<void>;
    private text;
    private font;
    private margin;
    private textStyle;
    private dividerStyle;
    private backgroundStyle;
    private height;
    private textMaterial;
    private isPremiumRank;
    private isBold;
    private divider;
    constructor(text?: string, options?: NameTagOptions);
    private loadAndPaint;
    private paint;
}
