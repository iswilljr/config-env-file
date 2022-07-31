import {readFile, writeFile} from 'fs/promises'
import {resolve} from 'path'

function c(input: string, delimiter: string, transform: (part: string, index: number, parts: string[]) => string) {
	const splitRegexp = [/([a-z0-9])([A-Z])/g, /([A-Z])([A-Z][a-z])/g]
	const stripRegexp = /[^A-Z0-9]+/gi

	function replace(input: string, re: RegExp | RegExp[], value: string) {
		if (re instanceof RegExp) return input.replace(re, value)
		return re.reduce((input, re) => input.replace(re, value), input)
	}

	let result = replace(replace(input, splitRegexp, '$1\0$2'), stripRegexp, '\0')
	let start = 0
	let end = result.length

	while (result.charAt(start) === '\0') start++
	while (result.charAt(end - 1) === '\0') end--

	return result.slice(start, end).split('\0').map(transform).join(delimiter)
}

const constant = (s: string) => c(s, '_', str => str.toUpperCase())
const camel = (s: string) => c(s, '', (s, i) => (i === 0 ? s.toLowerCase() : `${s.charAt(0)}${s.slice(1).toLowerCase()}`))

type Options = {
	destination?: string
	extension?: string
	prefix?: string
	env?: 'process' | 'import'
}

const getCfg = (c: object, p: string = '', t: 'file' | 'config' = 'file', e: 'process' | 'import' = 'process') => {
	const isF = t === 'file'
	const prefix = constant(p)
	return (
		Object.entries(c)
			.map(v => {
				const name = constant(v[0])
				const key = `${prefix && !name.includes(prefix) ? `${prefix}_` : ''}${name}`
				return isF ? `${key}=${v[1]}` : `${camel(name)}: ${e === 'process' ? 'process.env.' : 'import.meta.env.'}${key}`
			})
			.join(isF ? '\n' : ',\n ') + (isF ? '\n' : '')
	)
}

export const configEnvFile = async (file: string, options: Options = {}) => {
	const {destination: dest = '.', extension: ext = 'local', prefix, env} = options
	try {
		if (!file) throw new Error('File is required')
		if (env && !['process', 'import'].includes(env)) throw Error(`recived '${env}' expected 'process' or 'import'`)

		const cfgFile = JSON.parse(await readFile(resolve(file), 'utf8'))
		let cfg = Object.fromEntries(Object.entries(cfgFile).map(v => [constant(v[0]), v[1]]))

		await writeFile(resolve(dest, `.env.${ext}`), getCfg(cfg, prefix))
		console.log(`Check your .env.${ext}\nyour config:\nconst config = { \n ${getCfg(cfg, prefix, 'config', env)}\n}`)
	} catch (e: any) {
		console.error('error:', e.message)
	}
}
