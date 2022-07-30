#!/usr/bin/env node
import {createRequire} from 'module'
import sade from 'sade'
import {configEnvFile} from './index.js'
const pkg = createRequire(import.meta.url)('../package.json')
sade('cef <config-file>')
	.version(pkg.version)
	.describe(pkg.description)
	.option('-d, --destination <d>', 'destination path to env file')
	.option('-e, --extension <e>', 'extension to env file name')
	.option('-p, --prefix <p>', 'prefix to variables name')
	.option('-E, --env <e>', 'how to access variables')
	.action(configEnvFile)
	.parse(process.argv)
