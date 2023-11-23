import { getNamedMiddlewareRegex } from "../../../shared/lib/router/utils/route-regex";
import { getModuleBuildInfo } from "../loaders/get-module-build-info";
import { getSortedRoutes } from "../../../shared/lib/router/utils";
import { webpack, sources } from "next/dist/compiled/webpack/webpack";
import { isMatch } from "next/dist/compiled/micromatch";
import { EDGE_RUNTIME_WEBPACK, EDGE_UNSUPPORTED_NODE_APIS, MIDDLEWARE_BUILD_MANIFEST, FLIGHT_MANIFEST, MIDDLEWARE_MANIFEST, MIDDLEWARE_REACT_LOADABLE_MANIFEST, NEXT_CLIENT_SSR_ENTRY_SUFFIX, FLIGHT_SERVER_CSS_MANIFEST, SUBRESOURCE_INTEGRITY_MANIFEST, FONT_LOADER_MANIFEST } from "../../../shared/lib/constants";
import { getPageStaticInfo } from "../../analysis/get-page-static-info";
import { traceGlobals } from "../../../trace/shared";
import { EVENT_BUILD_FEATURE_USAGE } from "../../../telemetry/events";
import { normalizeAppPath } from "../../../shared/lib/router/utils/app-paths";
const NAME = "MiddlewarePlugin";
/**
 * Checks the value of usingIndirectEval and when it is a set of modules it
 * check if any of the modules is actually being used. If the value is
 * simply truthy it will return true.
 */ function isUsingIndirectEvalAndUsedByExports(args) {
    const { moduleGraph , runtime , module , usingIndirectEval , wp  } = args;
    if (typeof usingIndirectEval === "boolean") {
        return usingIndirectEval;
    }
    const exportsInfo = moduleGraph.getExportsInfo(module);
    for (const exportName of usingIndirectEval){
        if (exportsInfo.getUsed(exportName, runtime) !== wp.UsageState.Unused) {
            return true;
        }
    }
    return false;
}
function getEntryFiles(entryFiles, meta, opts) {
    const files = [];
    if (meta.edgeSSR) {
        if (meta.edgeSSR.isServerComponent) {
            files.push(`server/${FLIGHT_MANIFEST}.js`);
            files.push(`server/${FLIGHT_SERVER_CSS_MANIFEST}.js`);
            if (opts.sriEnabled) {
                files.push(`server/${SUBRESOURCE_INTEGRITY_MANIFEST}.js`);
            }
            files.push(...entryFiles.filter((file)=>file.startsWith("pages/") && !file.endsWith(".hot-update.js")).map((file)=>"server/" + // TODO-APP: seems this should be removed.
                file.replace(".js", NEXT_CLIENT_SSR_ENTRY_SUFFIX + ".js")));
        }
        files.push(`server/${MIDDLEWARE_BUILD_MANIFEST}.js`, `server/${MIDDLEWARE_REACT_LOADABLE_MANIFEST}.js`);
        if (opts.hasFontLoaders) {
            files.push(`server/${FONT_LOADER_MANIFEST}.js`);
        }
    }
    files.push(...entryFiles.filter((file)=>!file.endsWith(".hot-update.js")).map((file)=>"server/" + file));
    return files;
}
function getCreateAssets(params) {
    const { compilation , metadataByEntry , opts  } = params;
    return (assets)=>{
        const middlewareManifest = {
            sortedMiddleware: [],
            middleware: {},
            functions: {},
            version: 2
        };
        for (const entrypoint of compilation.entrypoints.values()){
            var ref, ref1, ref2, ref3, ref4;
            if (!entrypoint.name) {
                continue;
            }
            // There should always be metadata for the entrypoint.
            const metadata = metadataByEntry.get(entrypoint.name);
            const page = (metadata == null ? void 0 : (ref = metadata.edgeMiddleware) == null ? void 0 : ref.page) || (metadata == null ? void 0 : (ref1 = metadata.edgeSSR) == null ? void 0 : ref1.page) || (metadata == null ? void 0 : (ref2 = metadata.edgeApiFunction) == null ? void 0 : ref2.page);
            if (!page) {
                continue;
            }
            const { namedRegex  } = getNamedMiddlewareRegex(((ref3 = metadata.edgeSSR) == null ? void 0 : ref3.isAppDir) ? normalizeAppPath(page) : page, {
                catchAll: !metadata.edgeSSR && !metadata.edgeApiFunction
            });
            const matchers = (metadata == null ? void 0 : (ref4 = metadata.edgeMiddleware) == null ? void 0 : ref4.matchers) ?? [
                {
                    regexp: namedRegex
                }, 
            ];
            const edgeFunctionDefinition = {
                env: Array.from(metadata.env),
                files: getEntryFiles(entrypoint.getFiles(), metadata, opts),
                name: entrypoint.name,
                page: page,
                matchers,
                wasm: Array.from(metadata.wasmBindings, ([name, filePath])=>({
                        name,
                        filePath
                    })),
                assets: Array.from(metadata.assetBindings, ([name, filePath])=>({
                        name,
                        filePath
                    })),
                ...metadata.regions && {
                    regions: metadata.regions
                }
            };
            if (metadata.edgeApiFunction || metadata.edgeSSR) {
                middlewareManifest.functions[page] = edgeFunctionDefinition;
            } else {
                middlewareManifest.middleware[page] = edgeFunctionDefinition;
            }
        }
        middlewareManifest.sortedMiddleware = getSortedRoutes(Object.keys(middlewareManifest.middleware));
        assets[MIDDLEWARE_MANIFEST] = new sources.RawSource(JSON.stringify(middlewareManifest, null, 2));
    };
}
function buildWebpackError({ message , loc , compilation , entryModule , parser  }) {
    const error = new compilation.compiler.webpack.WebpackError(message);
    error.name = NAME;
    const module = entryModule ?? (parser == null ? void 0 : parser.state.current);
    if (module) {
        error.module = module;
    }
    error.loc = loc;
    return error;
}
function isInMiddlewareLayer(parser) {
    var ref;
    return ((ref = parser.state.module) == null ? void 0 : ref.layer) === "middleware";
}
function isProcessEnvMemberExpression(memberExpression) {
    var ref, ref5, ref6;
    return ((ref = memberExpression.object) == null ? void 0 : ref.type) === "Identifier" && memberExpression.object.name === "process" && (((ref5 = memberExpression.property) == null ? void 0 : ref5.type) === "Literal" && memberExpression.property.value === "env" || ((ref6 = memberExpression.property) == null ? void 0 : ref6.type) === "Identifier" && memberExpression.property.name === "env");
}
function isNodeJsModule(moduleName) {
    return require("module").builtinModules.includes(moduleName);
}
function isDynamicCodeEvaluationAllowed(fileName, edgeFunctionConfig, rootDir) {
    const name = fileName.replace(rootDir ?? "", "");
    return isMatch(name, (edgeFunctionConfig == null ? void 0 : edgeFunctionConfig.unstable_allowDynamicGlobs) ?? []);
}
function buildUnsupportedApiError({ apiName , loc , ...rest }) {
    return buildWebpackError({
        message: `A Node.js API is used (${apiName} at line: ${loc.start.line}) which is not supported in the Edge Runtime.
Learn more: https://nextjs.org/docs/api-reference/edge-runtime`,
        loc,
        ...rest
    });
}
function registerUnsupportedApiHooks(parser, compilation) {
    for (const expression of EDGE_UNSUPPORTED_NODE_APIS){
        const warnForUnsupportedApi = (node)=>{
            if (!isInMiddlewareLayer(parser)) {
                return;
            }
            compilation.warnings.push(buildUnsupportedApiError({
                compilation,
                parser,
                apiName: expression,
                ...node
            }));
            return true;
        };
        parser.hooks.call.for(expression).tap(NAME, warnForUnsupportedApi);
        parser.hooks.expression.for(expression).tap(NAME, warnForUnsupportedApi);
        parser.hooks.callMemberChain.for(expression).tap(NAME, warnForUnsupportedApi);
        parser.hooks.expressionMemberChain.for(expression).tap(NAME, warnForUnsupportedApi);
    }
    const warnForUnsupportedProcessApi = (node, [callee])=>{
        if (!isInMiddlewareLayer(parser) || callee === "env") {
            return;
        }
        compilation.warnings.push(buildUnsupportedApiError({
            compilation,
            parser,
            apiName: `process.${callee}`,
            ...node
        }));
        return true;
    };
    parser.hooks.callMemberChain.for("process").tap(NAME, warnForUnsupportedProcessApi);
    parser.hooks.expressionMemberChain.for("process").tap(NAME, warnForUnsupportedProcessApi);
}
function getCodeAnalyzer(params) {
    return (parser)=>{
        const { dev , compiler: { webpack: wp  } , compilation ,  } = params;
        const { hooks  } = parser;
        /**
     * For an expression this will check the graph to ensure it is being used
     * by exports. Then it will store in the module buildInfo a boolean to
     * express that it contains dynamic code and, if it is available, the
     * module path that is using it.
     */ const handleExpression = ()=>{
            if (!isInMiddlewareLayer(parser)) {
                return;
            }
            wp.optimize.InnerGraph.onUsage(parser.state, (used = true)=>{
                const buildInfo = getModuleBuildInfo(parser.state.module);
                if (buildInfo.usingIndirectEval === true || used === false) {
                    return;
                }
                if (!buildInfo.usingIndirectEval || used === true) {
                    buildInfo.usingIndirectEval = used;
                    return;
                }
                buildInfo.usingIndirectEval = new Set([
                    ...Array.from(buildInfo.usingIndirectEval),
                    ...Array.from(used), 
                ]);
            });
        };
        /**
     * This expression handler allows to wrap a dynamic code expression with a
     * function call where we can warn about dynamic code not being allowed
     * but actually execute the expression.
     */ const handleWrapExpression = (expr)=>{
            if (!isInMiddlewareLayer(parser)) {
                return;
            }
            const { ConstDependency  } = wp.dependencies;
            const dep1 = new ConstDependency("__next_eval__(function() { return ", expr.range[0]);
            dep1.loc = expr.loc;
            parser.state.module.addPresentationalDependency(dep1);
            const dep2 = new ConstDependency("})", expr.range[1]);
            dep2.loc = expr.loc;
            parser.state.module.addPresentationalDependency(dep2);
            handleExpression();
            return true;
        };
        /**
     * This expression handler allows to wrap a WebAssembly.compile invocation with a
     * function call where we can warn about WASM code generation not being allowed
     * but actually execute the expression.
     */ const handleWrapWasmCompileExpression = (expr)=>{
            if (!isInMiddlewareLayer(parser)) {
                return;
            }
            const { ConstDependency  } = wp.dependencies;
            const dep1 = new ConstDependency("__next_webassembly_compile__(function() { return ", expr.range[0]);
            dep1.loc = expr.loc;
            parser.state.module.addPresentationalDependency(dep1);
            const dep2 = new ConstDependency("})", expr.range[1]);
            dep2.loc = expr.loc;
            parser.state.module.addPresentationalDependency(dep2);
            handleExpression();
        };
        /**
     * This expression handler allows to wrap a WebAssembly.instatiate invocation with a
     * function call where we can warn about WASM code generation not being allowed
     * but actually execute the expression.
     *
     * Note that we don't update `usingIndirectEval`, i.e. we don't abort a production build
     * since we can't determine statically if the first parameter is a module (legit use) or
     * a buffer (dynamic code generation).
     */ const handleWrapWasmInstantiateExpression = (expr)=>{
            if (!isInMiddlewareLayer(parser)) {
                return;
            }
            if (dev) {
                const { ConstDependency  } = wp.dependencies;
                const dep1 = new ConstDependency("__next_webassembly_instantiate__(function() { return ", expr.range[0]);
                dep1.loc = expr.loc;
                parser.state.module.addPresentationalDependency(dep1);
                const dep2 = new ConstDependency("})", expr.range[1]);
                dep2.loc = expr.loc;
                parser.state.module.addPresentationalDependency(dep2);
            }
        };
        /**
     * Declares an environment variable that is being used in this module
     * through this static analysis.
     */ const addUsedEnvVar = (envVarName)=>{
            const buildInfo = getModuleBuildInfo(parser.state.module);
            if (buildInfo.nextUsedEnvVars === undefined) {
                buildInfo.nextUsedEnvVars = new Set();
            }
            buildInfo.nextUsedEnvVars.add(envVarName);
        };
        /**
     * A handler for calls to `process.env` where we identify the name of the
     * ENV variable being assigned and store it in the module info.
     */ const handleCallMemberChain = (_, members)=>{
            if (members.length >= 2 && members[0] === "env") {
                addUsedEnvVar(members[1]);
                if (!isInMiddlewareLayer(parser)) {
                    return true;
                }
            }
        };
        /**
     * Handler to store original source location of static and dynamic imports into module's buildInfo.
     */ const handleImport = (node)=>{
            var ref;
            if (isInMiddlewareLayer(parser) && ((ref = node.source) == null ? void 0 : ref.value) && (node == null ? void 0 : node.loc)) {
                var ref7;
                const { module , source  } = parser.state;
                const buildInfo = getModuleBuildInfo(module);
                if (!buildInfo.importLocByPath) {
                    buildInfo.importLocByPath = new Map();
                }
                const importedModule = (ref7 = node.source.value) == null ? void 0 : ref7.toString();
                buildInfo.importLocByPath.set(importedModule, {
                    sourcePosition: {
                        ...node.loc.start,
                        source: module.identifier()
                    },
                    sourceContent: source.toString()
                });
                if (!dev && isNodeJsModule(importedModule)) {
                    compilation.warnings.push(buildWebpackError({
                        message: `A Node.js module is loaded ('${importedModule}' at line ${node.loc.start.line}) which is not supported in the Edge Runtime.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`,
                        compilation,
                        parser,
                        ...node
                    }));
                }
            }
        };
        /**
     * A noop handler to skip analyzing some cases.
     * Order matters: for it to work, it must be registered first
     */ const skip = ()=>isInMiddlewareLayer(parser) ? true : undefined;
        for (const prefix of [
            "",
            "global."
        ]){
            hooks.expression.for(`${prefix}Function.prototype`).tap(NAME, skip);
            hooks.expression.for(`${prefix}Function.bind`).tap(NAME, skip);
            hooks.call.for(`${prefix}eval`).tap(NAME, handleWrapExpression);
            hooks.call.for(`${prefix}Function`).tap(NAME, handleWrapExpression);
            hooks.new.for(`${prefix}Function`).tap(NAME, handleWrapExpression);
            hooks.call.for(`${prefix}WebAssembly.compile`).tap(NAME, handleWrapWasmCompileExpression);
            hooks.call.for(`${prefix}WebAssembly.instantiate`).tap(NAME, handleWrapWasmInstantiateExpression);
        }
        hooks.callMemberChain.for("process").tap(NAME, handleCallMemberChain);
        hooks.expressionMemberChain.for("process").tap(NAME, handleCallMemberChain);
        hooks.importCall.tap(NAME, handleImport);
        hooks.import.tap(NAME, handleImport);
        /**
     * Support static analyzing environment variables through
     * destructuring `process.env` or `process["env"]`:
     *
     * const { MY_ENV, "MY-ENV": myEnv } = process.env
     *         ^^^^^^   ^^^^^^
     */ hooks.declarator.tap(NAME, (declarator)=>{
            var ref, ref8;
            if (((ref = declarator.init) == null ? void 0 : ref.type) === "MemberExpression" && isProcessEnvMemberExpression(declarator.init) && ((ref8 = declarator.id) == null ? void 0 : ref8.type) === "ObjectPattern") {
                for (const property of declarator.id.properties){
                    if (property.type === "RestElement") continue;
                    if (property.key.type === "Literal" && typeof property.key.value === "string") {
                        addUsedEnvVar(property.key.value);
                    } else if (property.key.type === "Identifier") {
                        addUsedEnvVar(property.key.name);
                    }
                }
                if (!isInMiddlewareLayer(parser)) {
                    return true;
                }
            }
        });
        if (!dev) {
            // do not issue compilation warning on dev: invoking code will provide details
            registerUnsupportedApiHooks(parser, compilation);
        }
    };
}
async function findEntryEdgeFunctionConfig(entryDependency, resolver) {
    var ref;
    if (entryDependency == null ? void 0 : (ref = entryDependency.request) == null ? void 0 : ref.startsWith("next-")) {
        const absolutePagePath = new URL(entryDependency.request, "http://example.org").searchParams.get("absolutePagePath") ?? "";
        const pageFilePath = await new Promise((resolve)=>resolver.resolve({}, "/", absolutePagePath, {}, (err, path)=>resolve(err || path)));
        if (typeof pageFilePath === "string") {
            return {
                file: pageFilePath,
                config: (await getPageStaticInfo({
                    nextConfig: {},
                    pageFilePath,
                    isDev: false
                })).middleware
            };
        }
    }
}
function getExtractMetadata(params) {
    const { dev , compilation , metadataByEntry , compiler  } = params;
    const { webpack: wp  } = compiler;
    return async ()=>{
        metadataByEntry.clear();
        const resolver = compilation.resolverFactory.get("normal");
        const telemetry = traceGlobals.get("telemetry");
        for (const [entryName, entry] of compilation.entries){
            var ref;
            if (entry.options.runtime !== EDGE_RUNTIME_WEBPACK) {
                continue;
            }
            const entryDependency = (ref = entry.dependencies) == null ? void 0 : ref[0];
            const edgeFunctionConfig = await findEntryEdgeFunctionConfig(entryDependency, resolver);
            const { rootDir  } = getModuleBuildInfo(compilation.moduleGraph.getResolvedModule(entryDependency));
            const { moduleGraph  } = compilation;
            const modules = new Set();
            const addEntriesFromDependency = (dependency)=>{
                const module = moduleGraph.getModule(dependency);
                if (module) {
                    modules.add(module);
                }
            };
            entry.dependencies.forEach(addEntriesFromDependency);
            entry.includeDependencies.forEach(addEntriesFromDependency);
            const entryMetadata = {
                env: new Set(),
                wasmBindings: new Map(),
                assetBindings: new Map()
            };
            let ogImageGenerationCount = 0;
            for (const module1 of modules){
                var ref9;
                const buildInfo = getModuleBuildInfo(module1);
                /**
         * Check if it uses the image generation feature.
         */ if (!dev) {
                    const resource = module1.resource;
                    const hasOGImageGeneration = resource && /[\\/]node_modules[\\/]@vercel[\\/]og[\\/]dist[\\/]index.js$/.test(resource);
                    if (hasOGImageGeneration) {
                        ogImageGenerationCount++;
                    }
                }
                /**
         * When building for production checks if the module is using `eval`
         * and in such case produces a compilation error. The module has to
         * be in use.
         */ if (!dev && buildInfo.usingIndirectEval && isUsingIndirectEvalAndUsedByExports({
                    module: module1,
                    moduleGraph,
                    runtime: wp.util.runtime.getEntryRuntime(compilation, entryName),
                    usingIndirectEval: buildInfo.usingIndirectEval,
                    wp
                })) {
                    var ref10;
                    const id = module1.identifier();
                    if (/node_modules[\\/]regenerator-runtime[\\/]runtime\.js/.test(id)) {
                        continue;
                    }
                    if (edgeFunctionConfig == null ? void 0 : (ref10 = edgeFunctionConfig.config) == null ? void 0 : ref10.unstable_allowDynamicGlobs) {
                        telemetry == null ? void 0 : telemetry.record({
                            eventName: "NEXT_EDGE_ALLOW_DYNAMIC_USED",
                            payload: {
                                ...edgeFunctionConfig,
                                file: edgeFunctionConfig.file.replace(rootDir ?? "", ""),
                                fileWithDynamicCode: module1.userRequest.replace(rootDir ?? "", "")
                            }
                        });
                    }
                    if (!isDynamicCodeEvaluationAllowed(module1.userRequest, edgeFunctionConfig == null ? void 0 : edgeFunctionConfig.config, rootDir)) {
                        compilation.errors.push(buildWebpackError({
                            message: `Dynamic Code Evaluation (e. g. 'eval', 'new Function', 'WebAssembly.compile') not allowed in Edge Runtime ${typeof buildInfo.usingIndirectEval !== "boolean" ? `\nUsed by ${Array.from(buildInfo.usingIndirectEval).join(", ")}` : ""}\nLearn More: https://nextjs.org/docs/messages/edge-dynamic-code-evaluation`,
                            entryModule: module1,
                            compilation
                        }));
                    }
                }
                if (edgeFunctionConfig == null ? void 0 : (ref9 = edgeFunctionConfig.config) == null ? void 0 : ref9.regions) {
                    entryMetadata.regions = edgeFunctionConfig.config.regions;
                }
                /**
         * The entry module has to be either a page or a middleware and hold
         * the corresponding metadata.
         */ if (buildInfo == null ? void 0 : buildInfo.nextEdgeSSR) {
                    entryMetadata.edgeSSR = buildInfo.nextEdgeSSR;
                } else if (buildInfo == null ? void 0 : buildInfo.nextEdgeMiddleware) {
                    entryMetadata.edgeMiddleware = buildInfo.nextEdgeMiddleware;
                } else if (buildInfo == null ? void 0 : buildInfo.nextEdgeApiFunction) {
                    entryMetadata.edgeApiFunction = buildInfo.nextEdgeApiFunction;
                }
                /**
         * If there are env vars found in the module, append them to the set
         * of env vars for the entry.
         */ if ((buildInfo == null ? void 0 : buildInfo.nextUsedEnvVars) !== undefined) {
                    for (const envName of buildInfo.nextUsedEnvVars){
                        entryMetadata.env.add(envName);
                    }
                }
                /**
         * If the module is a WASM module we read the binding information and
         * append it to the entry wasm bindings.
         */ if (buildInfo == null ? void 0 : buildInfo.nextWasmMiddlewareBinding) {
                    entryMetadata.wasmBindings.set(buildInfo.nextWasmMiddlewareBinding.name, buildInfo.nextWasmMiddlewareBinding.filePath);
                }
                if (buildInfo == null ? void 0 : buildInfo.nextAssetMiddlewareBinding) {
                    entryMetadata.assetBindings.set(buildInfo.nextAssetMiddlewareBinding.name, buildInfo.nextAssetMiddlewareBinding.filePath);
                }
                /**
         * Append to the list of modules to process outgoingConnections from
         * the module that is being processed.
         */ for (const conn of moduleGraph.getOutgoingConnections(module1)){
                    if (conn.module) {
                        modules.add(conn.module);
                    }
                }
            }
            telemetry == null ? void 0 : telemetry.record({
                eventName: EVENT_BUILD_FEATURE_USAGE,
                payload: {
                    featureName: "vercelImageGeneration",
                    invocationCount: ogImageGenerationCount
                }
            });
            metadataByEntry.set(entryName, entryMetadata);
        }
    };
}
export default class MiddlewarePlugin {
    constructor({ dev , sriEnabled , hasFontLoaders  }){
        this.dev = dev;
        this.sriEnabled = sriEnabled;
        this.hasFontLoaders = hasFontLoaders;
    }
    apply(compiler) {
        compiler.hooks.compilation.tap(NAME, (compilation, params)=>{
            const { hooks  } = params.normalModuleFactory;
            /**
       * This is the static code analysis phase.
       */ const codeAnalyzer = getCodeAnalyzer({
                dev: this.dev,
                compiler,
                compilation
            });
            hooks.parser.for("javascript/auto").tap(NAME, codeAnalyzer);
            hooks.parser.for("javascript/dynamic").tap(NAME, codeAnalyzer);
            hooks.parser.for("javascript/esm").tap(NAME, codeAnalyzer);
            /**
       * Extract all metadata for the entry points in a Map object.
       */ const metadataByEntry = new Map();
            compilation.hooks.finishModules.tapPromise(NAME, getExtractMetadata({
                compilation,
                compiler,
                dev: this.dev,
                metadataByEntry
            }));
            /**
       * Emit the middleware manifest.
       */ compilation.hooks.processAssets.tap({
                name: "NextJsMiddlewareManifest",
                stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
            }, getCreateAssets({
                compilation,
                metadataByEntry,
                opts: {
                    sriEnabled: this.sriEnabled,
                    hasFontLoaders: this.hasFontLoaders
                }
            }));
        });
    }
};
export async function handleWebpackExternalForEdgeRuntime({ request , context , contextInfo , getResolve  }) {
    if (contextInfo.issuerLayer === "middleware" && isNodeJsModule(request)) {
        // allows user to provide and use their polyfills, as we do with buffer.
        try {
            await getResolve()(context, request);
        } catch  {
            return `root  globalThis.__import_unsupported('${request}')`;
        }
    }
}

//# sourceMappingURL=middleware-plugin.js.map