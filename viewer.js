import * as WEBIFC from "https://cdn.jsdelivr.net/npm/web-ifc@0.0.66/web-ifc-api.js";
import * as BUI from "https://cdn.jsdelivr.net/npm/@thatopen/ui/+esm";
import * as OBC from "https://cdn.jsdelivr.net/npm/@thatopen/components/+esm";

const container = document.getElementById("container");

// 1. Set up the core components
const components = new OBC.Components();
await components.init();

const worlds = components.get(OBC.Worlds);
const world = worlds.create(
  OBC.SimpleScene,
  OBC.SimpleCamera,
  OBC.SimpleRenderer
);

world.scene = new OBC.SimpleScene(components);
world.renderer = new OBC.SimpleRenderer(components, container);
world.camera = new OBC.SimpleCamera(components);

world.camera.controls.setLookAt(12, 6, 8, 0, 0, -10);
world.scene.setup();
world.scene.three.background = null;

// 2. Add grid
const grids = components.get(OBC.Grids);
grids.create(world);

// 3. Load and configure IFC loader
const fragments = components.get(OBC.FragmentsManager);
const fragmentIfcLoader = components.get(OBC.IfcLoader);

// Load WebAssembly for web-ifc
await fragmentIfcLoader.setup({
  // Optional: Set manually
  // wasm: {
  //   path: "https://unpkg.com/web-ifc@0.0.66/",
  //   absolute: true,
  // },
});

// Exclude some categories to improve performance (optional)
const excludedCats = [
  WEBIFC.IFCTENDONANCHOR,
  WEBIFC.IFCREINFORCINGBAR,
  WEBIFC.IFCREINFORCINGELEMENT,
];
for (const cat of excludedCats) {
  fragmentIfcLoader.settings.excludedCategories.add(cat);
}

// Optional: Center model at origin
fragmentIfcLoader.settings.webIfc.COORDINATE_TO_ORIGIN = true;

// 4. Handle file uploads
const fileInput = document.getElementById("ifcInput");
let currentModel = null; // Store reference to the current model

fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  try {
    // ✅ Remove the previous model if it exists
    if (currentModel) {
      world.scene.three.remove(currentModel);
      fragments.dispose(currentModel); // Optional: Clean up memory
    }

    // ✅ Load and store the new model
    currentModel = await fragmentIfcLoader.load(buffer);
    currentModel.name = file.name;
    world.scene.three.add(currentModel);
    console.log("✅ IFC model loaded:", currentModel);
  } catch (error) {
    console.error("❌ Failed to load IFC model:", error);
  }
});

