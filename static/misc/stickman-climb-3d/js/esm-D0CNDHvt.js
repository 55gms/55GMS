import { S as Script, C as CameraFrame$1, a as Color } from './index.mjs';

// Camera Frame v 1.1
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
/**
 * @import { Asset } from 'playcanvas';
 */ /** @enum {number} */ const ToneMapping = {
    LINEAR: 0,
    FILMIC: 1,
    HEJL: 2,
    ACES: 3,
    ACES2: 4,
    NEUTRAL: 5 // TONEMAP_NEUTRAL
};
/** @enum {string} */ const SsaoType = {
    NONE: 'none',
    LIGHTING: 'lighting',
    COMBINE: 'combine' // SSAOTYPE_COMBINE
};
/** @enum {number} */ const RenderFormat = {
    RGBA8: 7,
    RG11B10: 18,
    RGBA16: 12,
    RGBA32: 14 // PIXELFORMAT_RGBA32F
};
/** @enum {string} */ const DebugType = {
    NONE: 'none',
    SCENE: 'scene',
    SSAO: 'ssao',
    BLOOM: 'bloom',
    VIGNETTE: 'vignette',
    DOFCOC: 'dofcoc',
    DOFBLUR: 'dofblur'
};
/** @interface */ class Rendering {
    constructor(){
        /**
     * @attribute
     * @type {RenderFormat}
     */ _define_property(this, "renderFormat", RenderFormat.RG11B10);
        /**
     * @attribute
     * @type {RenderFormat}
     */ _define_property(this, "renderFormatFallback0", RenderFormat.RGBA16);
        /**
     * @attribute
     * @type {RenderFormat}
     */ _define_property(this, "renderFormatFallback1", RenderFormat.RGBA32);
        _define_property(this, "stencil", false);
        /**
     * @attribute
     * @range [0.1, 1]
     * @precision 2
     * @step 0.01
     */ _define_property(this, "renderTargetScale", 1.0);
        /**
     * @attribute
     * @range [1, 4]
     * @precision 0
     * @step 1
     */ _define_property(this, "samples", 1);
        _define_property(this, "sceneColorMap", false);
        _define_property(this, "sceneDepthMap", false);
        /**
     * @attribute
     * @type {ToneMapping}
     */ _define_property(this, "toneMapping", ToneMapping.LINEAR);
        /**
     * @range [0, 1]
     * @precision 3
     * @step 0.001
     */ _define_property(this, "sharpness", 0.0);
        /**
     * @attribute
     * @type {DebugType}
     */ _define_property(this, "debug", DebugType.NONE);
    }
}
/** @interface */ class Ssao {
    constructor(){
        /**
     * @attribute
     * @type {SsaoType}
     */ _define_property(this, "type", SsaoType.NONE);
        /**
     * @visibleif {type !== 'none'}
     */ _define_property(this, "blurEnabled", true);
        /**
     * @range [0, 1]
     * @visibleif {type !== 'none'}
     * @precision 3
     * @step 0.001
     */ _define_property(this, "intensity", 0.5);
        /**
     * @range [0, 100]
     * @visibleif {type !== 'none'}
     * @precision 3
     * @step 0.001
     */ _define_property(this, "radius", 30);
        /**
     * @range [1, 64]
     * @visibleif {type !== 'none'}
     * @precision 0
     * @step 1
     */ _define_property(this, "samples", 12);
        /**
     * @range [0.1, 10]
     * @visibleif {type !== 'none'}
     * @precision 3
     * @step 0.001
     */ _define_property(this, "power", 6);
        /**
     * @range [1, 90]
     * @visibleif {type !== 'none'}
     * @precision 1
     * @step 1
     */ _define_property(this, "minAngle", 10);
        /**
     * @range [0.5, 1]
     * @visibleif {type !== 'none'}
     * @precision 3
     * @step 0.001
     */ _define_property(this, "scale", 1);
    }
}
/** @interface */ class Bloom {
    constructor(){
        _define_property(this, "enabled", false);
        /**
     * @visibleif {enabled}
     * @range [0, 0.1]
     * @precision 3
     * @step 0.001
     */ _define_property(this, "intensity", 0.01);
        /**
     * @attribute
     * @visibleif {enabled}
     * @range [0, 16]
     * @precision 0
     * @step 0
     */ _define_property(this, "blurLevel", 16);
    }
}
/** @interface */ class Grading {
    constructor(){
        _define_property(this, "enabled", false);
        /**
     * @visibleif {enabled}
     * @range [0, 3]
     * @precision 3
     * @step 0.001
     */ _define_property(this, "brightness", 1);
        /**
     * @visibleif {enabled}
     * @range [0.5, 1.5]
     * @precision 3
     * @step 0.001
     */ _define_property(this, "contrast", 1);
        /**
     * @visibleif {enabled}
     * @range [0, 2]
     * @precision 3
     * @step 0.001
     */ _define_property(this, "saturation", 1);
        /**
     * @attribute
     * @visibleif {enabled}
     */ _define_property(this, "tint", new Color(1, 1, 1, 1));
    }
}
/** @interface */ class ColorLUT {
    constructor(){
        /**
     * @attribute
     * @type {Asset}
     * @resource texture
     */ _define_property(this, "texture", null);
        /**
     * @visibleif {texture}
     * @range [0, 1]
     * @precision 3
     * @step 0.001
     */ _define_property(this, "intensity", 1);
    }
}
/** @interface */ class Vignette {
    constructor(){
        _define_property(this, "enabled", false);
        /**
     * @visibleif {enabled}
     * @range [0, 1]
     * @precision 3
     * @step 0.001
     */ _define_property(this, "intensity", 0.5);
        /**
     * @visibleif {enabled}
     * @range [0, 3]
     * @precision 3
     * @step 0.001
     */ _define_property(this, "inner", 0.5);
        /**
     * @visibleif {enabled}
     * @range [0, 3]
     * @precision 3
     * @step 0.001
     */ _define_property(this, "outer", 1);
        /**
     * @visibleif {enabled}
     * @range [0.01, 10]
     * @precision 3
     * @step 0.001
     */ _define_property(this, "curvature", 0.5);
    }
}
/** @interface */ class Fringing {
    constructor(){
        _define_property(this, "enabled", false);
        /**
     * @visibleif {enabled}
     * @range [0, 100]
     * @precision 1
     * @step 0.1
     */ _define_property(this, "intensity", 50);
    }
}
/** @interface */ class Taa {
    constructor(){
        _define_property(this, "enabled", false);
        /**
     * @visibleif {enabled}
     * @range [0, 1]
     * @precision 2
     * @step 0.1
     */ _define_property(this, "jitter", 1);
    }
}
/** @interface */ class Dof {
    constructor(){
        _define_property(this, "enabled", false);
        /**
     * @visibleif {enabled}
     */ _define_property(this, "highQuality", true);
        /**
     * @visibleif {enabled}
     */ _define_property(this, "nearBlur", false);
        /**
     * @visibleif {enabled}
     * @precision 2
     * @step 1
     */ _define_property(this, "focusDistance", 100);
        /**
     * @visibleif {enabled}
     * @precision 2
     * @step 1
     */ _define_property(this, "focusRange", 10);
        /**
     * @visibleif {enabled}
     * @precision 2
     * @step 0.1
     */ _define_property(this, "blurRadius", 3);
        /**
     * @visibleif {enabled}
     * @range [1, 10]
     * @precision 0
     * @step 1
     */ _define_property(this, "blurRings", 4);
        /**
     * @visibleif {enabled}
     * @range [1, 10]
     * @precision 0
     * @step 1
     */ _define_property(this, "blurRingPoints", 5);
    }
}
class CameraFrame extends Script {
    initialize() {
        this.engineCameraFrame = new CameraFrame$1(this.app, this.entity.camera);
        this.on('enable', ()=>{
            this.engineCameraFrame.enabled = true;
        });
        this.on('disable', ()=>{
            this.engineCameraFrame.enabled = false;
        });
        this.on('destroy', ()=>{
            this.engineCameraFrame.destroy();
        });
        this.on('state', (enabled)=>{
            this.engineCameraFrame.enabled = enabled;
        });
    }
    postUpdate(dt) {
        const cf = this.engineCameraFrame;
        const { rendering, bloom, grading, vignette, fringing, taa, ssao, dof, colorLUT } = this;
        const dstRendering = cf.rendering;
        dstRendering.renderFormats.length = 0;
        dstRendering.renderFormats.push(rendering.renderFormat);
        dstRendering.renderFormats.push(rendering.renderFormatFallback0);
        dstRendering.renderFormats.push(rendering.renderFormatFallback1);
        dstRendering.stencil = rendering.stencil;
        dstRendering.renderTargetScale = rendering.renderTargetScale;
        dstRendering.samples = rendering.samples;
        dstRendering.sceneColorMap = rendering.sceneColorMap;
        dstRendering.sceneDepthMap = rendering.sceneDepthMap;
        dstRendering.toneMapping = rendering.toneMapping;
        dstRendering.sharpness = rendering.sharpness;
        // ssao
        const dstSsao = cf.ssao;
        dstSsao.type = ssao.type;
        if (ssao.type !== SsaoType.NONE) {
            dstSsao.intensity = ssao.intensity;
            dstSsao.radius = ssao.radius;
            dstSsao.samples = ssao.samples;
            dstSsao.power = ssao.power;
            dstSsao.minAngle = ssao.minAngle;
            dstSsao.scale = ssao.scale;
        }
        // bloom
        const dstBloom = cf.bloom;
        dstBloom.intensity = bloom.enabled ? bloom.intensity : 0;
        if (bloom.enabled) {
            dstBloom.blurLevel = bloom.blurLevel;
        }
        // grading
        const dstGrading = cf.grading;
        dstGrading.enabled = grading.enabled;
        if (grading.enabled) {
            dstGrading.brightness = grading.brightness;
            dstGrading.contrast = grading.contrast;
            dstGrading.saturation = grading.saturation;
            dstGrading.tint.copy(grading.tint);
        }
        // colorLUT
        const dstColorLUT = cf.colorLUT;
        if (colorLUT.texture?.resource) {
            dstColorLUT.texture = colorLUT.texture.resource;
            dstColorLUT.intensity = colorLUT.intensity;
        } else {
            dstColorLUT.texture = null;
        }
        // vignette
        const dstVignette = cf.vignette;
        dstVignette.intensity = vignette.enabled ? vignette.intensity : 0;
        if (vignette.enabled) {
            dstVignette.inner = vignette.inner;
            dstVignette.outer = vignette.outer;
            dstVignette.curvature = vignette.curvature;
        }
        // taa
        const dstTaa = cf.taa;
        dstTaa.enabled = taa.enabled;
        if (taa.enabled) {
            dstTaa.jitter = taa.jitter;
        }
        // fringing
        const dstFringing = cf.fringing;
        dstFringing.intensity = fringing.enabled ? fringing.intensity : 0;
        // dof
        const dstDof = cf.dof;
        dstDof.enabled = dof.enabled;
        if (dof.enabled) {
            dstDof.highQuality = dof.highQuality;
            dstDof.nearBlur = dof.nearBlur;
            dstDof.focusDistance = dof.focusDistance;
            dstDof.focusRange = dof.focusRange;
            dstDof.blurRadius = dof.blurRadius;
            dstDof.blurRings = dof.blurRings;
            dstDof.blurRingPoints = dof.blurRingPoints;
        }
        // debugging
        cf.debug = rendering.debug;
        cf.update();
    }
    constructor(...args){
        super(...args);
        /**
     * @attribute
     * @type {Rendering}
     */ _define_property(this, "rendering", new Rendering());
        /**
     * @attribute
     * @type {Ssao}
     */ _define_property(this, "ssao", new Ssao());
        /**
     * @attribute
     * @type {Bloom}
     */ _define_property(this, "bloom", new Bloom());
        /**
     * @attribute
     * @type {Grading}
     */ _define_property(this, "grading", new Grading());
        /**
     * @attribute
     * @type {ColorLUT}
     */ _define_property(this, "colorLUT", new ColorLUT());
        /**
     * @attribute
     * @type {Vignette}
     */ _define_property(this, "vignette", new Vignette());
        /**
     * @attribute
     * @type {Taa}
     */ _define_property(this, "taa", new Taa());
        /**
     * @attribute
     * @type {Fringing}
     */ _define_property(this, "fringing", new Fringing());
        /**
     * @attribute
     * @type {Dof}
     */ _define_property(this, "dof", new Dof());
        _define_property(this, "engineCameraFrame", void 0);
    }
}
_define_property(CameraFrame, "scriptName", 'cameraFrame');

export { CameraFrame };
