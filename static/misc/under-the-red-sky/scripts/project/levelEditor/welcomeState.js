// Predefined welcome scene state
// Provides a simple state to display while the welcome dialog is open

export function getWelcomeState() {
  // Minimal scene: a few 3D shapes to showcase orbit
  // Note: StateManager will create instances using object type definitions
  // const instances = [
  //   {
  //     objectType: "GenericShape",
  //     uid: 10001,
  //     properties: {
  //       position: { value: { x: 1500, y: 1500, z: 0 } },
  //       size3D: { value: { x: 64, y: 64, z: 64 } },
  //       angle: { value: 0 },
  //       color: { value: "#FFFFFF" },
  //     },
  //   },
  //   {
  //     objectType: "Cone",
  //     uid: 10002,
  //     properties: {
  //       position: { value: { x: 1450, y: 1450, z: 0 } },
  //       scale: { value: { x: 1.2, y: 1.2, z: 1.2 } },
  //       rotation: { value: { x: 0, y: 0, z: 0 } },
  //       color: { value: "#FF0000" },
  //     },
  //   },
  //   {
  //     objectType: "GenericShape",
  //     uid: 10003,
  //     properties: {
  //       position: { value: { x: 1830, y: 1560, z: 0 } },
  //       size3D: { value: { x: 100, y: 50, z: 50 } },
  //       angle: { value: 0 },
  //       color: { value: "#FFFFFF" },
  //     },
  //   },
  // ];
  const instances = [
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1500,
            y: 1500.0086907732286,
            z: 4.118998623677953,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 2405.102928327173,
            y: 630.8466697251602,
            z: 63.08466697251602,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "tiles",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#ffffff",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000055,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1783.3828256673614,
            y: 1220.0704810826892,
            z: 67.20366559619399,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 31.54233348625801,
            y: 31.54233348625801,
            z: 394.27916857822504,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "brick",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#ffffff",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000056,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1783.3828256673614,
            y: 1787.8324838353335,
            z: 67.20366559619399,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 31.54233348625801,
            y: 31.54233348625801,
            z: 394.27916857822504,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "brick",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#ffffff",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000057,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1215.6208229147176,
            y: 1220.0704810826892,
            z: 67.20366559619399,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 31.54233348625801,
            y: 31.54233348625801,
            z: 394.27916857822504,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "brick",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#ffffff",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000058,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1215.6208229147176,
            y: 1787.8324838353335,
            z: 67.20366559619399,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 31.54233348625801,
            y: 31.54233348625801,
            z: 394.27916857822504,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "brick",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#ffffff",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000059,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1500,
            y: 1500.0086907732286,
            z: 445.71166743129004,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 630.8466697251602,
            y: 630.8466697251602,
            z: 63.08466697251602,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "default",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#ffffff",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000060,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1500,
            y: 1787.8324838353335,
            z: 67.20366559619399,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 537.2053671878316,
            y: 23.6567501146935,
            z: 147.8546882168344,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "container",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#636a69",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000061,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1500,
            y: 1220.0704810826892,
            z: 67.20366559619399,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 537.2053671878316,
            y: 23.6567501146935,
            z: 147.8546882168344,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "container",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#636a69",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000062,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1500,
            y: 1220.0704810826892,
            z: 193.37299954122597,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 537.2053671878316,
            y: 15.771166743129005,
            z: 256.2814595758463,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "glass",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#ffffff",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000063,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1500,
            y: 1787.8324838353335,
            z: 193.37299954122597,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 537.2053671878316,
            y: 15.771166743129005,
            z: 256.2814595758463,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "glass",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#ffffff",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000064,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1503.3667711103167,
            y: 1692.690876747426,
            z: 136.08925148642655,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 95.59381955185842,
            y: 0.3687487024051033,
            z: 23.837201190804937,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 45,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "box",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#ffffff",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000065,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1252.2667026614165,
            y: 1693.1119298270762,
            z: 136.08925148642655,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 95.59381955185842,
            y: 0.3687487024051033,
            z: 23.837201190804937,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 315,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "box",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#ffffff",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000066,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1378.505875390208,
            y: 1661.6631498903014,
            z: 136.08925148642655,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 183.28525070812756,
            y: 0.3687487024051033,
            z: 23.837201190804937,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "box",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#ffffff",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000067,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1507.3740747856516,
            y: 1892.086693418055,
            z: 117.13417198254993,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 34.976124841899654,
            y: 426.0134320867917,
            z: 10.675096367888472,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 90,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "plank",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#0a3e1b",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000068,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1507.3740747856516,
            y: 1934.3220139818586,
            z: 119.0734691504179,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 34.976124841899654,
            y: 426.0134320867917,
            z: 10.675096367888472,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 90,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "plank",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#0a3e1b",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000069,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1507.3740747856516,
            y: 1976.557334545662,
            z: 117.13417198254993,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 34.976124841899654,
            y: 426.0134320867917,
            z: 10.675096367888472,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 90,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "plank",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#0a3e1b",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000070,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1507.3740747856516,
            y: 1865.681617970311,
            z: 117.21910770258751,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 10.558830140950839,
            y: 426.0134320867917,
            z: 34.976124841899654,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 90,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "plank",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#0a3e1b",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000071,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1507.3740747856516,
            y: 1862.828884765835,
            z: 159.45442826639086,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 10.558830140950839,
            y: 426.0134320867917,
            z: 34.976124841899654,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 90,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "plank",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#0a3e1b",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000072,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1507.3740747856516,
            y: 1859.6585843749335,
            z: 201.68974883019422,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 10.558830140950839,
            y: 426.0134320867917,
            z: 34.976124841899654,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 90,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "plank",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#0a3e1b",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000073,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1310.6791293587178,
            y: 1934.3220139818586,
            z: 112.08943123172506,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 111.25671043728711,
            y: 16.39124545224445,
            z: 10.675096367888472,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 90,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "plank",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#0a3e1b",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000074,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1700.9064643111667,
            y: 1934.3220139818586,
            z: 112.08943123172506,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 111.25671043728711,
            y: 16.39124545224445,
            z: 10.675096367888472,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 90,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "plank",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#0a3e1b",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000075,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1696.2870064740875,
            y: 1853.9546030333881,
            z: 0,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 16,
            y: 16,
            z: 240,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 90,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "plank",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#0a3e1b",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000076,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1315.3740747856516,
            y: 1853.9546030333886,
            z: 0,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 16,
            y: 16,
            z: 240,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 90,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "plank",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#0a3e1b",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000077,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1696.2870064740875,
            y: 1980.532249668056,
            z: 0,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 16,
            y: 16,
            z: 110,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 90,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "plank",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#0a3e1b",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000078,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1315.3740747856516,
            y: 1980.532249668056,
            z: 0,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 16,
            y: 16,
            z: 110,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 90,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "plank",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#0a3e1b",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000079,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1500,
            y: 2112,
            z: -39.90375679077749,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 2410,
            y: 630.8466697251602,
            z: 63.08466697251602,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "concrete",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#585341",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000080,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1500,
            y: 896,
            z: -39.90375679077749,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 2405.102928327173,
            y: 365.88237736536917,
            z: 32,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "ice",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#c7c7c7",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000081,
    },
    {
      objectType: "GenericShape",
      properties: {
        position: {
          value: {
            x: 1500,
            y: 1152,
            z: -39.90375679077749,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 2410,
            y: 205.8104972600239,
            z: 63.08466697251602,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        shape: {
          value: "box",
          type: "selector",
          label: "Shape",
          key: "shape",
        },
        material: {
          value: "concrete",
          type: "selector",
          label: "Material",
          key: "material",
        },
        color: {
          value: "#585341",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000082,
    },
    {
      objectType: "Text",
      properties: {
        position: {
          value: {
            x: 1218.2893906219579,
            y: 1926.0030149180002,
            z: 333.0442340141681,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size2D: {
          value: {
            width: 43.99995327865875,
            height: 73.03686807179658,
          },
          type: "scale2d",
          label: "Size",
          key: "size2D",
        },
        rotation: {
          value: {
            x: 270,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "meshRotation2",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "tagAngle",
        },
        offset: {
          value: 1,
          type: "number",
          label: "Offset",
          key: "tagOffset",
        },
        text: {
          value: "!",
          type: "text",
          label: "Text Content",
          key: "text",
        },
        fontSize: {
          value: 52,
          type: "number",
          label: "Font Size",
          key: "fontSize",
        },
        color: {
          value: "#332b0d",
          type: "color",
          label: "Font Color",
          key: "fontColor",
        },
        fontFace: {
          value: "ProtestStrike-Regular",
          type: "selector",
          label: "Font Face",
          key: "fontFace",
        },
        textAlignment: {
          value: "center-center",
          type: "selector",
          label: "Text Alignment",
          key: "textAlignment",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000083,
    },
    {
      objectType: "levelEditorEndZone",
      properties: {
        position: {
          value: {
            x: 3712,
            y: -25472,
            z: 0,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size3D: {
          value: {
            x: 510,
            y: 510,
            z: 512,
          },
          type: "scale3d",
          label: "Size",
          key: "size3D",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "angle",
        },
        color: {
          value: "#16b0fe",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000084,
    },
    {
      objectType: "cctvCamera",
      properties: {
        position: {
          value: {
            x: 1216.5187131029625,
            y: 1772.0613170922045,
            z: 398.8290853684745,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 0.9856979214455628,
            y: -0.9856979214455628,
            z: 0.9856979214455628,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 255,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#c2c2c2",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000085,
    },
    {
      objectType: "cctvCamera",
      properties: {
        position: {
          value: {
            x: 1776.9610423023082,
            y: 1235.8416478258184,
            z: 402.5886810778067,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 0.9856979214455628,
            y: -0.9856979214455628,
            z: 0.9856979214455628,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 90,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#c2c2c2",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000086,
    },
    {
      objectType: "Cone",
      properties: {
        position: {
          value: {
            x: 1220.0617903094605,
            y: 1724.7478168628174,
            z: 67.20366559619399,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 0.9856979214455628,
            y: 0.9856979214455628,
            z: 0.9856979214455628,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#ffd642",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000087,
    },
    {
      objectType: "Cone",
      properties: {
        position: {
          value: {
            x: 1283.1464572819764,
            y: 1661.6631498903014,
            z: 67.20366559619399,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 0.9856979214455628,
            y: 0.9856979214455628,
            z: 0.9856979214455628,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#ffd642",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000088,
    },
    {
      objectType: "Cone",
      properties: {
        position: {
          value: {
            x: 1472.400458199524,
            y: 1661.6631498903014,
            z: 67.20366559619399,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 0.9856979214455628,
            y: 0.9856979214455628,
            z: 0.9856979214455628,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#ffd642",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000089,
    },
    {
      objectType: "Cone",
      properties: {
        position: {
          value: {
            x: 1535.4851251720406,
            y: 1724.7478168628174,
            z: 67.20366559619399,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 0.9856979214455628,
            y: 0.9856979214455628,
            z: 0.9856979214455628,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#ffd642",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000090,
    },
    {
      objectType: "Pipe",
      properties: {
        position: {
          value: {
            x: 1600,
            y: 1152,
            z: 37.33184038962111,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 1,
            y: 1,
            z: 1,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 90,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#9c9c9c",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000091,
    },
    {
      objectType: "cornerTarp",
      properties: {
        position: {
          value: {
            x: 576,
            y: 1817.2493279359835,
            z: 33.32675511067475,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 0.4928489607227814,
            y: 0.4928489607227814,
            z: 0.4928489607227814,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 90,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#9d9885",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000092,
    },
    {
      objectType: "edgeTarp",
      properties: {
        position: {
          value: {
            x: 1185.2468739711906,
            y: 1815.0032656891847,
            z: 463.6923121062298,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 0.25539793426701507,
            y: 0.4928489607227814,
            z: 0.3942791685782251,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#9d9885",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000093,
    },
    {
      objectType: "edgeTarp",
      properties: {
        position: {
          value: {
            x: 1185.3531956657805,
            y: 1184.9829769310904,
            z: 463.6923121062298,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 0.25539793426701507,
            y: 0.4928489607227814,
            z: 0.3942791685782251,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 90,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#9d9885",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000094,
    },
    {
      objectType: "edgeTarp",
      properties: {
        position: {
          value: {
            x: 1816.253946136868,
            y: 1816.2323391778305,
            z: 463.6923121062298,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 0.25539793426701507,
            y: 0.4928489607227814,
            z: 0.3942791685782251,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 270,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#9d9885",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000095,
    },
    {
      objectType: "edgeTarp",
      properties: {
        position: {
          value: {
            x: 1816.6738924820163,
            y: 1186.2120504197362,
            z: 463.6923121062298,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 0.25539793426701507,
            y: 0.4928489607227814,
            z: 0.3942791685782251,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 180,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#9d9885",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000096,
    },
    {
      objectType: "pole",
      properties: {
        position: {
          value: {
            x: 1472.400458199524,
            y: 1661.6631498903014,
            z: 67.20366559619401,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 0.821414934537969,
            y: 0.821414934537969,
            z: 0.2427427055476011,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#8f8f8f",
          type: "color",
          label: "Color",
          key: "color",
        },
        collision: {
          value: true,
          type: "checkbox",
          label: "Collision Enabled",
          key: "collision",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000097,
    },
    {
      objectType: "pole",
      properties: {
        position: {
          value: {
            x: 1535.4851251720406,
            y: 1724.7478168628174,
            z: 67.20366559619401,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 0.821414934537969,
            y: 0.821414934537969,
            z: 0.2427427055476011,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#8f8f8f",
          type: "color",
          label: "Color",
          key: "color",
        },
        collision: {
          value: true,
          type: "checkbox",
          label: "Collision Enabled",
          key: "collision",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000098,
    },
    {
      objectType: "pole",
      properties: {
        position: {
          value: {
            x: 1283.1464572819764,
            y: 1661.6631498903014,
            z: 67.20366559619401,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 0.821414934537969,
            y: 0.821414934537969,
            z: 0.2427427055476011,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#8f8f8f",
          type: "color",
          label: "Color",
          key: "color",
        },
        collision: {
          value: true,
          type: "checkbox",
          label: "Collision Enabled",
          key: "collision",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000099,
    },
    {
      objectType: "pole",
      properties: {
        position: {
          value: {
            x: 1220.0617903094605,
            y: 1724.7478168628174,
            z: 67.20366559619401,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 0.821414934537969,
            y: 0.821414934537969,
            z: 0.2427427055476011,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#8f8f8f",
          type: "color",
          label: "Color",
          key: "color",
        },
        collision: {
          value: true,
          type: "checkbox",
          label: "Collision Enabled",
          key: "collision",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000100,
    },
    {
      objectType: "pole",
      properties: {
        position: {
          value: {
            x: 1793.5024028532093,
            y: 1917.69469925588,
            z: 19.29089426357416,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 0.8333333333333334,
            y: 0.8333333333333334,
            z: 1,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: -270,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#8f8f8f",
          type: "color",
          label: "Color",
          key: "color",
        },
        collision: {
          value: true,
          type: "checkbox",
          label: "Collision Enabled",
          key: "collision",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000101,
    },
    {
      objectType: "pole",
      properties: {
        position: {
          value: {
            x: 1215.3085538981986,
            y: 1917.88854821089,
            z: 19.29089426357416,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 0.8333333333333334,
            y: 0.8333333333333334,
            z: 1,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: -270,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#8f8f8f",
          type: "color",
          label: "Color",
          key: "color",
        },
        collision: {
          value: true,
          type: "checkbox",
          label: "Collision Enabled",
          key: "collision",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000102,
    },
    {
      objectType: "snowman",
      properties: {
        position: {
          value: {
            x: 2368,
            y: 896,
            z: -23.650215220700375,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 1,
            y: 1,
            z: 1,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 135,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#ffffff",
          type: "color",
          label: "Color",
          key: "color",
        },
        collision: {
          value: true,
          type: "checkbox",
          label: "Collision Enabled",
          key: "collision",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000103,
    },
    {
      objectType: "railing",
      properties: {
        position: {
          value: {
            x: 2048,
            y: 1792,
            z: 64,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 1,
            y: 1,
            z: 1,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#787878",
          type: "color",
          label: "Color",
          key: "color",
        },
        collision: {
          value: true,
          type: "checkbox",
          label: "Collision Enabled",
          key: "collision",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000104,
    },
    {
      objectType: "railing",
      properties: {
        position: {
          value: {
            x: 960,
            y: 1792,
            z: 64,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 1,
            y: 1,
            z: 1,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#787878",
          type: "color",
          label: "Color",
          key: "color",
        },
        collision: {
          value: true,
          type: "checkbox",
          label: "Collision Enabled",
          key: "collision",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000105,
    },
    {
      objectType: "wireMesh",
      properties: {
        position: {
          value: {
            x: 448,
            y: 1088,
            z: 0,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 1.05,
            y: 1,
            z: 1,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#ffffff",
          type: "color",
          label: "Color",
          key: "color",
        },
        collision: {
          value: true,
          type: "checkbox",
          label: "Collision Enabled",
          key: "collision",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000106,
    },
    {
      objectType: "wireMesh",
      properties: {
        position: {
          value: {
            x: 768,
            y: 1088,
            z: 0,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 1.05,
            y: 1,
            z: 1,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#ffffff",
          type: "color",
          label: "Color",
          key: "color",
        },
        collision: {
          value: true,
          type: "checkbox",
          label: "Collision Enabled",
          key: "collision",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000107,
    },
    {
      objectType: "wireMesh",
      properties: {
        position: {
          value: {
            x: 1088,
            y: 1088,
            z: 0,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 1.05,
            y: 1,
            z: 1,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#ffffff",
          type: "color",
          label: "Color",
          key: "color",
        },
        collision: {
          value: true,
          type: "checkbox",
          label: "Collision Enabled",
          key: "collision",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000108,
    },
    {
      objectType: "wireMesh",
      properties: {
        position: {
          value: {
            x: 1408,
            y: 1088,
            z: 0,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 1.05,
            y: 1,
            z: 1,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#ffffff",
          type: "color",
          label: "Color",
          key: "color",
        },
        collision: {
          value: true,
          type: "checkbox",
          label: "Collision Enabled",
          key: "collision",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000109,
    },
    {
      objectType: "wireMesh",
      properties: {
        position: {
          value: {
            x: 2368,
            y: 1088,
            z: 0,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 1.05,
            y: 1,
            z: 1,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#ffffff",
          type: "color",
          label: "Color",
          key: "color",
        },
        collision: {
          value: true,
          type: "checkbox",
          label: "Collision Enabled",
          key: "collision",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000110,
    },
    {
      objectType: "wireMesh",
      properties: {
        position: {
          value: {
            x: 2048,
            y: 1088,
            z: 0,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 1.05,
            y: 1,
            z: 1,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#ffffff",
          type: "color",
          label: "Color",
          key: "color",
        },
        collision: {
          value: true,
          type: "checkbox",
          label: "Collision Enabled",
          key: "collision",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000111,
    },
    {
      objectType: "wireMesh",
      properties: {
        position: {
          value: {
            x: 1728,
            y: 1088,
            z: 0,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        scale: {
          value: {
            x: 1.05,
            y: 1,
            z: 1,
          },
          type: "scale3d",
          label: "Scale",
          key: "scale",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "rotation",
        },
        color: {
          value: "#ffffff",
          type: "color",
          label: "Color",
          key: "color",
        },
        collision: {
          value: true,
          type: "checkbox",
          label: "Collision Enabled",
          key: "collision",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000112,
    },
    {
      objectType: "TagSprite",
      properties: {
        position: {
          value: {
            x: 1379.6906562254799,
            y: 1776.0041087779866,
            z: 130.28833256870993,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size2D: {
          value: {
            width: 184.32551131032022,
            height: 172.49713625297346,
          },
          type: "scale2d",
          label: "Size",
          key: "size2D",
        },
        rotation: {
          value: {
            x: 270,
            y: 0,
            z: 180,
          },
          type: "angle3d",
          label: "Rotation",
          key: "meshRotation2",
        },
        tag: {
          value: "Splatters",
          type: "selector",
          label: "Tag",
          key: "tag",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "tagAngle",
        },
        offset: {
          value: 1,
          type: "number",
          label: "Offset",
          key: "tagOffset",
        },
        color: {
          value: "#331010",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000113,
    },
    {
      objectType: "TagSprite",
      properties: {
        position: {
          value: {
            x: 1409.3157912270085,
            y: 1724.7478168628174,
            z: 67.20366559619399,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size2D: {
          value: {
            width: 184.32551131032022,
            height: 172.49713625297346,
          },
          type: "scale2d",
          label: "Size",
          key: "size2D",
        },
        rotation: {
          value: {
            x: 0,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "meshRotation2",
        },
        tag: {
          value: "Splatters",
          type: "selector",
          label: "Tag",
          key: "tag",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "tagAngle",
        },
        offset: {
          value: 2,
          type: "number",
          label: "Offset",
          key: "tagOffset",
        },
        color: {
          value: "#800000",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000114,
    },
    {
      objectType: "TagSprite",
      properties: {
        position: {
          value: {
            x: 1288.0672378647678,
            y: 1231.898856140036,
            z: 173.49840716013793,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size2D: {
          value: {
            width: 92.79911787101202,
            height: 46.77075540699006,
          },
          type: "scale2d",
          label: "Size",
          key: "size2D",
        },
        rotation: {
          value: {
            x: 270,
            y: 345,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "meshRotation2",
        },
        tag: {
          value: "No Future",
          type: "selector",
          label: "Tag",
          key: "tag",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "tagAngle",
        },
        offset: {
          value: 1,
          type: "number",
          label: "Offset",
          key: "tagOffset",
        },
        color: {
          value: "#000000",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000115,
    },
    {
      objectType: "TagSprite",
      properties: {
        position: {
          value: {
            x: 1472.400458199524,
            y: 1231.898856140036,
            z: 145.59863497922734,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size2D: {
          value: {
            width: 240.5102928327173,
            height: 52.241989836614835,
          },
          type: "scale2d",
          label: "Size",
          key: "size2D",
        },
        rotation: {
          value: {
            x: 270,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "meshRotation2",
        },
        tag: {
          value: "ZZ-Corp",
          type: "selector",
          label: "Tag",
          key: "tag",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "tagAngle",
        },
        offset: {
          value: 1,
          type: "number",
          label: "Offset",
          key: "tagOffset",
        },
        color: {
          value: "#ffffff",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000116,
    },
    {
      objectType: "TagSprite",
      properties: {
        position: {
          value: {
            x: 1491.349639042176,
            y: 1776.0041087779866,
            z: 140.28733951117212,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size2D: {
          value: {
            width: 240.5102928327173,
            height: 52.241989836614835,
          },
          type: "scale2d",
          label: "Size",
          key: "size2D",
        },
        rotation: {
          value: {
            x: 270,
            y: 0,
            z: 180,
          },
          type: "angle3d",
          label: "Rotation",
          key: "meshRotation2",
        },
        tag: {
          value: "ZZ-Corp",
          type: "selector",
          label: "Tag",
          key: "tag",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "tagAngle",
        },
        offset: {
          value: 0.5,
          type: "number",
          label: "Offset",
          key: "tagOffset",
        },
        color: {
          value: "#ffffff",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000117,
    },
    {
      objectType: "TagSprite",
      properties: {
        position: {
          value: {
            x: 1795.2228055911746,
            y: 1922.8091659629895,
            z: 351.3171242767597,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size2D: {
          value: {
            width: 162.89288084227283,
            height: 162.89288084227283,
          },
          type: "scale2d",
          label: "Size",
          key: "size2D",
        },
        rotation: {
          value: {
            x: 270,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "meshRotation2",
        },
        tag: {
          value: "Manhole Cover",
          type: "selector",
          label: "Tag",
          key: "tag",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "tagAngle",
        },
        offset: {
          value: 1,
          type: "number",
          label: "Offset",
          key: "tagOffset",
        },
        color: {
          value: "#ffffff",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000118,
    },
    {
      objectType: "TagSprite",
      properties: {
        position: {
          value: {
            x: 1795.2228055911746,
            y: 1922.8091659629895,
            z: 351.3171242767597,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size2D: {
          value: {
            width: 139.83705960618033,
            height: 138.36509055769426,
          },
          type: "scale2d",
          label: "Size",
          key: "size2D",
        },
        rotation: {
          value: {
            x: 270,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "meshRotation2",
        },
        tag: {
          value: "Never Rain",
          type: "selector",
          label: "Tag",
          key: "tag",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "tagAngle",
        },
        offset: {
          value: 2,
          type: "number",
          label: "Offset",
          key: "tagOffset",
        },
        color: {
          value: "#ffd642",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000119,
    },
    {
      objectType: "TagSprite",
      properties: {
        position: {
          value: {
            x: 1218.2228055911742,
            y: 1924.0030149180002,
            z: 353.95290241229725,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size2D: {
          value: {
            width: 156.9104705943653,
            height: 137.29666177006968,
          },
          type: "scale2d",
          label: "Size",
          key: "size2D",
        },
        rotation: {
          value: {
            x: 270,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "meshRotation2",
        },
        tag: {
          value: "Triangle",
          type: "selector",
          label: "Tag",
          key: "tag",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "tagAngle",
        },
        offset: {
          value: 1,
          type: "number",
          label: "Offset",
          key: "tagOffset",
        },
        color: {
          value: "#4b4c4d",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000120,
    },
    {
      objectType: "TagSprite",
      properties: {
        position: {
          value: {
            x: 1218.2228055911742,
            y: 1924.0030149180002,
            z: 353.95290241229725,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size2D: {
          value: {
            width: 156.9104705943653,
            height: 137.29666177006968,
          },
          type: "scale2d",
          label: "Size",
          key: "size2D",
        },
        rotation: {
          value: {
            x: 270,
            y: 0,
            z: 0,
          },
          type: "angle3d",
          label: "Rotation",
          key: "meshRotation2",
        },
        tag: {
          value: "Triangle",
          type: "selector",
          label: "Tag",
          key: "tag",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "tagAngle",
        },
        offset: {
          value: 2,
          type: "number",
          label: "Offset",
          key: "tagOffset",
        },
        color: {
          value: "#ffd642",
          type: "color",
          label: "Color",
          key: "color",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000121,
    },
    {
      objectType: "StripesTagTiled",
      properties: {
        position: {
          value: {
            x: 1377.8777055553512,
            y: 1661.4787755390992,
            z: 148.33125255638663,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size2D: {
          value: {
            width: 179.89714824902268,
            height: 19.391354639686334,
          },
          type: "scale2d",
          label: "Size",
          key: "size2D",
        },
        rotation: {
          value: {
            x: 270,
            y: 0,
            z: 180,
          },
          type: "angle3d",
          label: "Rotation",
          key: "meshRotation2",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "tagAngle",
        },
        offset: {
          value: 1,
          type: "number",
          label: "Offset",
          key: "tagOffset",
        },
        color: {
          value: "#ffd642",
          type: "color",
          label: "Color",
          key: "color",
        },
        imageOffset: {
          value: {
            x: 0,
            y: 0,
          },
          type: "scale2d",
          label: "Image Offset",
          key: "imageOffset",
        },
        imageScale: {
          value: {
            x: 1,
            y: 1,
          },
          type: "scale2d",
          label: "Image Scale",
          key: "imageScale",
        },
        enableTileRandomization: {
          value: false,
          type: "checkbox",
          label: "Enable Tile Randomization",
          key: "enableTileRandomization",
        },
        tileRandom: {
          value: {
            x: 1,
            y: 1,
            angle: 1,
          },
          type: "scale3d",
          label: "Tile Randomization Amount",
          key: "tileRandom",
        },
        tileBlend: {
          value: {
            x: 0.1,
            y: 0.1,
          },
          type: "scale2d",
          label: "Tile Blend",
          key: "tileBlend",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000122,
    },
    {
      objectType: "StripesTagTiled",
      properties: {
        position: {
          value: {
            x: 1251.8264336709165,
            y: 1694.1968872604252,
            z: 148.52150995030732,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size2D: {
          value: {
            width: 81.856565099852,
            height: 21.04318723209687,
          },
          type: "scale2d",
          label: "Size",
          key: "size2D",
        },
        rotation: {
          value: {
            x: 270,
            y: 0,
            z: 135,
          },
          type: "angle3d",
          label: "Rotation",
          key: "meshRotation2",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "tagAngle",
        },
        offset: {
          value: 1,
          type: "number",
          label: "Offset",
          key: "tagOffset",
        },
        color: {
          value: "#ffd642",
          type: "color",
          label: "Color",
          key: "color",
        },
        imageOffset: {
          value: {
            x: 0,
            y: 0,
          },
          type: "scale2d",
          label: "Image Offset",
          key: "imageOffset",
        },
        imageScale: {
          value: {
            x: 1,
            y: 1,
          },
          type: "scale2d",
          label: "Image Scale",
          key: "imageScale",
        },
        enableTileRandomization: {
          value: false,
          type: "checkbox",
          label: "Enable Tile Randomization",
          key: "enableTileRandomization",
        },
        tileRandom: {
          value: {
            x: 1,
            y: 1,
            angle: 1,
          },
          type: "scale3d",
          label: "Tile Randomization Amount",
          key: "tileRandom",
        },
        tileBlend: {
          value: {
            x: 0.1,
            y: 0.1,
          },
          type: "scale2d",
          label: "Tile Blend",
          key: "tileBlend",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000123,
    },
    {
      objectType: "StripesTagTiled",
      properties: {
        position: {
          value: {
            x: 1505.4775165792596,
            y: 1694.5408775083445,
            z: 147.87032113229932,
          },
          type: "position",
          label: "Position",
          key: "position",
        },
        size2D: {
          value: {
            width: 85.05919245992536,
            height: 22.062500857199073,
          },
          type: "scale2d",
          label: "Size",
          key: "size2D",
        },
        rotation: {
          value: {
            x: 270,
            y: 0,
            z: 225,
          },
          type: "angle3d",
          label: "Rotation",
          key: "meshRotation2",
        },
        angle: {
          value: 0,
          type: "angle1d",
          label: "Angle",
          key: "tagAngle",
        },
        offset: {
          value: 1,
          type: "number",
          label: "Offset",
          key: "tagOffset",
        },
        color: {
          value: "#ffd642",
          type: "color",
          label: "Color",
          key: "color",
        },
        imageOffset: {
          value: {
            x: 0,
            y: 0,
          },
          type: "scale2d",
          label: "Image Offset",
          key: "imageOffset",
        },
        imageScale: {
          value: {
            x: 1,
            y: 1,
          },
          type: "scale2d",
          label: "Image Scale",
          key: "imageScale",
        },
        enableTileRandomization: {
          value: false,
          type: "checkbox",
          label: "Enable Tile Randomization",
          key: "enableTileRandomization",
        },
        tileRandom: {
          value: {
            x: 1,
            y: 1,
            angle: 1,
          },
          type: "scale3d",
          label: "Tile Randomization Amount",
          key: "tileRandom",
        },
        tileBlend: {
          value: {
            x: 0.1,
            y: 0.1,
          },
          type: "scale2d",
          label: "Tile Blend",
          key: "tileBlend",
        },
        deleteButton: {
          value: false,
          type: "button",
          label: "Actions",
          key: "deleteButton",
        },
      },
      uid: 1000124,
    },
  ];
  return {
    version: "1.0.0",
    instances,
    levelData: {
      levelName: "Welcome",
      gridSettings: {
        snapToGrid: false,
        size: { x: 64, y: 64, z: 64 },
        angleSnap: 15,
      },
      levelSize: { width: 3000.0, height: 3000.0 },
    },
    metaData: {
      cameraTransform: {},
    },
  };
}
