() => {
  globalThis.ovoLevelEditor = {
    init() {
      let sdk_runtime = cr_getC2Runtime();
      if (!sdk_runtime) return;

      let setLayout = (name) => {
        if (sdk_runtime.layouts.hasOwnProperty(name)) {
          sdk_runtime.changelayout = sdk_runtime.layouts[name];
          return sdk_runtime.layouts[name];
        }
      };

      let baseLayoutName = "Level Base";
      let baseLayout = sdk_runtime.layouts[baseLayoutName];
      let oldFn = baseLayout.startRunning.bind(baseLayout);
      baseLayout.startRunning = () => {
        console.log("start");
        globalThis.ovoLevelEditor.applySetup();
        oldFn();
        globalThis.ovoLevelEditor.applyCurrentLevel();
      };

      let setLayoutToBase = () => {
        sdk_runtime.changelayout = baseLayout;
      };

      const types = {
        Solid: sdk_runtime.types_by_index.find(
          (x) =>
            x.name === "Solid" ||
            (x.plugin instanceof cr.plugins_.TiledBg &&
              x.texture_file &&
              x.texture_file.includes("/solid.png") &&
              x.behs_count === 2)
        ),
        SolidWhite: sdk_runtime.types_by_index.find(
          (x) =>
            x.name === "SolidWhite" ||
            (x.plugin instanceof cr.plugins_.TiledBg &&
              x.texture_file &&
              x.texture_file.includes("/solidwhite.png"))
        ),
        SolidRed: sdk_runtime.types_by_index.find(
          (x) =>
            x.name === "SolidMove" ||
            (x.plugin instanceof cr.plugins_.TiledBg &&
              x.texture_file &&
              x.texture_file.includes("/solidmove.png"))
        ),
        Spike: sdk_runtime.types_by_index.find(
          (x) =>
            x.name === "Spike" ||
            (x.plugin instanceof cr.plugins_.Sprite &&
              x.all_frames &&
              x.all_frames[0].texture_file.includes("spike-"))
        ),
        SpikeWhite: sdk_runtime.types_by_index.find(
          (x) =>
            x.name === "Spike2" ||
            (x.plugin instanceof cr.plugins_.Sprite &&
              x.all_frames &&
              x.all_frames[0].texture_file.includes("spike2-"))
        ),
        Flag: sdk_runtime.types_by_index.find(
          (x) =>
            x.name === "EndFlag" ||
            (x.plugin instanceof cr.plugins_.Sprite &&
              x.all_frames &&
              x.all_frames[0].texture_file.includes("endflag"))
        ),
        JumpThrough: sdk_runtime.types_by_index.find(
          (x) =>
            x.name === "JumpThrough" ||
            (x.plugin instanceof cr.plugins_.TiledBg &&
              x.texture_file &&
              x.texture_file.includes("jumpthrough") &&
              x.families.length === 2)
        ),
        GroundPoundSolid: sdk_runtime.types_by_index.find(
          (x) =>
            x.name === "GroundPoundSolid" ||
            (x.plugin instanceof cr.plugins_.TiledBg &&
              x.texture_file &&
              x.texture_file.includes("groundpoundsolid") &&
              x.families.length === 2)
        ),
        RocketLauncher: sdk_runtime.types_by_index.find(
          (x) =>
            x.name === "RocketLauncher" ||
            (x.plugin instanceof cr.plugins_.Sprite &&
              x.all_frames &&
              x.all_frames[0].texture_file.includes("rocketlauncher"))
        ),
        JumpBoost: sdk_runtime.types_by_index.find(
          (x) =>
            x.name === "JumpBoost" ||
            (x.plugin instanceof cr.plugins_.Sprite &&
              x.all_frames &&
              x.all_frames[0].texture_file.includes("jumpboost"))
        ),
        Gradient: sdk_runtime.types_by_index.find(
          (x) =>
            x.name === "Gradient" ||
            (x.plugin instanceof cr.plugins_.Sprite &&
              x.all_frames &&
              x.all_frames[0].texture_file.includes("gradient"))
        ),
        LayoutNameHolder: sdk_runtime.types_by_index.find(
          (x) =>
            x.name === "LayoutNameHolder" ||
            (x.plugin instanceof cr.plugins_.Sprite &&
              x.all_frames &&
              x.all_frames[0].texture_file.includes("layoutnameholder"))
        ),
        LayoutNumber: sdk_runtime.types_by_index.find(
          (x) =>
            x.name === "LayoutNumber" ||
            (x.plugin instanceof cr.plugins_.SkymenSFPlusPLus &&
              x.texture_file &&
              x.texture_file.includes("layoutnumber"))
        ),
        LayoutSubtitle: sdk_runtime.types_by_index.find(
          (x) =>
            x.name === "LayoutSubtitle" ||
            (x.plugin instanceof cr.plugins_.Sprite &&
              x.all_frames &&
              x.all_frames[0].texture_file.includes("layoutsubtitle"))
        ),
        Text: sdk_runtime.types_by_index.find(
          (x) =>
            x.name === "TextAlign" ||
            (x.plugin instanceof cr.plugins_.TextModded &&
              x.vars_count === 8 &&
              !x.is_family)
        ),
        PlayerRig: sdk_runtime.types_by_index.find(
          (x) =>
            x.name === "PlayerRig" || (x.is_family && x.members.length === 10)
        ),
        Portal: sdk_runtime.types_by_index.find(
          (x) =>
            x.name === "Portal" ||
            (x.plugin instanceof cr.plugins_.Sprite &&
              x.all_frames &&
              x.all_frames[0].texture_file.includes("portal"))
        ),
      };

      const initInstVars = {
        RocketLauncher: (
          inst,
          {
            Range = 300,
            RateOfFire = 2,
            RotateSpeed = 180,
            ProjectileRotateSpeed = 180,
            ProjectileSpeed = 150,
            PredictiveAim = false,
            ConeOfView = 360,
          } = {}
        ) => {
          inst.instance_vars[1] = ProjectileSpeed;
          inst.instance_vars[2] = ProjectileRotateSpeed;
          let turretBehavior = inst.behavior_insts.find(
            (beh) => beh.behavior instanceof cr.behaviors.Turret
          );
          turretBehavior.rateOfFire = RateOfFire;
          turretBehavior.range = Range;
          turretBehavior.rotateSpeed = cr.to_radians(RotateSpeed);
          turretBehavior.projectileSpeed = ProjectileSpeed;
          turretBehavior.predictiveAim = PredictiveAim;
          let losBehavior = inst.behavior_insts.find(
            (beh) => beh.behavior instanceof cr.behaviors.LOS
          );
          losBehavior.cone = cr.to_radians(ConeOfView);
        },
        JumpBoost: (
          inst,
          { Force = 0.7, SetDecelerationToZero = false } = {}
        ) => {
          inst.instance_vars[0] = Force;
          inst.instance_vars[1] = SetDecelerationToZero ? 1 : 0;
        },
        Portal: (
          inst,
          {
            ID = 0,
            Target = 0,
            ForceAngle = false,
            ForcedAngle = 0,
            ForceSpeed = false,
            ForcedSpeed = 0,
            InversePortal = false,
          } = {},
          { color: [r = 1, g = 1, b = 1] = [] } = {}
        ) => {
          inst.instance_vars[0] = ID;
          inst.instance_vars[1] = Target;
          inst.instance_vars[2] = ForceAngle ? 1 : 0;
          inst.instance_vars[3] = ForcedAngle;
          inst.instance_vars[4] = ForceSpeed ? 1 : 0;
          inst.instance_vars[5] = ForcedSpeed;
          inst.instance_vars[6] = InversePortal ? 1 : 0;
          inst.effect_params[0][3] = r * 255;
          inst.effect_params[0][4] = g * 255;
          inst.effect_params[0][5] = b * 255;
        },
        SolidWhite: (inst, _, { color: [r = 1, g = 1, b = 1] = [] } = {}) => {
          inst.effect_params[0][0] = r;
          inst.effect_params[0][1] = g;
          inst.effect_params[0][2] = b;
        },
        Gradient: (inst, _, { color: [r = 1, g = 1, b = 1] = [] } = {}) => {
          inst.effect_params[0][0] = r;
          inst.effect_params[0][1] = g;
          inst.effect_params[0][2] = b;
        },
        Text: (
          inst,
          _,
          {
            text,
            fontSize,
            fontFace,
            wordWrapMode,
            horizontalAlign,
            verticalAlign,
            isBold,
            isItalic,
            fontColor: [r = 0, g = 0, b = 0],
            lineHeight,
          } = {}
        ) => {
          inst.facename = fontFace;
          inst.text = text;
          inst.ptSize = fontSize;
          let wrap = ["word", "character"].findIndex((x) => x === wordWrapMode);
          inst.wrapbyword = wrap === 0;
          inst.nowrap = wrap === 2;
          inst.wrap = wrap; // 0=word, 1=character 2=none
          inst.halign =
            ["left", "center", "right"].findIndex(
              (x) => x === horizontalAlign
            ) * 50;
          inst.valign =
            ["top", "center", "bottom"].findIndex((x) => x === verticalAlign) *
            50;
          inst.fontStyle = `${isBold && "bold"} ${isItalic && "italic"}`;
          inst.line_height_offset = lineHeight;
          inst.color = `rgb(${r * 255},${g * 255},${b * 255})`;
          inst.updateFont();
        },
        Player: (
          inst,
          { SlideTime = 0.8, SlideRefresh = 0.5, Gravity = 1500 } = {}
        ) => {
          inst.instance_vars[5] = SlideTime;
          inst.instance_vars[6] = SlideRefresh;
          let platformerBehavior = inst.behavior_insts.find(
            (beh) => beh.behavior instanceof cr.behaviors.Platform
          );
          cr.behaviors.Platform.prototype.acts.__proto__.SetGravity.call(
            platformerBehavior,
            Gravity
          );
        },
      };

      const layers = {
        "Layer 0": baseLayout.layers.find((x) => x.name === "Layer 0"),
        "Layer 1": baseLayout.layers.find((x) => x.name === "Layer 1"),
        "Layer 2": baseLayout.layers.find((x) => x.name === "Layer 2"),
        "Layer 3": baseLayout.layers.find((x) => x.name === "Layer 3"),
        "Layer 4": baseLayout.layers.find((x) => x.name === "Layer 4"),
        Background: baseLayout.layers.find((x) => x.name === "Background"),
      };

      let create = (
        type,
        layer,
        {
          x,
          y,
          visible,
          opacity,
          collisionsEnabled,
          width,
          height,
          angle,
          instVars,
          extra,
        }
      ) => {
        if (!types.hasOwnProperty(type)) return;
        let inst = sdk_runtime.createInstance(types[type], layers[layer], x, y);
        inst.width = width === undefined || width === null ? inst.width : width;
        inst.height =
          height === undefined || height === null ? inst.height : height;
        inst.angle = angle === undefined || angle === null ? inst.angle : angle;
        inst.visible =
          visible === undefined || visible === null ? inst.visible : visible;
        inst.opacity =
          opacity === undefined || opacity === null ? inst.opacity : opacity;
        inst.collisionsEnabled =
          collisionsEnabled === undefined || collisionsEnabled === null
            ? inst.collisionsEnabled
            : collisionsEnabled;
        inst.set_bbox_changed();
        if (initInstVars.hasOwnProperty(type))
          initInstVars[type](inst, instVars, extra);
        return inst;
      };

      //create("Solid", "Layer 0", {x:100, y:100, angle: 45, height:8, width: 50})
      //create("Spike", "Layer 0", {x:100, y:500})

      globalThis.ovoLevelEditor = {
        startLevel(json) {
          sdk_runtime.types_by_index.find(
            (x) =>
              x.name === "Globals" ||
              (x.plugin instanceof cr.plugins_.Globals &&
                x.instvar_sids.length > 20)
          ).instances[0].instance_vars[3] = 1;
          this.curLevel = json;
          setLayoutToBase();
        },
        wipeAllInstances() {
          Object.values(layers).forEach((layer) => {
            if (!layer) return;
            console.log("wiping " + layer);
            layer.instances
              .filter((x) => Object.values(types).includes(x.type))
              .forEach(sdk_runtime.DestroyInstance.bind(sdk_runtime));
          });
        },
        getPlayer() {
          return sdk_runtime.types_by_index
            .filter(
              (x) =>
                !!x.animations &&
                x.animations[0].frames[0].texture_file.includes("collider")
            )[0]
            .instances.filter(
              (x) => x.instance_vars[17] === "" && x.behavior_insts[0].enabled
            )[0];
        },
        async awaitForPlayer() {
          let player = this.getPlayer();
          while (!player) {
            await new Promise((resolve) => setTimeout(resolve, 20));
            player = this.getPlayer();
          }
          return player;
        },
        async setPlayerPosition(x, y, layer) {
          let player = this.getPlayer();
          while (!player) {
            await new Promise((resolve) => setTimeout(resolve, 20));
            player = this.getPlayer();
          }
          if (x) player.x = x;
          if (y) player.y = y;
          player.type.plugin.acts.MoveToLayer.call(player, layer);
          let instances = [...types.PlayerRig.instances];
          instances.sort((a, b) => a.instance_vars[0] - b.instance_vars[0]);
          instances.forEach((inst) => {
            inst.type.plugin.acts.MoveToLayer.call(inst, layer);
          });
          player.set_bbox_changed();
        },
        applySetup() {
          if (!this.curLevel) return;
          if (this.curLevel.layout) {
            if (this.curLevel.layout.width) {
              baseLayout.originalWidth = this.curLevel.layout.width;
              baseLayout.width = this.curLevel.layout.width;
            }
            if (this.curLevel.layout.height) {
              baseLayout.originalHeight = this.curLevel.layout.height;
              baseLayout.height = this.curLevel.layout.height;
            }
          }
        },
        async applyCurrentLevel() {
          if (!this.curLevel) return;
          this.wipeAllInstances();
          let player = await this.awaitForPlayer();
          let playerInitialised = false;

          // if (this.curLevel.player) {
          //   initInstVars.Player(player, this.curLevel.player.instVars);
          //   this.setPlayerPosition(
          //     this.curLevel.player.x,
          //     this.curLevel.player.y,
          //     layers[this.curLevel.player.layer]
          //   );
          // }

          Object.keys(this.curLevel.layers).forEach((layer) => {
            if (!layers[layer]) return;
            let allInstances = Object.keys(this.curLevel.layers[layer])
              .map((type) =>
                this.curLevel.layers[layer][type].map((x) => ({ ...x, type }))
              )
              .flat()
              .sort(
                (a, b) =>
                  (a.zIndex === undefined || a.zIndex === null ? 0 : a.zIndex) -
                  (b.zIndex === undefined || b.zIndex === null ? 0 : b.zIndex)
              );
            for (let i = 0; i < allInstances.length; i++) {
              const inst = allInstances[i];
              let zIndex =
                inst.zIndex === undefined || inst.zIndex === null
                  ? i
                  : inst.zIndex;
              if (
                !playerInitialised &&
                this.curLevel.player &&
                this.curLevel.player.layer === layer &&
                (this.curLevel.player.zIndex === undefined ||
                this.curLevel.player.zIndex === null
                  ? i
                  : this.curLevel.player.zIndex) <= zIndex
              ) {
                playerInitialised = true;
                initInstVars.Player(player, this.curLevel.player.instVars);
                this.setPlayerPosition(
                  this.curLevel.player.x,
                  this.curLevel.player.y,
                  layers[this.curLevel.player.layer]
                );
              }
              let newInst = create(inst.type, layer, inst);
              sdk_runtime.trigger(newInst.type.plugin.cnds.OnCreated, newInst);
            }
            // Object.keys(this.curLevel.layers[layer]).forEach((type) => {
            //   if (!types[type]) return;
            //   this.curLevel.layers[layer][type].forEach((inst) => {
            //     let newInst = create(type, layer, inst);
            //     sdk_runtime.trigger(
            //       newInst.type.plugin.cnds.OnCreated,
            //       newInst
            //     );
            //   });
            // });
          });
          if (!playerInitialised && this.curLevel.player) {
            initInstVars.Player(player, this.curLevel.player.instVars);
            this.setPlayerPosition(
              this.curLevel.player.x,
              this.curLevel.player.y,
              layers[this.curLevel.player.layer]
            );
          }
          sdk_runtime.trigger(sdk_runtime.system.cnds.OnLayoutStart);
          if (
            this.curLevel.layout.holder &&
            typeof this.curLevel.layout.holder.x === "number"
          ) {
            let text = create(
              "LayoutNumber",
              "Layer 0",
              this.curLevel.layout.holder
            );
            sdk_runtime.trigger(text.type.plugin.cnds.OnCreated, text);
            if (typeof this.curLevel.layout.number === "number")
              text.text = this.curLevel.layout.number.toString();
            else text.text = "1";
          }

          let holder = create("LayoutNameHolder", "Layer 0", {
            x: -500,
            y: -500,
          });
          holder.instance_vars[0] = this.curLevel.layout.name || "";
          holder.instance_vars[2] = !!this.curLevel.layout.useSlope;
          holder.instance_vars[3] = true;
          sdk_runtime.trigger(holder.type.plugin.cnds.OnCreated, holder);
        },
        handleDrop(ev) {
          console.log("File(s) dropped");

          // Prevent default behavior (Prevent file from being opened)
          ev.preventDefault();
          let playFile = (file) => {
            console.log(file);
            file.text().then((text) => {
              console.log(text);
              try {
                let json = JSON.parse(text);
                if (globalThis.ovoLevelEditor.startLevel)
                  globalThis.ovoLevelEditor.startLevel(json);
              } catch (error) {
                alert("not a valid level file");
              }
            });
          };
          if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (var i = 0; i < ev.dataTransfer.items.length; i++) {
              // If dropped items aren't files, reject them
              if (ev.dataTransfer.items[i].kind === "file") {
                var file = ev.dataTransfer.items[i].getAsFile();
                playFile(file);
                break;
              }
            }
          } else {
            // Use DataTransfer interface to access the file(s)
            playFile(ev.dataTransfer.files[0]);
          }
        },
      };
      sdk_runtime.canvas.setAttribute("ondragover", "event.preventDefault();");
      sdk_runtime.canvas.setAttribute(
        "ondrop",
        "ovoLevelEditor.handleDrop(event)"
      );
    },
  };
  let previewBuffer = 3;
  let messageHandler = (event) => {
    if (!event.data.isLevelEditor || !event.data.messageType) return;
    if (event.data.messageType.toLowerCase() === "isready") {
      if (!!globalThis.cr_is_preview) previewBuffer--;
      console.log(previewBuffer);
      if (previewBuffer <= 0) globalThis.ovoLevelEditor.init();
      event.source.postMessage(
        {
          isReady: !globalThis.ovoLevelEditor.hasOwnProperty("init"),
          isLevelEditor: true,
          messageType: event.data.messageType,
        },
        event.origin
      );
    }
    if (event.data.messageType.toLowerCase() === "startlevel") {
      if (globalThis.ovoLevelEditor.hasOwnProperty("init")) {
        event.source.postMessage(
          {
            levelStarted: false,
            isLevelEditor: true,
            messageType: event.data.messageType,
          },
          event.origin
        );
        return;
      }
      globalThis.ovoLevelEditor.startLevel(event.data.level);
      event.source.postMessage(
        {
          levelStarted: true,
          isLevelEditor: true,
          messageType: event.data.messageType,
        },
        event.origin
      );
    }
  };
  globalThis.window.addEventListener("message", messageHandler);
}; //();
