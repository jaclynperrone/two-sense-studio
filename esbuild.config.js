import build from "./config/esbuild.defaults.js"
import { writeFileSync, existsSync, mkdirSync } from "fs"
import { glob } from "glob"

const scssWatcher = {
  name: "scss-watcher",
  setup(build) {
    // Always watch all scss files so error recovery works
    build.onLoad({ filter: /\.scss$/ }, async (args) => {
      // Return null to let the sass plugin handle it, but register watchFiles
      return null
    })

    let hadError = false
    build.onEnd(result => {
      if (result.errors.length > 0) {
        hadError = true
      } else if (hadError) {
        hadError = false
        setTimeout(() => {
          try {
            const cacheDir = ".bridgetown-cache"
            if (!existsSync(cacheDir)) mkdirSync(cacheDir)
            writeFileSync(`${cacheDir}/live_reload.txt`, Date.now().toString())
            console.log("[esbuild] Recovery complete — triggering reload")
          } catch(e) {}
        }, 500)
      }
    })
  }
}

// You can customize this as you wish, perhaps to add new esbuild plugins.
//
// ```
// import { copy } from 'esbuild-plugin-copy'
// 
// const esbuildOptions = {
//   plugins: [
//     copy({
//       resolveFrom: 'cwd',
//       assets: {
//         from: ['./node_modules/somepackage/files/*')],
//         to: ['./output/_bridgetown/somepackage/files')],
//       },
//       verbose: false
//     }),
//   ]
// }
// ```
//
// You can also support custom base_path deployments via changing `publicPath`.
//
// ```
// const esbuildOptions = {
//   publicPath: "/my_subfolder/_bridgetown/static",
//   ...
// }
// ```

/**
 * @typedef { import("esbuild").BuildOptions } BuildOptions
 * @type {BuildOptions}
 */
const esbuildOptions = {
  plugins: [
    scssWatcher
  ],
  globOptions: {
    excludeFilter: /\.(dsd|lit)\.css$/
  }
}

build(esbuildOptions)
