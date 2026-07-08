#!/usr/bin/env node
/**
 * Melos-like local orchestration for the RN multi-repo shell.
 * Commands: bootstrap | point-local | list | validate | clean | run | start | help
 */
const fs = require('fs');
const path = require('path');
const {spawnSync} = require('child_process');

const MAIN_APP_ROOT = path.resolve(__dirname, '..');
const ROOT = path.resolve(MAIN_APP_ROOT, '..');
const CONFIG_PATH = path.join(MAIN_APP_ROOT, 'microapps.yaml');
const MARKER_PATH = path.join(ROOT, '.microapps-local.json');
const MAIN_PACKAGE_PATH = path.join(MAIN_APP_ROOT, 'package.json');

function fail(message) {
  console.error(`[microapps] ${message}`);
  process.exit(1);
}

function info(message) {
  console.log(`[microapps] ${message}`);
}

function parseSimpleYaml(text) {
  // Minimal YAML subset parser for this config shape (no external deps).
  const lines = text.split(/\r?\n/);
  const root = {};
  const stack = [{indent: -1, value: root, key: null, inList: false}];

  function current() {
    return stack[stack.length - 1];
  }

  function ensureObject(node) {
    if (node.value === null || typeof node.value !== 'object' || Array.isArray(node.value)) {
      node.value = {};
      if (node.parentKey !== undefined && node.parentValue) {
        node.parentValue[node.parentKey] = node.value;
      }
    }
  }

  for (let raw of lines) {
    if (!raw.trim() || raw.trim().startsWith('#')) {
      continue;
    }
    const indent = raw.match(/^\s*/)[0].length;
    const line = raw.trim();
    while (stack.length > 1 && indent <= current().indent) {
      stack.pop();
    }
    const ctx = current();

    if (line.startsWith('- ')) {
      const item = line.slice(2).trim().replace(/^["']|["']$/g, '');
      if (!Array.isArray(ctx.value)) {
        if (ctx.key && ctx.parentValue) {
          ctx.parentValue[ctx.key] = [];
          ctx.value = ctx.parentValue[ctx.key];
        } else {
          fail(`list item without array context: ${line}`);
        }
      }
      ctx.value.push(item);
      continue;
    }

    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (!match) {
      fail(`unsupported yaml line: ${line}`);
    }
    const key = match[1].trim();
    let value = match[2].trim();
    ensureObject(ctx);
    if (value === '') {
      const placeholder = {};
      ctx.value[key] = placeholder;
      stack.push({
        indent,
        value: placeholder,
        key,
        parentValue: ctx.value,
        parentKey: key,
      });
      continue;
    }
    value = value.replace(/^["']|["']$/g, '');
    ctx.value[key] = value;
  }
  return root;
}

function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    fail(`missing ${path.basename(CONFIG_PATH)}`);
  }
  const config = parseSimpleYaml(fs.readFileSync(CONFIG_PATH, 'utf8'));
  if (!Array.isArray(config.packages) || config.packages.length === 0) {
    fail('microapps.yaml packages[] is required');
  }
  if (!config.mainApp) {
    fail('microapps.yaml mainApp is required');
  }
  if (!config.graph || typeof config.graph !== 'object') {
    fail('microapps.yaml graph is required');
  }
  config.localDependencyRange = config.localDependencyRange || '*';
  config.dependencyMode = config.dependencyMode || 'local';
  config.gitDependencyRefs = config.gitDependencyRefs || {};
  return config;
}

function readPackageJson(packageDir) {
  const filePath = path.join(ROOT, packageDir, 'package.json');
  if (!fs.existsSync(filePath)) {
    fail(`missing package.json in ${packageDir}`);
  }
  return {
    filePath,
    data: JSON.parse(fs.readFileSync(filePath, 'utf8')),
  };
}

function writePackageJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function syncRootResolutions(config, dependencyMode, dryRun) {
  const filePath = MAIN_PACKAGE_PATH;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.resolutions = data.resolutions || {};
  let changed = false;
  for (const [packageName, gitRef] of Object.entries(config.gitDependencyRefs)) {
    if (dependencyMode === 'git') {
      if (data.resolutions[packageName] !== gitRef) {
        data.resolutions[packageName] = gitRef;
        changed = true;
      }
      continue;
    }
    if (data.resolutions[packageName]) {
      delete data.resolutions[packageName];
      changed = true;
    }
  }
  if (changed && !dryRun) {
    writePackageJson(filePath, data);
  }
  return changed;
}

function getGitUrl(gitRef) {
  return gitRef.replace(/^git\+/, '').split('#')[0];
}

function getGitBranch(gitRef) {
  return gitRef.includes('#') ? gitRef.split('#')[1] : null;
}

function getLocalDependencyRef(consumer, provider) {
  const consumerDir = path.join(ROOT, consumer);
  const providerDir = path.join(ROOT, provider);
  const relativePath = path.relative(consumerDir, providerDir).split(path.sep).join('/');
  return `link:${relativePath.startsWith('.') ? relativePath : `./${relativePath}`}`;
}

function getDependencyRef(config, packageName, dependencyMode = config.dependencyMode) {
  if (dependencyMode === 'git') {
    const gitRef = config.gitDependencyRefs[packageName];
    if (!gitRef) {
      fail(`missing gitDependencyRefs.${packageName} in microapps.yaml`);
    }
    return gitRef;
  }
  return config.localDependencyRange;
}

function getProviderDependencyRef(config, consumer, provider, providerPkg, dependencyMode) {
  if (dependencyMode === 'local') {
    return getLocalDependencyRef(consumer, provider);
  }
  return getDependencyRef(config, providerPkg.name, dependencyMode);
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || ROOT,
    stdio: 'inherit',
    env: process.env,
    shell: false,
  });
  if (result.status !== 0) {
    fail(`command failed: ${command} ${args.join(' ')}`);
  }
}

function resolveScope(config, scopeName) {
  if (!scopeName) {
    return config.packages;
  }
  if (config.scopes && Array.isArray(config.scopes[scopeName])) {
    return config.scopes[scopeName];
  }
  if (config.packages.includes(scopeName)) {
    return [scopeName];
  }
  fail(`unknown scope "${scopeName}". Use apps|microapps|microfronts|libs|<package>`);
}

function commandHelp() {
  console.log(`Usage: yarn microapps <command> [options]

Melos-like local development for multi-repo RN packages.

Commands:
  bootstrap              submodule update + yarn + point-local + validate
  point-local            rewrite graph deps to configured refs
  setup-local            clone missing repos and setup local links
  validate               check package links + graph deps + no nested node_modules
  list                   list packages / filtered by --scope
  clean                  remove nested node_modules (keep root)
  start                  start Metro for mainApp
  run <script>           yarn <script> for each package in scope

Options:
  --scope <name>         apps | microapps | microfronts | libs | <package-dir>
  --dry-run              print planned package.json edits without writing

Examples (like Melos):
  yarn microapps bootstrap
  yarn microapps point-local
  yarn microapps setup-local
  yarn microapps list --scope microfronts
  yarn microapps run prepare --scope libs
  yarn microapps start
`);
}

function commandList(config, scopeName) {
  const selected = resolveScope(config, scopeName);
  info(`packages (${selected.length}):`);
  for (const packageDir of selected) {
    const {data} = readPackageJson(packageDir);
    const role =
      packageDir === config.mainApp
        ? 'mainApp'
        : (config.scopes.microapps || []).includes(packageDir)
          ? 'microapp'
          : (config.scopes.microfronts || []).includes(packageDir)
            ? 'microfront'
            : 'package';
    console.log(`- ${packageDir}  name=${data.name}  version=${data.version || '-'}  role=${role}`);
  }
}

function cloneMissingPackages(config) {
  for (const packageDir of config.packages) {
    if (packageDir === config.mainApp || packageDir.includes('/')) {
      continue;
    }
    const targetDir = path.join(ROOT, packageDir);
    if (fs.existsSync(targetDir)) {
      continue;
    }
    const gitRef = config.gitDependencyRefs[packageDir];
    if (!gitRef) {
      fail(`missing gitDependencyRefs.${packageDir} in microapps.yaml`);
    }
    const args = ['clone'];
    const branch = getGitBranch(gitRef);
    if (branch) {
      args.push('--branch', branch);
    }
    args.push(getGitUrl(gitRef), packageDir);
    info(`clone ${packageDir}`);
    run('git', args);
  }
}

function applyDependencyRefs(config, dependencyMode, dryRun) {
  const edits = [];
  for (const [consumer, providers] of Object.entries(config.graph)) {
    const {filePath, data} = readPackageJson(consumer);
    data.dependencies = data.dependencies || {};
    let changed = false;
    for (const provider of providers) {
      const {data: providerPkg} = readPackageJson(provider);
      const packageName = providerPkg.name;
      const range = getProviderDependencyRef(config, consumer, provider, providerPkg, dependencyMode);
      const previous = data.dependencies[packageName];
      if (previous !== range) {
        data.dependencies[packageName] = range;
        changed = true;
        edits.push({consumer, packageName, previous: previous || null, next: range});
      }
    }
    if (changed && !dryRun) {
      writePackageJson(filePath, data);
    }
  }
  const hasResolutionEdits = syncRootResolutions(config, dependencyMode, dryRun);
  if (edits.length === 0 && !hasResolutionEdits) {
    info(`${dependencyMode}: dependencies already aligned`);
  } else {
    info(`${dependencyMode}: ${dryRun ? 'would update' : 'updated'} ${edits.length} dep(s)`);
    for (const edit of edits) {
      console.log(
        `  ${edit.consumer}: ${edit.packageName} ${edit.previous || '(missing)'} -> ${edit.next}`,
      );
    }
    if (hasResolutionEdits) {
      console.log(`  root: package resolutions ${dryRun ? 'would change' : 'updated'}`);
    }
  }
  if (!dryRun) {
    const marker = {
      mode: dependencyMode,
      updatedAt: new Date().toISOString(),
      localDependencyRange: config.localDependencyRange,
      dependencyMode,
      gitDependencyRefs: config.gitDependencyRefs,
      packages: config.packages,
      graph: config.graph,
    };
    fs.writeFileSync(MARKER_PATH, `${JSON.stringify(marker, null, 2)}\n`);
    info(`wrote ${path.basename(MARKER_PATH)}`);
  }
}

function applyPointLocal(config, dryRun) {
  applyDependencyRefs(config, config.dependencyMode, dryRun);
}

function commandValidate(config, dependencyMode = config.dependencyMode) {
  const rootNodeModules = path.join(MAIN_APP_ROOT, 'node_modules');
  if (!fs.existsSync(rootNodeModules)) {
    console.warn('  WARN main app node_modules missing. Run: yarn microapps bootstrap');
  }
  let errors = 0;
  for (const packageDir of config.packages) {
    const {data} = readPackageJson(packageDir);
    const linkPath = path.join(rootNodeModules, data.name);
    if (fs.existsSync(rootNodeModules) && !fs.existsSync(linkPath)) {
      console.warn(`  WARN missing package link: node_modules/${data.name}`);
    }
    const nested = path.join(ROOT, packageDir, 'node_modules');
    if (fs.existsSync(nested)) {
      const entries = fs.readdirSync(nested).filter(name => name !== '.bin');
      if (entries.length > 0) {
        console.error(`  ERROR nested node_modules with packages in ${packageDir}`);
        errors += 1;
      } else {
        // Only .bin leftovers — warn but allow.
        console.warn(`  WARN empty/nested .bin node_modules in ${packageDir} (run clean)`);
      }
    }
  }
  for (const [consumer, providers] of Object.entries(config.graph)) {
    const {data} = readPackageJson(consumer);
    for (const provider of providers) {
      const {data: providerPkg} = readPackageJson(provider);
      const declared = data.dependencies && data.dependencies[providerPkg.name];
      const expectedRef = getProviderDependencyRef(
        config,
        consumer,
        provider,
        providerPkg,
        dependencyMode,
      );
      if (!declared) {
        console.error(`  ERROR ${consumer} missing dependency ${providerPkg.name}`);
        errors += 1;
      } else if (declared !== expectedRef && !declared.startsWith('workspace:')) {
        console.warn(
          `  WARN ${consumer} -> ${providerPkg.name} is "${declared}" (expected "${expectedRef}")`,
        );
      }
    }
  }
  if (errors > 0) {
    fail(`validate failed with ${errors} error(s)`);
  }
  info('validate: OK (package links + dependency graph)');
}

function commandSetupLocal(config) {
  info('setup-local: clone missing repositories');
  cloneMissingPackages(config);
  info('setup-local: point graph dependencies to local workspaces');
  applyDependencyRefs(config, 'local', false);
  info('setup-local: yarn install (main app only)');
  run('yarn', ['install'], {cwd: MAIN_APP_ROOT});
  commandClean(config);
  commandValidate(config, 'local');
  info('setup-local: complete — develop with `yarn microapps start`');
}

function commandClean(config) {
  for (const packageDir of config.packages) {
    const nested = path.join(ROOT, packageDir, 'node_modules');
    if (fs.existsSync(nested)) {
      fs.rmSync(nested, {recursive: true, force: true});
      info(`removed ${packageDir}/node_modules`);
    }
  }
  info('clean: done (main app node_modules kept)');
}

function commandBootstrap(config) {
  info('bootstrap: submodule update');
  if (fs.existsSync(path.join(ROOT, '.gitmodules'))) {
    const result = spawnSync('git', ['submodule', 'update', '--init', '--recursive'], {
      cwd: ROOT,
      stdio: 'inherit',
      env: process.env,
    });
    if (result.status !== 0) {
      console.warn(
        '[microapps] WARN submodule update failed (packages may be plain checkouts). Continuing…',
      );
    }
  } else {
    info('no .gitmodules — skipping submodule update');
  }
  info('bootstrap: yarn install (main app only)');
  run('yarn', ['install'], {cwd: MAIN_APP_ROOT});
  applyPointLocal(config, false);
  commandClean(config);
  commandValidate(config);
  info('bootstrap: complete — develop with `yarn microapps start`');
}

function commandRun(config, scriptName, scopeName) {
  if (!scriptName) {
    fail('run requires a script name, e.g. yarn microapps run prepare --scope libs');
  }
  const selected = resolveScope(config, scopeName || 'libs');
  for (const packageDir of selected) {
    const {data} = readPackageJson(packageDir);
    if (!data.scripts || !data.scripts[scriptName]) {
      info(`skip ${packageDir}: no script "${scriptName}"`);
      continue;
    }
    info(`run ${data.name} → ${scriptName}`);
    run('yarn', [scriptName], {cwd: path.join(ROOT, packageDir)});
  }
}

function commandStart(config, extraArgs) {
  const {data} = readPackageJson(config.mainApp);
  info(`start ${data.name}${extraArgs.length ? ` (${extraArgs.join(' ')})` : ''}`);
  run('yarn', ['start', ...extraArgs], {cwd: path.join(ROOT, config.mainApp)});
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const command = args[0] || 'help';
  let scope;
  let dryRun = false;
  const rest = [];
  for (let i = 1; i < args.length; i += 1) {
    if (args[i] === '--scope') {
      scope = args[i + 1];
      i += 1;
      continue;
    }
    if (args[i] === '--dry-run') {
      dryRun = true;
      continue;
    }
    rest.push(args[i]);
  }
  return {command, scope, dryRun, rest};
}

function main() {
  const {command, scope, dryRun, rest} = parseArgs(process.argv);
  if (command === 'help' || command === '--help' || command === '-h') {
    commandHelp();
    return;
  }
  const config = loadConfig();
  switch (command) {
    case 'bootstrap':
      commandBootstrap(config);
      break;
    case 'point-local':
      applyPointLocal(config, dryRun);
      break;
    case 'setup-local':
      commandSetupLocal(config);
      break;
    case 'validate':
      commandValidate(config);
      break;
    case 'list':
      commandList(config, scope);
      break;
    case 'clean':
      commandClean(config);
      break;
    case 'run':
      commandRun(config, rest[0], scope);
      break;
    case 'start':
      commandStart(config, rest);
      break;
    default:
      fail(`unknown command "${command}". Try: yarn microapps help`);
  }
}

main();
