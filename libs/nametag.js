import { CanvasTexture, NearestFilter, Sprite, SpriteMaterial } from "three";
export class NameTagObject extends Sprite {
    constructor(text = "", options = {}) {
        const material = new SpriteMaterial({
            transparent: true,
            alphaTest: 1e-5,
        });
        super(material);
        Object.defineProperty(this, "painted", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "text", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "font", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "margin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "textStyle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dividerStyle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "backgroundStyle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "height", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "textMaterial", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isPremiumRank", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "isBold", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "divider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.textMaterial = material;
        this.isPremiumRank = options.isPremiumRank === undefined ? false : options.isPremiumRank;
        this.isBold = options.isBold === undefined ? false : options.isBold;
        this.text = options.isPremiumRank ? `${options.rank} | ${text}` : text;
        this.font = options.font === undefined ? "20px Mojangles" : options.font;
        this.margin = options.margin === undefined ? [5, 2, 5, 2] : options.margin;
        this.textStyle = options.textStyle === undefined ? "white" : options.textStyle;
        this.dividerStyle = options.dividerStyle === undefined ? "#555555" : options.dividerStyle;
        this.backgroundStyle = options.backgroundStyle === undefined ? "rgba(0,0,0,.15)" : options.backgroundStyle;
        this.height = options.height === undefined ? 4.0 : options.height;
        this.divider = " | ";
        const repaintAfterLoaded = options.repaintAfterLoaded === undefined ? true : options.repaintAfterLoaded;
        if (repaintAfterLoaded && !document.fonts.check(this.font, this.text)) {
            this.paint();
            this.painted = this.loadAndPaint();
        }
        else {
            this.paint();
            this.painted = Promise.resolve();
        }
    }
    async loadAndPaint() {
        await document.fonts.load(this.font, this.text);
        this.paint();
    }
    paint() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        // Set the font style for the rank if isBold is true
        const rankFont = this.isBold ? `bold ${this.font}` : this.font;
        const textFont = this.font;
        ctx.font = rankFont;
        const beforeMetrics = ctx.measureText(this.isPremiumRank ? this.text.split(this.divider)[0] : this.text);
        const afterMetrics = this.isPremiumRank ? ctx.measureText(this.text.split(this.divider)[1]) : undefined;
        const dividerMetrics = this.isPremiumRank ? ctx.measureText(this.divider) : undefined;
        canvas.width =
            this.margin[3] +
                beforeMetrics.width +
                (this.isPremiumRank ? this.margin[1] + dividerMetrics.width + this.margin[1] : 0) +
                (this.isPremiumRank ? afterMetrics.width : 0) +
                this.margin[1];
        canvas.height =
            this.margin[0] + beforeMetrics.actualBoundingBoxAscent + beforeMetrics.actualBoundingBoxDescent + this.margin[2];
        // Draw background
        ctx.fillStyle = this.backgroundStyle;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw the rank text (if applicable) with the bold font
        if (this.isPremiumRank) {
            ctx.font = rankFont;
            ctx.fillStyle = this.textStyle;
            ctx.fillText(this.text.split(this.divider)[0], this.margin[3], this.margin[0] + beforeMetrics.actualBoundingBoxAscent);
            const dividerXPos = this.margin[3] + beforeMetrics.width + this.margin[1];
            // Draw the divider
            ctx.fillStyle = this.dividerStyle;
            ctx.fillText(this.divider, dividerXPos, this.margin[0] + dividerMetrics.actualBoundingBoxAscent);
            // Draw the remaining text with the regular font
            ctx.font = textFont;
            ctx.fillStyle = this.textStyle;
            ctx.fillText(this.text.split(this.divider)[1], dividerXPos + dividerMetrics.width + this.margin[1], this.margin[0] + afterMetrics.actualBoundingBoxAscent);
        }
        else {
            // Draw the regular text if no premium rank is set
            ctx.font = textFont;
            ctx.fillStyle = this.textStyle;
            ctx.fillText(this.text, this.margin[3], this.margin[0] + beforeMetrics.actualBoundingBoxAscent);
        }
        const texture = new CanvasTexture(canvas);
        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;
        this.textMaterial.map = texture;
        this.textMaterial.needsUpdate = true;
        this.scale.x = (canvas.width / canvas.height) * this.height;
        this.scale.y = this.height;
    }
}
//# sourceMappingURL=nametag.js.map