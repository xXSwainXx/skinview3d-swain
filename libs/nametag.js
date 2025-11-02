import { CanvasTexture, LinearFilter, Sprite, SpriteMaterial } from "three";

export class NameTagObject extends Sprite {
    constructor(text = "", options = {}) {
        const material = new SpriteMaterial({
            transparent: true,
            alphaTest: 1e-5,
        });
        super(material);
        
        this.textMaterial = material;
        this.isPremiumRank = options.isPremiumRank === undefined ? false : options.isPremiumRank;
        this.isBold = options.isBold === undefined ? false : options.isBold;
        this.rankImage = options.rankImage || null;
        this.imageHeight = options.imageHeight || 20;
        this.divider = " ";
        this.text = options.isPremiumRank ? `${options.rank}${this.divider}${text}` : text;
        this.font = options.font === undefined ? "20px Mojangles" : options.font;
        this.margin = options.margin === undefined ? [5, 2, 5, 2] : options.margin;
        this.textStyle = options.textStyle === undefined ? "white" : options.textStyle;
        this.dividerStyle = options.dividerStyle === undefined ? "#555555" : options.dividerStyle;
        this.backgroundStyle = options.backgroundStyle === undefined ? "rgba(0,0,0,.15)" : options.backgroundStyle;
        this.height = options.height === undefined ? 4.0 : options.height;
        this.resolutionScale = options.resolutionScale || 2;

        const repaintAfterLoaded = options.repaintAfterLoaded === undefined ? true : options.repaintAfterLoaded;
        
        if (repaintAfterLoaded && !document.fonts.check(this.font, this.text)) {
            this.paint();
            this.painted = this.loadAndPaint();
        } else {
            this.paint();
            this.painted = Promise.resolve();
        }
    }

    async paint() {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const scale = this.resolutionScale;
        
        const rankFont = this.isBold ? `bold ${this.font}` : this.font;
        const textFont = this.font;
        
        ctx.font = rankFont;
        
        const beforeMetrics = ctx.measureText(this.isPremiumRank ? this.text.split(this.divider)[0] : this.text);
        const afterMetrics = this.isPremiumRank ? ctx.measureText(this.text.split(this.divider)[1]) : undefined;
        const dividerMetrics = this.isPremiumRank ? ctx.measureText(this.divider) : undefined;

        let imageWidth = 0;
        let imageHeight = 0;
        let imageLoaded = false;

        if (this.rankImage && this.isPremiumRank) {
            try {
                const img = await this.loadImage(this.rankImage);
                imageWidth = (img.width / img.height) * this.imageHeight;
                imageHeight = this.imageHeight;
                imageLoaded = true;
            } catch (error) {
                console.error("Failed to load rank image:", error);
                imageLoaded = false;
            }
        }

        const imageSectionWidth = imageLoaded ? 
            this.margin[3] + imageWidth + this.margin[1] : 
            this.margin[3] + beforeMetrics.width + this.margin[1];

        canvas.width = (imageSectionWidth +
            (this.isPremiumRank ? dividerMetrics.width + this.margin[1] : 0) +
            (this.isPremiumRank ? afterMetrics.width : 0) +
            this.margin[1]) * scale;

        canvas.height = (this.margin[0] + 
            Math.max(
                beforeMetrics.actualBoundingBoxAscent + beforeMetrics.actualBoundingBoxDescent,
                imageHeight
            ) + 
            this.margin[2]) * scale;

        ctx.scale(scale, scale);

        const scaledImageHeight = imageHeight * scale;
        const scaledImageWidth = imageWidth * scale;

        ctx.fillStyle = this.backgroundStyle;
        ctx.fillRect(0, 0, canvas.width / scale, canvas.height / scale);

        if (this.isPremiumRank) {
            if (imageLoaded && this.rankImage) {
                const img = await this.loadImage(this.rankImage);
                const yPos = this.margin[0] + (canvas.height/scale - this.margin[0] - this.margin[2] - imageHeight) / 2;
                ctx.drawImage(img, this.margin[3], yPos, imageWidth, imageHeight);
            } else {
                ctx.font = rankFont;
                ctx.fillStyle = this.textStyle;
                ctx.fillText(
                    this.text.split(this.divider)[0], 
                    this.margin[3], 
                    this.margin[0] + beforeMetrics.actualBoundingBoxAscent
                );
            }

            const dividerXPos = imageLoaded ? 
                this.margin[3] + imageWidth + this.margin[1] : 
                this.margin[3] + beforeMetrics.width + this.margin[1];

            ctx.fillStyle = this.dividerStyle;
            ctx.fillText(
                this.divider, 
                dividerXPos, 
                this.margin[0] + dividerMetrics.actualBoundingBoxAscent
            );

            ctx.font = textFont;
            ctx.fillStyle = this.textStyle;
            ctx.fillText(
                this.text.split(this.divider)[1], 
                dividerXPos + dividerMetrics.width + this.margin[1], 
                this.margin[0] + afterMetrics.actualBoundingBoxAscent
            );
        } else {
            ctx.font = textFont;
            ctx.fillStyle = this.textStyle;
            ctx.fillText(
                this.text, 
                this.margin[3], 
                this.margin[0] + beforeMetrics.actualBoundingBoxAscent
            );
        }

        const texture = new CanvasTexture(canvas);
        texture.magFilter = LinearFilter;
        texture.minFilter = LinearFilter;
        texture.generateMipmaps = true;
        
        this.textMaterial.map = texture;
        this.textMaterial.needsUpdate = true;
        
        this.scale.x = (canvas.width / canvas.height) * this.height / scale;
        this.scale.y = this.height / scale;
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            if (typeof src === 'string') {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            } else {
                resolve(src);
            }
        });
    }

    setRankImage(imageSrc) {
        this.rankImage = imageSrc;
        this.paint();
    }
}
