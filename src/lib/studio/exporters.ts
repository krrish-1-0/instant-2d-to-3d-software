import * as THREE from "three";

function download(data: BlobPart, filename: string, mime: string) {
  const blob = new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function exportSceneAsGLTF(scene: THREE.Object3D, filename = "scene.glb") {
  const { GLTFExporter } = await import("three-stdlib");
  const exporter = new GLTFExporter();
  exporter.parse(
    scene,
    (result) => {
      if (result instanceof ArrayBuffer) {
        download(result, filename, "model/gltf-binary");
      } else {
        download(JSON.stringify(result, null, 2), filename.replace(/\.glb$/, ".gltf"), "application/json");
      }
    },
    (err) => console.error("GLTF export failed", err),
    { binary: filename.endsWith(".glb") },
  );
}

export async function exportSceneAsOBJ(scene: THREE.Object3D, filename = "scene.obj") {
  const { OBJExporter } = await import("three-stdlib");
  const exporter = new OBJExporter();
  const result = exporter.parse(scene);
  download(result, filename, "text/plain");
}

export async function exportSceneAsSTL(scene: THREE.Object3D, filename = "scene.stl") {
  const { STLExporter } = await import("three-stdlib");
  const exporter = new STLExporter();
  const result = exporter.parse(scene, { binary: true }) as DataView;
  const buf = result.buffer.slice(result.byteOffset, result.byteOffset + result.byteLength) as ArrayBuffer;
  download(buf, filename, "application/sla");
}
